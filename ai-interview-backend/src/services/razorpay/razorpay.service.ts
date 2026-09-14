import Razorpay from 'razorpay'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { env } from '@/config/env'
import { logger } from '@/utils/logger'
import { ServiceUnavailableError } from '@/utils/errors'

export interface RazorpayOrderResult {
  orderId: string
  amount: number
  currency: string
}

class RazorpayService {
  private client: Razorpay

  constructor() {
    this.client = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    })
  }

  async createOrder(amountInPaise: number, receipt: string): Promise<RazorpayOrderResult> {
    try {
      const order = await this.client.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
      })
      return {
        orderId: order.id,
        amount: Number(order.amount),
        currency: order.currency,
      }
    } catch (error) {
      logger.error({ err: error }, 'Razorpay order creation failed')
      throw new ServiceUnavailableError('Could not start the payment. Please try again.')
    }
  }

  verifyPaymentSignature(params: {
    orderId: string
    paymentId: string
    signature: string
  }): boolean {
    const { orderId, paymentId, signature } = params
    const expected = createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    return safeCompare(expected, signature)
  }

  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string | undefined): boolean {
    if (!signatureHeader) return false
    const expected = createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex')

    return safeCompare(expected, signatureHeader)
  }
}

function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)
  if (bufferA.length !== bufferB.length) return false
  return timingSafeEqual(bufferA, bufferB)
}

export const razorpayService = new RazorpayService()
