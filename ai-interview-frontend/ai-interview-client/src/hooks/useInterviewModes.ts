import { useQuery } from '@tanstack/react-query'
import { interviewsApi } from '@/lib/api/interviews'

export function useInterviewModes() {
  return useQuery({
    queryKey: ['interview-modes'],
    queryFn: interviewsApi.getModes,
    staleTime: 5 * 60_000,
  })
}