export interface DashboardStats {
  totalInterviews: number
  averageScore: number
  highestScore: number
  lowestScore: number
  creditsUsed: number
  creditsPurchased: number
  creditsBalance: number
}

export interface TrendPoint {
  date: string
  score: number
}

export interface SkillEvaluation {
  strengths: string[]
  weaknesses: string[]
}

export interface QuestionPerformance {
  question: string
  score: number
}