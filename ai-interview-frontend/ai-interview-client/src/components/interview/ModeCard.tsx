import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InterviewMode } from '@/types/interview'

export function ModeCard({
  mode,
  selected,
  onSelect,
}: {
  mode: InterviewMode
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors',
        selected
          ? 'border-accent bg-accent-soft'
          : 'border-border bg-bg-raised hover:border-border-strong',
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-accent text-accent-fg">
          <Check className="size-3" />
        </span>
      )}
      <p className="text-sm font-medium text-fg">{mode.label}</p>
      <p className="font-mono text-xs text-fg-subtle">{mode.value}</p>
    </button>
  )
}