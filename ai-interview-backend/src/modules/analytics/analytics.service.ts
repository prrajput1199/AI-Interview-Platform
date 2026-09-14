import { prisma } from '@/prisma/client'
import { STARTER_CREDITS } from '@/config/env'
import type {
  DashboardStatsDto,
  QuestionPerformanceDto,
  SkillEvaluationDto,
  TrendPointDto,
} from './analytics.types'

const MAX_SKILL_ITEMS = 5

class AnalyticsService {
  async getDashboard(userId: string): Promise<DashboardStatsDto> {
    const [totalInterviews, scoreAgg, usageAgg, purchaseAgg, wallet] = await Promise.all([
      prisma.interview.count({ where: { userId } }),
      prisma.interview.aggregate({
        where: { userId, status: 'COMPLETED' },
        _avg: { score: true },
        _max: { score: true },
        _min: { score: true },
      }),
      prisma.creditTransaction.aggregate({
        where: { userId, type: 'USAGE' },
        _sum: { amount: true },
      }),
      prisma.creditTransaction.aggregate({
        where: { userId, type: 'PURCHASE' },
        _sum: { amount: true },
      }),
      prisma.creditwallet.findUnique({ where: { userId } }),
    ])

    return {
      totalInterviews,
      averageScore: round1(scoreAgg._avg.score ?? 0),
      highestScore: round1(scoreAgg._max.score ?? 0),
      lowestScore: round1(scoreAgg._min.score ?? 0),
      creditsUsed: Math.abs(usageAgg._sum.amount ?? 0),
      creditsPurchased: purchaseAgg._sum.amount ?? 0,
      creditsBalance: wallet?.balance ?? STARTER_CREDITS,
    }
  }

  async getTrend(userId: string, days: number): Promise<TrendPointDto[]> {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const interviews = await prisma.interview.findMany({
      where: { userId, status: 'COMPLETED', updatedAt: { gte: since }, score: { not: null } },
      orderBy: { updatedAt: 'asc' },
      select: { updatedAt: true, score: true },
    })

    return interviews.map((i) => ({
      date: i.updatedAt.toISOString().slice(0, 10),
      score: i.score as number,
    }))
  }

  async getSkillEvaluation(userId: string): Promise<SkillEvaluationDto> {
    const reports = await prisma.report.findMany({
      where: { interview: { userId } },
      select: { strengths: true, weaknesses: true },
    })

    return {
      strengths: mostFrequent(reports.flatMap((r) => r.strengths), MAX_SKILL_ITEMS),
      weaknesses: mostFrequent(reports.flatMap((r) => r.weaknesses), MAX_SKILL_ITEMS),
    }
  }

  async getQuestionPerformance(userId: string): Promise<QuestionPerformanceDto[]> {
    const questions = await prisma.question.findMany({
      where: { interview: { userId }, answer: { isNot: null } },
      select: { text: true, answer: { select: { score: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return questions
      .filter((q) => q.answer?.score !== null && q.answer?.score !== undefined)
      .map((q) => ({ question: q.text, score: q.answer!.score as number }))
  }
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

/** Deduplicates case-insensitively and returns the most frequently occurring items first. */
function mostFrequent(items: string[], limit: number): string[] {
  const counts = new Map<string, { original: string; count: number }>()

  for (const item of items) {
    const key = item.trim().toLowerCase()
    if (!key) continue
    const existing = counts.get(key)
    if (existing) existing.count += 1
    else counts.set(key, { original: item.trim(), count: 1 })
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((v) => v.original)
}

export const analyticsService = new AnalyticsService()
