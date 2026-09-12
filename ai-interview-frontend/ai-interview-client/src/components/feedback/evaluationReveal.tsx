import { formatScore } from '@/lib/utils'

export function EvaluationReveal({
  score,
  feedback,
  keywords,
}: {
  score: number
  feedback: string
  keywords?: string[]
}) {
  const tone = score >= 7.5 ? 'success' : score >= 5 ? 'warning' : 'danger'
  const toneClasses = {
    success: 'text-success bg-success-soft',
    warning: 'text-warning bg-warning-soft',
    danger: 'text-danger bg-danger-soft',
  }[tone]

  return (
    <div className="rounded-lg border border-border bg-bg-raised p-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-full font-mono text-lg font-semibold ${toneClasses}`}
        >
          {formatScore(score)}
        </div>
        <div>
          <p className="text-xs text-fg-subtle">AI evaluation</p>
          <p className="text-sm text-fg-muted">out of 10</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-fg">{feedback}</p>

      {keywords && keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-bg-sunken px-2.5 py-1 text-xs text-fg-muted"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}