import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { resumeApi } from '@/lib/api/resume'
import { ApiError } from '@/lib/api/client'

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

export function useResume() {
  return useQuery({
    queryKey: ['resume'],
    queryFn: resumeApi.get,
    retry: false,
  })
}

export function useUploadResume() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => resumeApi.upload(file),
    onSuccess: () => {
      toast.success('Resume uploaded — analyzing now.')
      queryClient.invalidateQueries({ queryKey: ['resume'] })
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't upload your resume.")),
  })
}

export function useDeleteResume() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (resumeId: string) => resumeApi.remove(resumeId),
    onSuccess: () => {
      toast.success('Resume deleted')
      queryClient.invalidateQueries({ queryKey: ['resume'] })
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't delete your resume.")),
  })
}