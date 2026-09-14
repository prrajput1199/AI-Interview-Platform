import type { Request, Response } from 'express'
import { authService } from './auth.service'
import { sendSuccess } from '@/utils/api-response'
import { COOKIE_NAME } from '@/config/env'
import { sessionCookieOptions } from '@/config/cookie'
import type { GoogleLoginInput } from './auth.validation'

export const authController = {
  async loginWithGoogle(req: Request, res: Response) {
    const { idToken } = req.body as GoogleLoginInput
    const { user, sessionToken } = await authService.loginWithGoogle(idToken)

    res.cookie(COOKIE_NAME, sessionToken, sessionCookieOptions)
    return sendSuccess(res, { user }, 'Login successful')
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie(COOKIE_NAME, { ...sessionCookieOptions, maxAge: undefined })
    return sendSuccess(res, null, 'Logged out successfully')
  },
}
