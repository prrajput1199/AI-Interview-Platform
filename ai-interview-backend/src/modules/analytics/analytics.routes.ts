import { Router } from 'express'
import { analyticsController } from './analytics.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { asyncHandler } from '@/utils/async-handler'
import { trendQuerySchema } from './analytics.validation'

export const analyticsRouter = Router()

analyticsRouter.use(authenticate)

analyticsRouter.get('/dashboard', asyncHandler(analyticsController.getDashboard))
analyticsRouter.get(
  '/trend',
  validate({ query: trendQuerySchema }),
  asyncHandler(analyticsController.getTrend),
)
analyticsRouter.get('/skills', asyncHandler(analyticsController.getSkills))
analyticsRouter.get('/questions', asyncHandler(analyticsController.getQuestionPerformance))
