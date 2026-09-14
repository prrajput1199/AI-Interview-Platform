import type { Response } from 'express'

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message ? { message } : {}),
  })
}

export function sendCreated<T>(res: Response, data: T, message?: string): Response {
  return sendSuccess(res, data, message, 201)
}

export function sendAccepted<T>(res: Response, data: T, message?: string): Response {
  return sendSuccess(res, data, message, 202)
}
