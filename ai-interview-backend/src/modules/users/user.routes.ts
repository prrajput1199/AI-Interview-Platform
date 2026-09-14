import { Router } from 'express'
import { userController } from './user.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { asyncHandler } from '@/utils/async-handler'
import { updateProfileSchema } from './user.validation'

export const userRouter = Router()

userRouter.use(authenticate)

userRouter.get('/profile', asyncHandler(userController.getProfile))
userRouter.patch('/profile', validate({ body: updateProfileSchema }), asyncHandler(userController.updateProfile))
