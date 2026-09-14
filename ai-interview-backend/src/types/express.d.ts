export interface AuthenticatedUser {
  id: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
      validatedQuery?: Record<string, unknown>
    }
  }
}

export {}
