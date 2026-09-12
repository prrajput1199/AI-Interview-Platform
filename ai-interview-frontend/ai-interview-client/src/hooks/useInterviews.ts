import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  interviewsApi,
  type CreateInterviewPayload,
} from '@/lib/api/interviews'
import { ApiError } from '@/lib/api/client'

export function useInterviewList(page: number, limit = 10) {
  return useQuery({
    queryKey: ['interviews', page, limit],
    queryFn: () => interviewsApi.list({ page, limit }),
  })
}

export function useInterview(interviewId: string | undefined) {
  return useQuery({
    queryKey: ['interview', interviewId],
    queryFn: () => interviewsApi.getById(interviewId as string),
    enabled: Boolean(interviewId),
  })
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

export function useCreateInterview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateInterviewPayload) => interviewsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't create the interview.")),
  })
}

export function useGenerateQuestions() {
  return useMutation({
    mutationFn: (interviewId: string) => interviewsApi.generateQuestions(interviewId),
    onError: (error) =>
      toast.error(errorMessage(error, "Couldn't generate questions for this interview.")),
  })
}

export function useSubmitAnswer(interviewId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { questionId: string; answer: string }) =>
      interviewsApi.submitAnswer(interviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview', interviewId] })
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't submit your answer.")),
  })
}

export function useCompleteInterview(interviewId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => interviewsApi.complete(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview', interviewId] })
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't complete the interview.")),
  })
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: async (interviewId: string) => {
      const blob = await interviewsApi.downloadReportPdf(interviewId)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `interview-report-${interviewId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't download the report.")),
  })
}