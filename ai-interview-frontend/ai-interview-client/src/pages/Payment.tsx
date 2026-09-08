import { useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import {
  useGetBalanceQuery,
  useGetTransactionsQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from '../store/api/payment.api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { Loader2, Wallet, History } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PRICING_PLANS = [
  { credits: 100, price: 0, label: 'Free', popular: false },
  { credits: 150, price: 100, label: 'Starter', popular: false },
  { credits: 650, price: 500, label: 'Pro', popular: true },
];

export default function Payment() {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { data: balance } = useGetBalanceQuery();
  const { data: transactions } = useGetTransactionsQuery({ page: 1, limit: 10 });
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async (credits: number, amount: number) => {
    if (amount === 0) {
      toast({
        title: 'Free plan',
        description: 'You already have access to the free plan.',
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create order
      const orderResponse = await createOrder({ credits }).unwrap();
      const { orderId, amount: orderAmount, currency, keyId } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: orderAmount,
        currency: currency,
        name: 'InterviewQAI',
        description: `${credits} Credits Purchase`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }).unwrap();

            toast({
              title: 'Payment successful!',
              description: `${credits} credits added to your account.`,
            });
          } catch (error) {
            toast({
              title: 'Verification failed',
              description: 'Payment verification failed. Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({
        title: 'Payment failed',
        description: error.message || 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Credits & Billing</h1>

      {/* Balance Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Credit Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{balance?.balance || 0} Credits</p>
            <Badge variant="outline">Available</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <h2 className="text-xl font-semibold mb-4">Purchase Credits</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {PRICING_PLANS.map((plan) => (
          <Card key={plan.credits} className={plan.popular ? 'border-blue-500' : ''}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{plan.label}</span>
                {plan.popular && <Badge>Popular</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">₹{plan.price}</p>
                <p className="text-sm text-gray-500">{plan.credits} Credits</p>
              </div>
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handlePurchase(plan.credits, plan.price)}
                disabled={isProcessing}
              >
                {plan.price === 0 ? 'Free' : `Buy ₹${plan.price}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction History */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <History className="h-5 w-5" />
        Transaction History
      </h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {transactions?.transactions?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No transactions yet.
              </div>
            ) : (
              transactions?.transactions?.map((transaction: any) => (
                <div key={transaction.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {transaction.type === 'PURCHASE' ? 'Purchase' : 'Usage'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}