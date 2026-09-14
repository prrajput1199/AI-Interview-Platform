import { prisma } from '@/prisma/client'
import { NotFoundError } from '@/utils/errors'
import { STARTER_CREDITS } from '@/config/env'
import type { UserProfile } from './user.types'
import type { UpdateProfileInput } from './user.validation'

class UserService {
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { creditWallet: true },
    })

    if (!user) throw new NotFoundError('User not found')

    const balance = user.creditWallet?.balance ?? (await this.ensureWallet(user.id))

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarURL,
      createdAt: user.createdAt.toISOString(),
      creditWallet: { balance },
    }
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: input.name },
      include: { creditWallet: true },
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarURL,
      createdAt: user.createdAt.toISOString(),
      creditWallet: { balance: user.creditWallet?.balance ?? 0 },
    }
  }

  private async ensureWallet(userId: string): Promise<number> {
    const wallet = await prisma.creditwallet.upsert({
      where: { userId },
      update: {},
      create: { userId, balance: STARTER_CREDITS },
    })
    return wallet.balance
  }
}

export const userService = new UserService()
