import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-14 text-center ${className ?? ''}`}
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-bg-sunken text-fg-subtle">
        <Icon className="size-5" />
      </div>
      <div className="max-w-xs space-y-1">
        <p className="text-sm font-medium text-fg">{title}</p>
        <p className="text-sm text-fg-muted">{description}</p>
      </div>
      {action}
    </div>
  )
}