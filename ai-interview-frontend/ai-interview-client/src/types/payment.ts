export interface PaymentOrder {
  orderId: string
  amount: number
  currency: string
  keyId: string
  credits: number
}

export interface VerifyPaymentPayload {
  orderId: string
  paymentId: string
  signature: string
}

export interface PaymentRecord {
  id: string
  razorpayOrderId: string
  razorpayPaymentId: string
  amount: number
  credits: number
  status: string
}

export interface CreditBalance {
  id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export type TransactionType = 'PURCHASE' | 'USAGE'

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  description: string
  createdAt: string
}