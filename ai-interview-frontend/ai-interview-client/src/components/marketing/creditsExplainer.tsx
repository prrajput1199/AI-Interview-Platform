import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const POINTS = [
  'Each completed interview uses credits from your balance.',
  'Buy credits in whatever quantity you need, whenever you need them.',
  'Every purchase is processed securely through Razorpay.',
  'Your balance and full transaction history are always visible in your dashboard.',
]

export function CreditsExplainer() {
  return (
    <section id="credits" className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              Pay only for the interviews you run
            </h2>
            <p className="mt-3 max-w-md text-fg-muted">
              Loopcoach runs on a simple credit system — no subscriptions, no
              commitments. Top up when you're preparing for something, and let the
              balance sit when you're not.
            </p>

            <ul className="mt-6 space-y-3">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-fg-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>

            <Button size="lg" className="mt-8" asChild>
              <Link to="/login">Start Practicing</Link>
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-bg-raised p-6">
            <p className="text-xs text-fg-subtle">Your balance</p>
            <p className="mt-1 font-mono text-4xl font-semibold text-fg">150 credits</p>

            <div className="mt-6 space-y-2.5 border-t border-border pt-5">
              {[
                { label: 'Purchased 100 credits via Razorpay', delta: '+100' },
                { label: 'Interview: React Developer', delta: '-1' },
                { label: 'Interview: System Design', delta: '-1' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-fg-muted">{row.label}</span>
                  <span
                    className={
                      row.delta.startsWith('+')
                        ? 'font-mono text-success'
                        : 'font-mono text-fg-subtle'
                    }
                  >
                    {row.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}