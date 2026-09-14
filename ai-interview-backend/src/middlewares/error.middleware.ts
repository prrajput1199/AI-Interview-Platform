import type { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'
import jwt from 'jsonwebtoken'
import { Prisma } from '../../generated/prisma/client'
import { AppError, ValidationError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import { isProduction } from '@/config/env'

interface ErrorBody {
  success: false
  message: string
  error: { code: string; details?: unknown }
}

function mapPrismaError(err: Prisma.PrismaClientKnownRequestError): {
  status: number
  body: ErrorBody
} {
  switch (err.code) {
    case 'P2002':
      return {
        status: 409,
        body: {
          success: false,
          message: 'A record with that value already exists',
          error: { code: 'DUPLICATE_RECORD' },
        },
      }
    case 'P2025':
      return {
        status: 404,
        body: {
          success: false,
          message: 'Record not found',
          error: { code: 'NOT_FOUND' },
        },
      }
    default:
      return {
        status: 500,
        body: {
          success: false,
          message: 'A database error occurred',
          error: { code: 'DATABASE_ERROR' },
        },
      }
  }
}

export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction) {
  // Known, expected application errors.
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: { code: err.code, details: err.details },
    } satisfies ErrorBody)
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: { code: err.code },
    } satisfies ErrorBody)
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error({ err, code: err.code, path: req.originalUrl }, 'Prisma known error')
    const mapped = mapPrismaError(err)
    return res.status(mapped.status).json(mapped.body)
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error({ err, path: req.originalUrl }, 'Prisma validation error')
    return res.status(400).json({
      success: false,
      message: 'Invalid data sent to the database',
      error: { code: 'DATABASE_VALIDATION_ERROR' },
    } satisfies ErrorBody)
  }

  if (err instanceof MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : 'File upload failed'
    return res.status(400).json({
      success: false,
      message,
      error: { code: `UPLOAD_${err.code}` },
    } satisfies ErrorBody)
  }

  if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: 'Your session has expired — please sign in again',
      error: { code: 'UNAUTHORIZED' },
    } satisfies ErrorBody)
  }

  logger.error({ err, path: req.originalUrl, method: req.method }, 'Unhandled error')

  return res.status(500).json({
    success: false,
    message: isProduction ? 'Something went wrong' : (err as Error)?.message || 'Unknown error',
    error: { code: 'INTERNAL_SERVER_ERROR' },
  } satisfies ErrorBody)
}
