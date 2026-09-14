import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth'
import { env } from '@/config/env'
import { UnauthorizedError } from '@/utils/errors'
import { logger } from '@/utils/logger'

let app: App

function getFirebaseApp(): App {
  if (!app) {
    const existing = getApps()
    app =
      existing[0] ??
      initializeApp({
        credential: cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          // .env files store the key with literal "\n" sequences — restore real newlines.
          privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      })
  }
  return app
}

export interface FirebaseIdentity {
  firebaseUid: string
  email: string
  name: string | null
  avatarUrl: string | null
}

class FirebaseService {
  /**
   * Verifies a Firebase ID token and returns the identity fields our
   * backend cares about. Throws UnauthorizedError for any invalid,
   * expired, or malformed token — never lets Firebase Admin errors leak
   * upward unhandled.
   */
  async verifyIdToken(idToken: string): Promise<FirebaseIdentity> {
    let decoded: DecodedIdToken
    try {
      decoded = await getAuth(getFirebaseApp()).verifyIdToken(idToken)
    } catch (error) {
      logger.warn({ err: error }, 'Firebase ID token verification failed')
      throw new UnauthorizedError('Invalid or expired Google sign-in token')
    }

    if (!decoded.email) {
      throw new UnauthorizedError('Google account has no email address')
    }

    return {
      firebaseUid: decoded.uid,
      email: decoded.email,
      name: (decoded.name as string | undefined) ?? null,
      avatarUrl: (decoded.picture as string | undefined) ?? null,
    }
  }
}

export const firebaseService = new FirebaseService()
