import { Router } from 'express'
import { paymentController } from './payment.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { sensitiveRateLimiter } from '@/middlewares/rate-limit.middleware'
import { asyncHandler } from '@/utils/async-handler'
import { createOrderSchema, listTransactionsQuerySchema, verifyPaymentSchema } from './payment.validation'

export const paymentRouter = Router()

paymentRouter.post('/webhook', asyncHandler(paymentController.webhook))

paymentRouter.use(authenticate)

paymentRouter.post(
  '/create-order',
  sensitiveRateLimiter,
  validate({ body: createOrderSchema }),
  asyncHandler(paymentController.createOrder),
)

paymentRouter.post(
  '/verify',
  sensitiveRateLimiter,
  validate({ body: verifyPaymentSchema }),
  asyncHandler(paymentController.verify),
)

paymentRouter.get('/balance', asyncHandler(paymentController.getBalance))

paymentRouter.get(
  '/transactions',
  validate({ query: listTransactionsQuerySchema }),
  asyncHandler(paymentController.listTransactions),
)
