import { api } from './client'
import type {
  CreditBalance,
  PaymentOrder,
  PaymentRecord,
  Transaction,
  VerifyPaymentPayload,
} from '@/types/payment'
import type { Paginated } from '@/types/api'

export interface TransactionListResponse {
  transactions: Transaction[]
  pagination: Paginated<Transaction>['pagination']
}

export const paymentsApi = {
  createOrder: (credits: number) =>
    api.post<PaymentOrder>('/api/v1/payments/create-order', { credits }),
  verify: (payload: VerifyPaymentPayload) =>
    api.post<PaymentRecord>('/api/v1/payments/verify', payload),
  getBalance: () => api.get<CreditBalance>('/api/v1/payments/balance'),
  getTransactions: (params: { page: number; limit: number }) =>
    api.get<TransactionListResponse>('/api/v1/payments/transactions', { params }),
}