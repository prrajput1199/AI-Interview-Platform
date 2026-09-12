import { api } from './client'
import type {
  DashboardStats,
  QuestionPerformance,
  SkillEvaluation,
  TrendPoint,
} from '@/types/analytics'

export const analyticsApi = {
  getDashboard: () => api.get<DashboardStats>('/api/v1/analytics/dashboard'),
  getTrend: (days: number) =>
    api.get<TrendPoint[]>('/api/v1/analytics/trend', { params: { days } }),
  getSkills: () => api.get<SkillEvaluation>('/api/v1/analytics/skills'),
  getQuestionPerformance: () =>
    api.get<QuestionPerformance[]>('/api/v1/analytics/questions'),
}