export interface QuestionDto {
  id: string
  interviewId: string
  text: string
  order: number
  createdAt: string
}

export interface AnswerDto {
  id: string
  text: string
  score: number | null
  feedback: string | null
}

export interface QuestionWithAnswerDto {
  id: string
  text: string
  order: number
  answer: AnswerDto | null
}

export interface InterviewSummaryDto {
  id: string
  mode: string
  title: string | null
  status: string
  score: number | null
  createdAt: string
}

export interface InterviewCreatedDto {
  id: string
  userId: string
  mode: string
  title: string | null
  status: string
  questionCount: number
  createdAt: string
}

export interface ReportDto {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  summary: string
}

export interface InterviewDetailDto {
  id: string
  mode: string
  title: string | null
  status: string
  questions: QuestionWithAnswerDto[]
  report: ReportDto | null
}

export interface EvaluationDto {
  score: number
  feedback: string
  keywords: string[]
}

export interface SubmitAnswerResultDto {
  answer: AnswerDto
  evaluation: EvaluationDto
}
