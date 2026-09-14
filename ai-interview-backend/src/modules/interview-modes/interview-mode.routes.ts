import { Router } from 'express'
// import { interviewModeController } from './interview-mode.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { asyncHandler } from '@/utils/async-handler'
import { interviewModeController } from './interview-mode.controller'

export const interviewModeRouter = Router()

interviewModeRouter.get('/', authenticate, asyncHandler(interviewModeController.getAll))
