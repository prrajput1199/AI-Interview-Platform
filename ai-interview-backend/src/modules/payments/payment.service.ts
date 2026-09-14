import { randomUUID } from 'node:crypto'
import { prisma } from '@/prisma/client'
import { razorpayService } from '@/services/razorpay/razorpay.service'
import { logger } from '@/utils/logger'
import { env, STARTER_CREDITS } from '@/config/env'
import { buildPaginationMeta, type PaginationParams } from '@/utils/pagination'
import { BadRequestError, ForbiddenError, NotFoundError } from '@/utils/errors'
import type {
  CreateOrderResultDto,
  CreditBalanceDto,
  TransactionDto,
  VerifyPaymentResultDto,
} from './payment.types'
import type { CreateOrderInput, VerifyPaymentInput } from './payment.validation'

const PAYMENT_STATUS = {
  CREATED: 'CREATED',
  CAPTURED: 'CAPTURED',
  FAILED: 'FAILED',
} as const

class PaymentService {
  async createOrder(userId: string, input: CreateOrderInput): Promise<CreateOrderResultDto> {
    const amount = input.credits * env.PRICE_PER_CREDIT_PAISE
    const receipt = `credits_${userId.slice(0, 12)}_${randomUUID().slice(0, 8)}`

    const order = await razorpayService.createOrder(amount, receipt)

    await prisma.payment.create({
      data: {
        userId,
        razorPayOrderId: order.orderId,
        razorPayPaymentId: '',
        amount: order.amount,
        credits: input.credits,
        status: PAYMENT_STATUS.CREATED,
      },
    })

    return {
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: env.RAZORPAY_KEY_ID,
      credits: input.credits,
    }
  }

  async verifyPayment(userId: string, input: VerifyPaymentInput): Promise<VerifyPaymentResultDto> {
    const payment = await prisma.payment.findUnique({ where: { razorPayOrderId: input.orderId } })
    if (!payment) throw new NotFoundError('Payment order not found')
    if (payment.userId !== userId) {
      throw new ForbiddenError("You don't have access to this payment")
    }

    // Idempotent: if it's already been captured (e.g. the webhook beat the
    // browser to it), just return the existing result without crediting again.
    if (payment.status === PAYMENT_STATUS.CAPTURED) {
      return toVerifyResultDto(payment)
    }

    const isValid = razorpayService.verifyPaymentSignature({
      orderId: input.orderId,
      paymentId: input.paymentId,
      signature: input.signature,
    })
    if (!isValid) {
      throw new BadRequestError('Payment signature could not be verified', 'INVALID_SIGNATURE')
    }

    const captured = await this.captureAndCredit(payment.id, input.paymentId)
    return toVerifyResultDto(captured)
  }

  /**
   * Handles the Razorpay `payment.captured` webhook. This is the
   * server-to-server source of truth and must be safe to receive more than
   * once for the same event, and safe to receive even if /verify already
   * processed the same payment.
   */
  async handleWebhookPaymentCaptured(razorPayOrderId: string, razorpayPaymentId: string): Promise<void> {
    const payment = await prisma.payment.findUnique({ where: { razorPayOrderId } })
    if (!payment) {
      logger.warn({ razorPayOrderId }, 'Webhook received for unknown payment order — ignoring')
      return
    }
    if (payment.status === PAYMENT_STATUS.CAPTURED) {
      return // already processed, nothing to do
    }
    await this.captureAndCredit(payment.id, razorpayPaymentId)
  }

  /** Shared by /verify and the webhook — marks the payment captured and credits the wallet, atomically, exactly once. */
  private async captureAndCredit(paymentId: string, razorpayPaymentId: string) {
    return prisma.$transaction(async (tx) => {
      // Re-check status inside the transaction to close the race between
      // /verify and the webhook firing at nearly the same time.
      const current = await tx.payment.findUnique({ where: { id: paymentId } })
      if (!current) throw new NotFoundError('Payment not found')
      if (current.status === PAYMENT_STATUS.CAPTURED) return current

      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: { razorPayPaymentId: razorpayPaymentId, status: PAYMENT_STATUS.CAPTURED },
      })

      await tx.creditwallet.upsert({
        where: { userId: updated.userId },
        update: { balance: { increment: updated.credits } },
        create: { userId: updated.userId, balance: STARTER_CREDITS + updated.credits },
      })

      await tx.creditTransaction.create({
        data: {
          userId: updated.userId,
          amount: updated.credits,
          type: 'PURCHASE',
          description: `Purchased ${updated.credits} credits via Razorpay`,
        },
      })

      return updated
    })
  }

  async getBalance(userId: string): Promise<CreditBalanceDto> {
    const wallet = await prisma.creditwallet.upsert({
      where: { userId },
      update: {},
      create: { userId, balance: STARTER_CREDITS },
    })

    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt.toISOString(),
    }
  }

  async listTransactions(
    userId: string,
    { page, limit }: PaginationParams,
  ): Promise<{ transactions: TransactionDto[]; pagination: ReturnType<typeof buildPaginationMeta> }> {
    const [transactions, total] = await Promise.all([
      prisma.creditTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.creditTransaction.count({ where: { userId } }),
    ])

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        createdAt: t.createdAt.toISOString(),
      })),
      pagination: buildPaginationMeta(page, limit, total),
    }
  }
}

function toVerifyResultDto(payment: {
  id: string
  razorPayOrderId: string
  razorPayPaymentId: string
  amount: number
  credits: number
  status: string
}): VerifyPaymentResultDto {
  return {
    id: payment.id,
    razorpayOrderId: payment.razorPayOrderId,
    razorpayPaymentId: payment.razorPayPaymentId,
    amount: payment.amount,
    credits: payment.credits,
    status: payment.status,
  }
}

export const paymentService = new PaymentService()
