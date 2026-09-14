import { z } from 'zod'

export const createOrderSchema = z.object({
  credits: z.coerce.number().int().positive().max(100_000, 'That many credits at once is not supported'),
})
export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
  paymentId: z.string().min(1, 'paymentId is required'),
  signature: z.string().min(1, 'signature is required'),
})
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>

export const listTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
})
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>
