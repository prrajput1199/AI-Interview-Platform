export interface CreateOrderResultDto {
  orderId: string
  amount: number
  currency: string
  keyId: string
  credits: number
}

export interface VerifyPaymentResultDto {
  id: string
  razorpayOrderId: string
  razorpayPaymentId: string
  amount: number
  credits: number
  status: string
}

export interface CreditBalanceDto {
  id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export interface TransactionDto {
  id: string
  amount: number
  type: string
  description: string
  createdAt: string
}
