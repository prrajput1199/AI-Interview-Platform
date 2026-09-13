import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCreditBalance, usePurchaseCredits, useTransactions } from '@/hooks/usePayments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/errors/errorState'
import { Pagination } from '@/components/ui/Pagination'
import { PurchasePanel } from '@/components/payments/purchasepanel'
import { TransactionList } from '@/components/payments/TransactionList'


export default function CreditsPage() {
  const { user } = useAuth()
  const balance = useCreditBalance()
  const purchase = usePurchaseCredits()
  const [page, setPage] = useState(1)
  const transactions = useTransactions(page, 10)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Credits</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Each interview uses one credit. Buy more whenever you need them.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current balance</CardTitle>
          </CardHeader>
          <CardContent>
            {balance.isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : balance.isError ? (
              <ErrorState onRetry={() => balance.refetch()} />
            ) : (
              <p className="font-mono text-4xl font-semibold text-fg">
                {balance.data?.balance ?? 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buy credits</CardTitle>
          </CardHeader>
          <CardContent>
            <PurchasePanel
              isProcessing={purchase.isPending}
              onPurchase={(credits) =>
                user &&
                purchase.mutate({ credits, userName: user.name, userEmail: user.email })
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactions.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : transactions.isError ? (
            <ErrorState onRetry={() => transactions.refetch()} />
          ) : (
            <>
              <TransactionList transactions={transactions.data?.transactions ?? []} />
              {transactions.data && (
                <Pagination pagination={transactions.data.pagination} onPageChange={setPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}