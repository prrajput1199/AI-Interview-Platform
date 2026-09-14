import { z } from 'zod'
import { INTERVIEW_MODE_VALUES } from '@/modules/interview-modes/interview-mode.service'

export const createInterviewSchema = z.object({
  mode: z.enum(INTERVIEW_MODE_VALUES, {
    message: `mode must be one of: ${INTERVIEW_MODE_VALUES.join(', ')}`,
  }),
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(120),
  resumeId: z.string().trim().min(1).optional(),
})
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>

export const interviewIdParamsSchema = z.object({
  interviewId: z.string().min(1, 'Interview id is required'),
})

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1, 'Question id is required'),
  answer: z.string().trim().min(1, 'Answer cannot be empty').max(8000),
})
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>

export const listInterviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
})
export type ListInterviewsQuery = z.infer<typeof listInterviewsQuerySchema>
