import { CircleCheck, CircleAlert } from 'lucide-react'

export function ImprovementPanel({
  strengths,
  weaknesses,
}: {
  strengths: string[]
  weaknesses: string[]
}) {
  if (strengths.length === 0 && weaknesses.length === 0) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-border bg-bg-raised p-5">
        <div className="flex items-center gap-2 text-success">
          <CircleCheck className="size-4" />
          <p className="text-sm font-medium">Strengths</p>
        </div>
        <ul className="mt-3 space-y-2">
          {strengths.map((item) => (
            <li key={item} className="text-sm text-fg-muted">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-bg-raised p-5">
        <div className="flex items-center gap-2 text-warning">
          <CircleAlert className="size-4" />
          <p className="text-sm font-medium">Focus areas</p>
        </div>
        <ul className="mt-3 space-y-2">
          {weaknesses.map((item) => (
            <li key={item} className="text-sm text-fg-muted">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}