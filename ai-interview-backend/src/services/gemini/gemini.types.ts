import { z } from 'zod'

export const generatedQuestionSchema = z.object({
  text: z.string().trim().min(10).max(1000),
  order: z.number().int().positive(),
})

export const generatedQuestionsSchema = z.object({
  questions: z.array(generatedQuestionSchema).min(1).max(20),
})
export type GeneratedQuestions = z.infer<typeof generatedQuestionsSchema>

export const answerEvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  feedback: z.string().trim().min(1).max(2000),
  keywords: z.array(z.string().trim().min(1).max(60)).max(15).default([]),
})
export type AnswerEvaluation = z.infer<typeof answerEvaluationSchema>

export const interviewReportSchema = z.object({
  overallScore: z.number().min(0).max(10),
  confidence: z.number().min(0).max(10).nullable().optional(),
  technical: z.number().min(0).max(10).nullable().optional(),
  communication: z.number().min(0).max(10).nullable().optional(),
  strengths: z.array(z.string().trim().min(1).max(300)).max(10).default([]),
  weaknesses: z.array(z.string().trim().min(1).max(300)).max(10).default([]),
  suggestions: z.array(z.string().trim().min(1).max(300)).max(10).default([]),
  summary: z.string().trim().min(1).max(2000),
})
export type InterviewReportResult = z.infer<typeof interviewReportSchema>

export const resumeAnalysisSchema = z.object({
  skills: z.array(z.string().trim().min(1).max(60)).max(40).default([]),
  experienceYears: z.number().min(0).max(60).default(0),
  projects: z.array(z.string().trim().min(1).max(150)).max(20).default([]),
})
export type ResumeAnalysisResult = z.infer<typeof resumeAnalysisSchema>
