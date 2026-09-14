export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly isOperational = true

  constructor(message: string, statusCode: number, code: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST') {
    super(message, 400, code)
  }
}

export class ValidationError extends AppError {
  public readonly details?: unknown

  constructor(message = 'Validation failed', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR')
    this.details = details
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You don't have access to this resource") {
    super(message, 403, 'FORBIDDEN')
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT')
  }
}

export class PaymentRequiredError extends AppError {
  constructor(message = 'Insufficient credits') {
    super(message, 402, 'INSUFFICIENT_CREDITS')
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Something went wrong') {
    super(message, 500, 'INTERNAL_SERVER_ERROR')
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'A required service is temporarily unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE')
  }
}
