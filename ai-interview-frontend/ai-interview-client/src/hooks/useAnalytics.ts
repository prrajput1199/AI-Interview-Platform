import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api/analytics'

export function useDashboardStats() {
  return useQuery({ queryKey: ['analytics', 'dashboard'], queryFn: analyticsApi.getDashboard })
}

export function usePerformanceTrend(days: number) {
  return useQuery({
    queryKey: ['analytics', 'trend', days],
    queryFn: () => analyticsApi.getTrend(days),
  })
}

export function useSkillEvaluation() {
  return useQuery({ queryKey: ['analytics', 'skills'], queryFn: analyticsApi.getSkills })
}

export function useQuestionPerformance() {
  return useQuery({
    queryKey: ['analytics', 'questions'],
    queryFn: analyticsApi.getQuestionPerformance,
  })
}