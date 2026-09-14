import type { Request, Response } from 'express'
import { userService } from './user.service'
import { sendSuccess } from '@/utils/api-response'
import type { UpdateProfileInput } from './user.validation'

export const userController = {
  async getProfile(req: Request, res: Response) {
    const profile = await userService.getProfile(req.user!.id)
    return sendSuccess(res, profile)
  },

  async updateProfile(req: Request, res: Response) {
    const input = req.body as UpdateProfileInput
    const profile = await userService.updateProfile(req.user!.id, input)
    return sendSuccess(res, profile, 'Profile updated successfully')
  },
}
