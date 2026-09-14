export interface DashboardStatsDto {
  totalInterviews: number
  averageScore: number
  highestScore: number
  lowestScore: number
  creditsUsed: number
  creditsPurchased: number
  creditsBalance: number
}

export interface TrendPointDto {
  date: string
  score: number
}

export interface SkillEvaluationDto {
  strengths: string[]
  weaknesses: string[]
}

export interface QuestionPerformanceDto {
  question: string
  score: number
}
