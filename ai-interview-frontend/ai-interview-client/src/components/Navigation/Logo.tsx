import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold text-fg', className)}>
      <span className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-fg">
        <svg viewBox="0 0 20 20" className="size-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 13.5V6.5L10 11L16 6.5V13.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="tracking-tight">Loopcoach</span>
    </span>
  )
}