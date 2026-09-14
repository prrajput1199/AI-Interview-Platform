import type { Request, Response } from 'express'

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: { code: 'ROUTE_NOT_FOUND' },
  })
}
