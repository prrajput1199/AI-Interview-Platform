import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StepIndicator({
  steps,
  currentIndex,
}: {
  steps: string[]
  currentIndex: number
}) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, index) => {
        const isComplete = index < currentIndex
        const isCurrent = index === currentIndex
        return (
          <li key={label} className="flex items-center gap-2">
            <div
              className={cn(
                'flex size-6 items-center justify-center rounded-full font-mono text-[11px]',
                isComplete && 'bg-accent text-accent-fg',
                isCurrent && !isComplete && 'border-2 border-accent text-accent',
                !isComplete && !isCurrent && 'border border-border text-fg-subtle',
              )}
            >
              {isComplete ? <Check className="size-3" /> : index + 1}
            </div>
            <span
              className={cn(
                'hidden text-xs sm:inline',
                isCurrent ? 'font-medium text-fg' : 'text-fg-subtle',
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 && <div className="h-px w-4 bg-border sm:w-8" />}
          </li>
        )
      })}
    </ol>
  )
}