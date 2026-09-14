import { Router } from 'express'
import { resumeController } from './resume.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { uploadResume } from '@/middlewares/upload.middleware'
import { asyncHandler } from '@/utils/async-handler'
import { resumeIdParamsSchema } from './resume.validation'

export const resumeRouter = Router()

resumeRouter.use(authenticate)

resumeRouter.post('/upload', uploadResume, asyncHandler(resumeController.upload))
resumeRouter.get('/', asyncHandler(resumeController.getCurrent))
resumeRouter.delete(
  '/:resumeId',
  validate({ params: resumeIdParamsSchema }),
  asyncHandler(resumeController.remove),
)
