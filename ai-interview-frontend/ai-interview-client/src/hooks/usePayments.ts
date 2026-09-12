import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { paymentsApi } from '@/lib/api/payment'
import { ApiError } from '@/lib/api/client'
import { loadRazorpayScript, type RazorpayResponse } from '@/lib/razorpay'

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

export function useCreditBalance() {
  return useQuery({ queryKey: ['payments', 'balance'], queryFn: paymentsApi.getBalance })
}

export function useTransactions(page: number, limit = 10) {
  return useQuery({
    queryKey: ['payments', 'transactions', page, limit],
    queryFn: () => paymentsApi.getTransactions({ page, limit }),
  })
}

interface PurchaseArgs {
  credits: number
  userName: string
  userEmail: string
}

export function usePurchaseCredits() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ credits, userName, userEmail }: PurchaseArgs) => {
      const order = await paymentsApi.createOrder(credits)

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          'Could not load the payment provider. Check your connection and try again.',
        )
      }

      return new Promise<void>((resolve, reject) => {
        const razorpay = new window.Razorpay!({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'Loopcoach',
          description: `${order.credits} interview credits`,
          order_id: order.orderId,
          theme: { color: '#6B7A1F' },
          prefill: { name: userName, email: userEmail },
          handler: async (response: RazorpayResponse) => {
            try {
              await paymentsApi.verify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              })
              resolve()
            } catch (error) {
              reject(error)
            }
          },
          modal: {
            ondismiss: () => reject(new Error('CANCELLED')),
          },
        })
        razorpay.open()
      })
    },
    onSuccess: () => {
      toast.success('Credits added to your account')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'CANCELLED') return
      toast.error(errorMessage(error, 'Payment could not be completed.'))
    },
  })
}