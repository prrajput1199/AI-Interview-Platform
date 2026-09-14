import { Router } from 'express'
import { authRouter } from '@/modules/auth/auth.routes'
import { userRouter } from '@/modules/users/user.routes'
import { interviewRouter } from '@/modules/interviews/interview.routes'
import { resumeRouter } from '@/modules/resume/resume.routes'
import { paymentRouter } from '@/modules/payments/payment.routes'
import { analyticsRouter } from '@/modules/analytics/analytics.routes'
import { interviewModeRouter } from '@/modules/interview-modes/interview-mode.routes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/users', userRouter)
apiRouter.use('/interviews', interviewRouter)
apiRouter.use('/resume', resumeRouter)
apiRouter.use('/payments', paymentRouter)
apiRouter.use('/analytics', analyticsRouter)
apiRouter.use('/interview/modes', interviewModeRouter)
