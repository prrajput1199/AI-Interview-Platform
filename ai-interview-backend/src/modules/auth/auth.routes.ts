import { Router } from 'express'
import { authController } from './auth.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { sensitiveRateLimiter } from '@/middlewares/rate-limit.middleware'
import { asyncHandler } from '@/utils/async-handler'
import { googleLoginSchema } from './auth.validation'

export const authRouter = Router()

authRouter.post(
  '/google',
  sensitiveRateLimiter,
  validate({ body: googleLoginSchema }),
  asyncHandler(authController.loginWithGoogle),
)

authRouter.post('/logout', authenticate, asyncHandler(authController.logout))
