import { Router } from 'express'
import { env } from '@/config/env'

export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  })
})
