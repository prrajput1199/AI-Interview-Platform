import pino from 'pino'
import { env, isProduction } from '@/config/env'

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
      },
  redact: {
    paths: [
      'req.headers.cookie',
      'req.headers.authorization',
      '*.idToken',
      '*.password',
      '*.token',
      '*.jwt',
      '*.apiKey',
      '*.privateKey',
      '*.secret',
    ],
    censor: '[redacted]',
  },
})
