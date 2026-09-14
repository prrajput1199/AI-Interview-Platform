import { prisma } from '@/prisma/client'
import { firebaseService } from '@/services/firebase/firebase.service'
import { signSessionToken } from '@/utils/jwt'
import { STARTER_CREDITS } from '@/config/env'
import type { AuthUserSummary } from './auth.types'

class AuthService {
  async loginWithGoogle(idToken: string): Promise<{ user: AuthUserSummary; sessionToken: string }> {
    const identity = await firebaseService.verifyIdToken(idToken)

    const user = await prisma.user.upsert({
      where: { FirebaseUid: identity.firebaseUid },
      update: {
        email: identity.email,
        name: identity.name ?? undefined,
        avatarURL: identity.avatarUrl ?? undefined,
      },
      create: {
        FirebaseUid: identity.firebaseUid,
        email: identity.email,
        name: identity.name,
        avatarURL: identity.avatarUrl,
        creditWallet: {
          create: { balance: STARTER_CREDITS },
        },
        creditTransactions: {
          create: {
            amount: STARTER_CREDITS,
            type: 'BONUS',
            description: 'Welcome bonus credits',
          },
        },
      },
    })

    const sessionToken = signSessionToken(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarURL,
      },
      sessionToken,
    }
  }
}

export const authService = new AuthService()
