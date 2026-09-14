import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai'
import type { ZodType } from 'zod'
import { env } from '@/config/env'
import { logger } from '@/utils/logger'
import { ServiceUnavailableError } from '@/utils/errors'
import {
  answerEvaluationSchema,
  generatedQuestionsSchema,
  interviewReportSchema,
  resumeAnalysisSchema,
  type AnswerEvaluation,
  type GeneratedQuestions,
  type InterviewReportResult,
  type ResumeAnalysisResult,
} from './gemini.types'

const MAX_ATTEMPTS = 3
const BASE_BACKOFF_MS = 500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Strips markdown code fences some models still wrap JSON in, just in case. */
function stripCodeFence(text: string): string {
  const trimmed = text.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return fenced ? fenced[1] : trimmed
}

class GeminiService {
  private client: GoogleGenerativeAI
  private model: GenerativeModel

  constructor() {
    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY)
    this.model = this.client.getGenerativeModel({ model: env.GEMINI_MODEL })
  }


  private async generateStructured<T>(
    prompt: string,
    schema: ZodType<T>,
    context: string,
  ): Promise<T> {
    let lastError: unknown

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const result = await this.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        })

        const rawText = result.response.text()
        const jsonText = stripCodeFence(rawText)

        let parsedJson: unknown
        try {
          parsedJson = JSON.parse(jsonText)
        } catch (parseError) {
          logger.error(
            { context, attempt, err: parseError },
            'Gemini returned malformed JSON',
          )
          throw new ServiceUnavailableError(
            'The AI service returned an unexpected response. Please try again.',
          )
        }

        const validated = schema.safeParse(parsedJson)
        if (!validated.success) {
          logger.error(
            { context, attempt, issues: validated.error.issues },
            'Gemini output failed schema validation',
          )
          throw new ServiceUnavailableError(
            'The AI service returned an unexpected response. Please try again.',
          )
        }

        return validated.data
      } catch (error) {
        lastError = error

        // Don't retry our own validation failures — retrying won't fix a
        // schema mismatch caused by a bad prompt, and could waste attempts
        // masking a real integration bug.
        if (error instanceof ServiceUnavailableError) {
          break
        }

        logger.warn(
          { context, attempt, err: error },
          'Gemini request failed, will retry if attempts remain',
        )

        if (attempt < MAX_ATTEMPTS) {
          await sleep(BASE_BACKOFF_MS * 2 ** (attempt - 1))
        }
      }
    }

    logger.error({ context, err: lastError }, 'Gemini request exhausted all retry attempts')
    throw new ServiceUnavailableError(
      'The AI service is temporarily unavailable. Please try again shortly.',
    )
  }

  async generateInterviewQuestions(params: {
    mode: string
    modeLabel: string
    questionCount: number
    resumeSummary?: string
  }): Promise<GeneratedQuestions> {
    const { mode, modeLabel, questionCount, resumeSummary } = params

    const prompt = `You are an experienced technical interviewer creating questions for a mock interview.

Interview track: ${modeLabel} (${mode})
Number of questions to generate: exactly ${questionCount}
${resumeSummary
        ? `Candidate background (from their resume, use it to make questions relevant to their real experience):\n${resumeSummary}`
        : 'No resume is available for this candidate — ask well-rounded questions appropriate for the track without assuming specific prior projects.'
      }

Write exactly ${questionCount} interview questions appropriate for this track, ordered from foundational to more advanced, with realistic difficulty for a real interview (not trivia). Each question should be answerable in a few sentences to a paragraph.

Respond with ONLY valid JSON matching this shape, no commentary, no markdown:
{
  "questions": [
    { "text": "string", "order": 1 }
  ]
}`

    return this.generateStructured(prompt, generatedQuestionsSchema, 'generateInterviewQuestions')
  }

  async evaluateAnswer(params: {
    modeLabel: string
    questionText: string
    answerText: string
  }): Promise<AnswerEvaluation> {
    const { modeLabel, questionText, answerText } = params

    const prompt = `You are an experienced technical interviewer evaluating a candidate's answer in a ${modeLabel} mock interview.

Question: "${questionText}"

Candidate's answer: "${answerText}"

Evaluate the answer on correctness, depth, and clarity, as a real interviewer would. Be constructive but honest — don't inflate the score.

Respond with ONLY valid JSON matching this shape, no commentary, no markdown:
{
  "score": <number 0-10, one decimal place>,
  "feedback": "<2-4 sentences of specific, actionable feedback>",
  "keywords": ["<relevant technical terms or concepts the answer touched on or should have>"]
}`

    return this.generateStructured(prompt, answerEvaluationSchema, 'evaluateAnswer')
  }

  async generateInterviewReport(params: {
    modeLabel: string
    qaPairs: Array<{ question: string; answer: string; score: number; feedback: string }>
  }): Promise<InterviewReportResult> {
    const { modeLabel, qaPairs } = params

    const transcript = qaPairs
      .map(
        (qa, i) =>
          `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}\nScore: ${qa.score}/10 — ${qa.feedback}`,
      )
      .join('\n\n')

    const prompt = `You are an experienced technical interviewer writing a final performance report for a candidate who just completed a ${modeLabel} mock interview.

Full transcript with per-question scores and feedback already given:

${transcript}

Write a final report summarizing overall performance across the whole interview.

Respond with ONLY valid JSON matching this shape, no commentary, no markdown:
{
  "overallScore": <number 0-10, one decimal place, should reflect the per-question scores above>,
  "strengths": ["<specific strength observed across the interview>"],
  "weaknesses": ["<specific area to improve>"],
  "suggestions": ["<concrete, actionable suggestion>"],
  "summary": "<2-4 sentence overall summary>"
}`

    return this.generateStructured(prompt, interviewReportSchema, 'generateInterviewReport')
  }

  async analyzeResume(extractedText: string): Promise<ResumeAnalysisResult> {
    const truncated = extractedText.slice(0, 15_000)

    const prompt = `You are analyzing a candidate's resume, extracted as plain text from a PDF (formatting may be imperfect).

Resume text:
"""
${truncated}
"""

Extract the following, based only on what's actually in the text — do not invent anything:
- A list of concrete technical/professional skills mentioned.
- Total years of professional experience (your best estimate from dates/descriptions; 0 if unclear).
- A short list of named projects or notable work mentioned.

Respond with ONLY valid JSON matching this shape, no commentary, no markdown:
{
  "skills": ["string"],
  "experienceYears": <number>,
  "projects": ["string"]
}`

    return this.generateStructured(prompt, resumeAnalysisSchema, 'analyzeResume')
  }
}

export const geminiService = new GeminiService()
