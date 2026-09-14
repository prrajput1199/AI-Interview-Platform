import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from '@/config/env'
import { healthRouter } from '@/modules/health/health.routes'
import { apiRouter } from '@/routes'
import { apiRateLimiter } from '@/middlewares/rate-limit.middleware'
import { notFoundHandler } from '@/middlewares/not-found.middleware'
import { errorMiddleware } from '@/middlewares/error.middleware'

const WEBHOOK_PATH = '/api/v1/payments/webhook'

export function createApp(): Express {
  const app = express()

  app.disable('x-powered-by')
  app.set('trust proxy', 1)

  app.use(helmet())
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  )

  app.use(WEBHOOK_PATH, express.raw({ type: 'application/json', limit: '1mb' }))
  
  app.use((req, res, next) => {
    if (req.path === WEBHOOK_PATH) return next()
    express.json({ limit: '2mb' })(req, res, next)
  })

  app.use(cookieParser())
  app.use(apiRateLimiter)

  app.use('/health', healthRouter)
  app.use('/api/v1', apiRouter)

  app.use(notFoundHandler)
  app.use(errorMiddleware)

  return app
}
