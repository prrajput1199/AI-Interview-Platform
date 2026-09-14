import type { Request, Response } from 'express'
import { analyticsService } from './analytics.service'
import { sendSuccess } from '@/utils/api-response'
import type { TrendQuery } from './analytics.validation'

export const analyticsController = {
  async getDashboard(req: Request, res: Response) {
    const stats = await analyticsService.getDashboard(req.user!.id)
    return sendSuccess(res, stats)
  },

  async getTrend(req: Request, res: Response) {
    const { days } = req.validatedQuery as unknown as TrendQuery
    const trend = await analyticsService.getTrend(req.user!.id, days)
    return sendSuccess(res, trend)
  },

  async getSkills(req: Request, res: Response) {
    const skills = await analyticsService.getSkillEvaluation(req.user!.id)
    return sendSuccess(res, skills)
  },

  async getQuestionPerformance(req: Request, res: Response) {
    const performance = await analyticsService.getQuestionPerformance(req.user!.id)
    return sendSuccess(res, performance)
  },
}
