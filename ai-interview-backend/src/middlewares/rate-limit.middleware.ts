import rateLimit from 'express-rate-limit'

/** General API traffic. */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests — please slow down and try again shortly',
    error: { code: 'RATE_LIMITED' },
  },
})

/** Tighter limit for auth, AI generation, and payment endpoints. */
export const sensitiveRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests — please slow down and try again shortly',
    error: { code: 'RATE_LIMITED' },
  },
})
