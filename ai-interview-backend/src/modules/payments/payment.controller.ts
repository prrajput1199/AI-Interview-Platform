import type { Request, Response } from 'express'
import { paymentService } from './payment.service'
import { razorpayService } from '@/services/razorpay/razorpay.service'
import { sendSuccess } from '@/utils/api-response'
import { logger } from '@/utils/logger'
import { BadRequestError } from '@/utils/errors'
import type { CreateOrderInput, ListTransactionsQuery, VerifyPaymentInput } from './payment.validation'

interface RazorpayWebhookBody {
  event: string
  payload?: {
    payment?: {
      entity?: {
        id?: string
        order_id?: string
      }
    }
  }
}

export const paymentController = {
  async createOrder(req: Request, res: Response) {
    const order = await paymentService.createOrder(req.user!.id, req.body as CreateOrderInput)
    return sendSuccess(res, order, 'Order created successfully')
  },

  async verify(req: Request, res: Response) {
    const result = await paymentService.verifyPayment(req.user!.id, req.body as VerifyPaymentInput)
    return sendSuccess(res, result, 'Payment verified and credits added')
  },

  async getBalance(req: Request, res: Response) {
    const balance = await paymentService.getBalance(req.user!.id)
    return sendSuccess(res, balance)
  },

  async listTransactions(req: Request, res: Response) {
    const { page, limit } = req.validatedQuery as unknown as ListTransactionsQuery
    const result = await paymentService.listTransactions(req.user!.id, { page, limit })
    return sendSuccess(res, result)
  },

  async webhook(req: Request, res: Response) {
    const signature = req.headers['x-razorpay-signature'] as string | undefined
    const rawBody = req.body as Buffer

    if (!Buffer.isBuffer(rawBody) || !razorpayService.verifyWebhookSignature(rawBody, signature)) {
      throw new BadRequestError('Invalid webhook signature', 'INVALID_WEBHOOK_SIGNATURE')
    }

    let body: RazorpayWebhookBody
    try {
      body = JSON.parse(rawBody.toString('utf8')) as RazorpayWebhookBody
    } catch {
      throw new BadRequestError('Malformed webhook payload', 'INVALID_WEBHOOK_PAYLOAD')
    }

    const entity = body.payload?.payment?.entity

    if (body.event === 'payment.captured' && entity?.order_id && entity.id) {
      await paymentService.handleWebhookPaymentCaptured(entity.order_id, entity.id)
    } else {
      logger.info({ event: body.event }, 'Ignoring unhandled Razorpay webhook event')
    }

    // The API contract's webhook response is a flat `{ success, received }`,
    // not the standard `{ success, data }` envelope — preserved exactly.
    return res.status(200).json({ success: true, received: true })
  },
}
