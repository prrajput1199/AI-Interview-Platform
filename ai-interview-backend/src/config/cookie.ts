import type { CookieOptions } from 'express'
import { isProduction } from '@/config/env'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
  maxAge: SEVEN_DAYS_MS,
}
