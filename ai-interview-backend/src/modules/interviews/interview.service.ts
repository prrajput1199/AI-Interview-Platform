import { Prisma } from '../../../generated/prisma/client'
import { prisma } from '@/prisma/client'
import { geminiService } from '@/services/gemini/gemini.service'
import { resumeService } from '@/modules/resume/resume.service'
import { getModeLabel } from '@/modules/interview-modes/interview-mode.service'
import { DEFAULT_QUESTION_COUNT, env } from '@/config/env'
import { buildPaginationMeta, type PaginationParams } from '@/utils/pagination'
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '@/utils/errors'
import type {
  AnswerDto,
  EvaluationDto,
  InterviewCreatedDto,
  InterviewDetailDto,
  InterviewSummaryDto,
  QuestionDto,
  ReportDto,
  SubmitAnswerResultDto,
} from './interview.types'
import type { CreateInterviewInput, SubmitAnswerInput } from './interview.validation'

const STATUS = {
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const

/** Builds a compact, prompt-friendly summary from a processed resume. Returns undefined if there's nothing usable. */
function summarizeResume(resume: {
  status: string
  extractedText: string
  analysis: Prisma.JsonValue | null
}): string | undefined {
  if (resume.status !== 'PROCESSED') return undefined

  const analysis = resume.analysis as
    | { skills?: string[]; experienceYears?: number; projects?: string[] }
    | null

  if (analysis && (analysis.skills?.length || analysis.projects?.length)) {
    const parts = [
      analysis.skills?.length ? `Skills: ${analysis.skills.join(', ')}` : null,
      typeof analysis.experienceYears === 'number'
        ? `Experience: ${analysis.experienceYears} years`
        : null,
      analysis.projects?.length ? `Projects: ${analysis.projects.join(', ')}` : null,
    ].filter(Boolean)
    return parts.join('\n')
  }

  return resume.extractedText.slice(0, 3000)
}

class InterviewService {
  async createInterview(userId: string, input: CreateInterviewInput): Promise<InterviewCreatedDto> {
    if (input.resumeId) {
      // Ownership check only — ok if it's still PROCESSING, generation will
      // just fall back to no-resume context in that case.
      await resumeService.getResumeForOwnershipCheck(userId, input.resumeId)
    }

    const interview = await prisma.$transaction(async (tx) => {
      const wallet = await tx.creditwallet.findUnique({ where: { userId } })
      const balance = wallet?.balance ?? 0

      if (balance < env.CREDITS_PER_INTERVIEW) {
        throw new BadRequestError(
          `You need at least ${env.CREDITS_PER_INTERVIEW} credit to start an interview`,
          'INSUFFICIENT_CREDITS',
        )
      }

      const created = await tx.interview.create({
        data: {
          userId,
          resumeId: input.resumeId ?? null,
          mode: input.mode,
          title: input.title,
          status: STATUS.CREATED,
          QuestionCount: DEFAULT_QUESTION_COUNT,
        },
      })

      await tx.creditwallet.update({
        where: { userId },
        data: { balance: { decrement: env.CREDITS_PER_INTERVIEW } },
      })

      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -env.CREDITS_PER_INTERVIEW,
          type: 'USAGE',
          description: `Interview: ${created.id}`,
        },
      })

      return created
    })

    return {
      id: interview.id,
      userId: interview.userId,
      mode: interview.mode,
      title: interview.title,
      status: interview.status,
      questionCount: interview.QuestionCount,
      createdAt: interview.createdAt.toISOString(),
    }
  }

  async generateQuestions(userId: string, interviewId: string): Promise<QuestionDto[]> {
    const interview = await this.findOwnedInterview(userId, interviewId, { questions: true })

    if (interview.questions.length > 0) {
      throw new ConflictError('Questions have already been generated for this interview')
    }
    if (interview.status !== STATUS.CREATED) {
      throw new ConflictError('This interview is not in a state that allows generating questions')
    }

    let resumeSummary: string | undefined
    if (interview.resumeId) {
      const resume = await prisma.resume.findUnique({ where: { id: interview.resumeId } })
      if (resume) resumeSummary = summarizeResume(resume)
    }

    const generated = await geminiService.generateInterviewQuestions({
      mode: interview.mode,
      modeLabel: getModeLabel(interview.mode),
      questionCount: interview.QuestionCount,
      resumeSummary,
    })

    const questions = await prisma.$transaction(async (tx) => {
      await tx.question.createMany({
        data: generated.questions.map((q) => ({
          interviewId,
          text: q.text,
          order: q.order,
        })),
      })
      await tx.interview.update({
        where: { id: interviewId },
        data: { status: STATUS.IN_PROGRESS },
      })
      return tx.question.findMany({ where: { interviewId }, orderBy: { order: 'asc' } })
    })

    return questions.map((q) => ({
      id: q.id,
      interviewId: q.interviewId,
      text: q.text,
      order: q.order,
      createdAt: q.createdAt.toISOString(),
    }))
  }

  async getInterviewDetail(userId: string, interviewId: string): Promise<InterviewDetailDto> {
    const interview = await this.findOwnedInterview(userId, interviewId, {
      questions: { include: { answer: true }, orderBy: { order: 'asc' } },
      report: true,
    })

    return {
      id: interview.id,
      mode: interview.mode,
      title: interview.title,
      status: interview.status,
      questions: interview.questions.map((q) => ({
        id: q.id,
        text: q.text,
        order: q.order,
        answer: q.answer ? toAnswerDto(q.answer) : null,
      })),
      report: interview.report ? toReportDto(interview.report) : null,
    }
  }

  async submitAnswer(
    userId: string,
    interviewId: string,
    input: SubmitAnswerInput,
  ): Promise<SubmitAnswerResultDto> {
    const interview = await this.findOwnedInterview(userId, interviewId, {})

    if (interview.status === STATUS.COMPLETED) {
      throw new ConflictError('This interview has already been completed')
    }

    const question = await prisma.question.findUnique({ where: { id: input.questionId } })
    if (!question || question.interviewId !== interviewId) {
      throw new NotFoundError("That question doesn't belong to this interview")
    }

    const evaluation = await geminiService.evaluateAnswer({
      modeLabel: getModeLabel(interview.mode),
      questionText: question.text,
      answerText: input.answer,
    })

    let answer
    try {
      answer = await prisma.answer.create({
        data: {
          questionId: question.id,
          userId,
          text: input.answer,
          score: evaluation.score,
          feedback: evaluation.feedback,
          evaluatedAt: new Date(),
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('An answer has already been submitted for this question')
      }
      throw error
    }

    const evaluationDto: EvaluationDto = {
      score: evaluation.score,
      feedback: evaluation.feedback,
      keywords: evaluation.keywords,
    }

    return { answer: toAnswerDto(answer), evaluation: evaluationDto }
  }

  async completeInterview(userId: string, interviewId: string): Promise<ReportDto> {
    const interview = await this.findOwnedInterview(userId, interviewId, {
      questions: { include: { answer: true } },
      report: true,
    })

    // Idempotent: calling complete again just returns the existing report.
    if (interview.status === STATUS.COMPLETED && interview.report) {
      return toReportDto(interview.report)
    }

    if (interview.questions.length === 0) {
      throw new BadRequestError('Generate and answer questions before completing this interview')
    }
    const unanswered = interview.questions.filter((q) => !q.answer)
    if (unanswered.length > 0) {
      throw new BadRequestError(
        'Answer every question before completing this interview',
        'INTERVIEW_INCOMPLETE',
      )
    }

    const qaPairs = interview.questions
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((q) => ({
        question: q.text,
        answer: q.answer!.text,
        score: q.answer!.score ?? 0,
        feedback: q.answer!.feedback ?? '',
      }))

    const generatedReport = await geminiService.generateInterviewReport({
      modeLabel: getModeLabel(interview.mode),
      qaPairs,
    })

    const report = await prisma.$transaction(async (tx) => {
      const created = await tx.report.create({
        data: {
          interviewId,
          overAllScore: generatedReport.overallScore,
          confidence: generatedReport.confidence ?? null,
          technical: generatedReport.technical ?? null,
          communication: generatedReport.communication ?? null,
          strengths: generatedReport.strengths,
          weaknesses: generatedReport.weaknesses,
          suggestions: generatedReport.suggestions,
          summary: generatedReport.summary,
        },
      })

      await tx.interview.update({
        where: { id: interviewId },
        data: { status: STATUS.COMPLETED, score: generatedReport.overallScore },
      })

      return created
    },
      {
        maxWait: 10000,
        timeout: 30000,
      },)

    return toReportDto(report)
  }

  async listInterviews(
    userId: string,
    { page, limit }: PaginationParams,
  ): Promise<{ interviews: InterviewSummaryDto[]; pagination: ReturnType<typeof buildPaginationMeta> }> {
    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.interview.count({ where: { userId } }),
    ])

    return {
      interviews: interviews.map((i) => ({
        id: i.id,
        mode: i.mode,
        title: i.title,
        status: i.status,
        score: i.score,
        createdAt: i.createdAt.toISOString(),
      })),
      pagination: buildPaginationMeta(page, limit, total),
    }
  }

  async getReportForPdf(userId: string, interviewId: string) {
    const interview = await this.findOwnedInterview(userId, interviewId, {
      questions: { include: { answer: true }, orderBy: { order: 'asc' } },
      report: true,
    })

    if (!interview.report) {
      throw new BadRequestError(
        'This interview has no report yet — complete it first',
        'REPORT_NOT_READY',
      )
    }

    return {
      interviewTitle: interview.title ?? 'Mock interview',
      mode: interview.mode,
      overallScore: interview.report.overAllScore,
      summary: interview.report.summary,
      strengths: interview.report.strengths,
      weaknesses: interview.report.weaknesses,
      suggestions: interview.report.suggestions,
      questions: interview.questions.map((q) => ({
        order: q.order,
        text: q.text,
        answerText: q.answer?.text ?? null,
        score: q.answer?.score ?? null,
        feedback: q.answer?.feedback ?? null,
      })),
    }
  }

  /** Fetches an interview by id and throws unless it exists and belongs to `userId`. */
  private async findOwnedInterview<T extends Prisma.InterviewInclude>(
    userId: string,
    interviewId: string,
    include: T,
  ) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include,
    })
    if (!interview) throw new NotFoundError('Interview not found')
    if (interview.userId !== userId) {
      throw new ForbiddenError("You don't have access to this interview")
    }
    return interview as Prisma.InterviewGetPayload<{ include: T }>
  }
}

function toAnswerDto(answer: { id: string; text: string; score: number | null; feedback: string | null }): AnswerDto {
  return { id: answer.id, text: answer.text, score: answer.score, feedback: answer.feedback }
}

function toReportDto(report: {
  overAllScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  summary: string
}): ReportDto {
  return {
    overallScore: report.overAllScore,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    suggestions: report.suggestions,
    summary: report.summary,
  }
}

export const interviewService = new InterviewService()
