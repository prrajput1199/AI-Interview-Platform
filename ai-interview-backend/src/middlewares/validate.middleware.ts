import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { ValidationError } from '@/utils/errors'

interface ValidationSchemas {
  body?: ZodType
  query?: ZodType
  params?: ZodType
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body)
      if (!result.success) {
        return next(new ValidationError('Invalid request body', result.error.flatten()))
      }
      req.body = result.data
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query)
      if (!result.success) {
        return next(new ValidationError('Invalid query parameters', result.error.flatten()))
      }
      // req.query is a read-only getter in Express 5 — store the parsed
      // result separately rather than reassigning req.query.
      req.validatedQuery = result.data as Record<string, unknown>
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params)
      if (!result.success) {
        return next(new ValidationError('Invalid route parameters', result.error.flatten()))
      }
      req.params = result.data as typeof req.params
    }

    next()
  }
}
