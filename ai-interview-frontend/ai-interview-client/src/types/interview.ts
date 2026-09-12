export type InterviewStatus = 'CREATED' | 'IN_PROGRESS' | 'COMPLETED'

export interface InterviewMode {
  value: string
  label: string
}

export interface Answer {
  id: string
  text: string
  score: number
  feedback: string
  keywords?: string[]
}

export interface Question {
  id: string
  text: string
  order: number
  answer?: Answer | null
}

export interface Interview {
  id: string
  userId?: string
  mode: string
  title: string
  status: InterviewStatus
  questionCount?: number
  score?: number
  questions?: Question[]
  report?: InterviewReport | null
  createdAt: string
}

export interface AnswerEvaluation {
  score: number
  feedback: string
  keywords: string[]
}

export interface SubmitAnswerResult {
  answer: Answer
  evaluation: AnswerEvaluation
}

export interface InterviewReport {
  id: string
  interviewId: string
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  summary: string
}