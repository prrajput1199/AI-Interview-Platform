import { Router } from 'express'
import { interviewController } from './interview.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { sensitiveRateLimiter } from '@/middlewares/rate-limit.middleware'
import { asyncHandler } from '@/utils/async-handler'
import {
  createInterviewSchema,
  interviewIdParamsSchema,
  listInterviewsQuerySchema,
  submitAnswerSchema,
} from './interview.validation'

export const interviewRouter = Router()

interviewRouter.use(authenticate)

interviewRouter.post('/', validate({ body: createInterviewSchema }), asyncHandler(interviewController.create))

interviewRouter.get(
  '/',
  validate({ query: listInterviewsQuerySchema }),
  asyncHandler(interviewController.list),
)

interviewRouter.post(
  '/:interviewId/generate',
  sensitiveRateLimiter,
  validate({ params: interviewIdParamsSchema }),
  asyncHandler(interviewController.generateQuestions),
)

interviewRouter.get(
  '/:interviewId',
  validate({ params: interviewIdParamsSchema }),
  asyncHandler(interviewController.getDetail),
)

interviewRouter.post(
  '/:interviewId/answer',
  sensitiveRateLimiter,
  validate({ params: interviewIdParamsSchema, body: submitAnswerSchema }),
  asyncHandler(interviewController.submitAnswer),
)

interviewRouter.post(
  '/:interviewId/complete',
  sensitiveRateLimiter,
  validate({ params: interviewIdParamsSchema }),
  asyncHandler(interviewController.complete),
)

interviewRouter.get(
  '/:interviewId/report',
  validate({ params: interviewIdParamsSchema }),
  asyncHandler(interviewController.downloadReportPdf),
)
