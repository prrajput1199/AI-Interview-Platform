import { ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react'
import type { Transaction } from '@/types/payment'
import { formatDate } from '@/lib/utils'
import { EmptyState } from '../empty-states/emptyStates'

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No activity yet"
        description="Your credit activity will appear here."
      />
    )
  }

  return (
    <ul className="divide-y divide-border">
      {transactions.map((tx) => {
        const isPurchase = tx.type === 'PURCHASE'
        return (
          <li key={tx.id} className="flex items-center justify-between gap-4 py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                  isPurchase ? 'bg-success-soft text-success' : 'bg-bg-sunken text-fg-subtle'
                }`}
              >
                {isPurchase ? (
                  <ArrowDownLeft className="size-4" />
                ) : (
                  <ArrowUpRight className="size-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-fg">{tx.description}</p>
                <p className="text-xs text-fg-subtle">{formatDate(tx.createdAt)}</p>
              </div>
            </div>
            <span
              className={`shrink-0 font-mono text-sm ${isPurchase ? 'text-success' : 'text-fg-muted'}`}
            >
              {tx.amount > 0 ? '+' : ''}
              {tx.amount}
            </span>
          </li>
        )
      })}
    </ul>
  )
}