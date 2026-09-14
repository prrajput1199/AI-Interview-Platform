import type { NextFunction, Request, Response } from 'express'
import { COOKIE_NAME } from '@/config/env'
import { UnauthorizedError } from '@/utils/errors'
import { verifySessionToken } from '@/utils/jwt'

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined

  if (!token) {
    return next(new UnauthorizedError('You must be signed in to do that'))
  }

  try {
    const payload = verifySessionToken(token)
    req.user = { id: payload.sub }
    next()
  } catch {
    next(new UnauthorizedError('Your session has expired — please sign in again'))
  }
}
