import { createApp } from './app'
import { env } from '@/config/env'
import { disconnectPrisma } from '@/prisma/client'
import { logger } from '@/utils/logger'

const app = createApp()

const server = app.listen(env.PORT, () => {
  logger.info(`AI Interview Platform API listening on port ${env.PORT} [${env.NODE_ENV}]`)
})

async function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down gracefully`)
  server.close(async () => {
    await disconnectPrisma()
    logger.info('Shutdown complete')
    process.exit(0)
  })

  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10_000).unref()
}

process.on('SIGTERM', () => void shutdown('SIGTERM'))
process.on('SIGINT', () => void shutdown('SIGINT'))

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection')
})

process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught exception')
  process.exit(1)
})
