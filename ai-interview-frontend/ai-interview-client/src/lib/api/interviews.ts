import { api, fetchBlob } from './client'
import type {
  Interview,
  InterviewMode,
  InterviewReport,
  Question,
  SubmitAnswerResult,
} from '@/types/interview'
import type { Paginated } from '@/types/api'

export interface CreateInterviewPayload {
  mode: string
  title: string
  resumeId?: string
}

export interface InterviewListResponse {
  interviews: Interview[]
  pagination: Paginated<Interview>['pagination']
}

export const interviewsApi = {
  create: (payload: CreateInterviewPayload) =>
    api.post<Interview>('/api/v1/interviews', payload),

  generateQuestions: (interviewId: string) =>
    api.post<Question[]>(`/api/v1/interviews/${interviewId}/generate`),

  getById: (interviewId: string) =>
    api.get<Interview>(`/api/v1/interviews/${interviewId}`),

  submitAnswer: (interviewId: string, payload: { questionId: string; answer: string }) =>
    api.post<SubmitAnswerResult>(`/api/v1/interviews/${interviewId}/answer`, payload),

  complete: (interviewId: string) =>
    api.post<InterviewReport>(`/api/v1/interviews/${interviewId}/complete`),

  list: (params: { page: number; limit: number }) =>
    api.get<InterviewListResponse>('/api/v1/interviews', { params }),

  downloadReportPdf: (interviewId: string) =>
    fetchBlob(`/api/v1/interviews/${interviewId}/report`),

  getModes: () => api.get<InterviewMode[]>('/api/v1/interview/modes'),
}