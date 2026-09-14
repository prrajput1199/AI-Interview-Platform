import jwt from 'jsonwebtoken'
import { env } from '@/config/env'

export interface SessionTokenPayload {
  sub: string // user id
}

export function signSessionToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies SessionTokenPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export function verifySessionToken(token: string): SessionTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET)
  if (typeof decoded === 'string' || !decoded.sub) {
    throw new Error('Malformed session token')
  }
  return { sub: decoded.sub as string }
}
