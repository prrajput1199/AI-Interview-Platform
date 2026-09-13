import { formatScore } from '@/lib/utils'

export function ScoreDial({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, (score / 10) * 100))
  const circumference = 2 * Math.PI * 54

  const tone = score >= 7.5 ? 'var(--color-success)' : score >= 5 ? 'var(--color-warning)' : 'var(--color-danger)'

  return (
    <div className="relative flex size-36 items-center justify-center">
      <svg viewBox="0 0 120 120" className="size-36 -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={tone}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (pct / 100) * circumference}
          style={{ transition: 'stroke-dashoffset 700ms ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-4xl font-semibold text-fg">{formatScore(score)}</span>
        <span className="text-xs text-fg-subtle">out of 10</span>
      </div>
    </div>
  )
}