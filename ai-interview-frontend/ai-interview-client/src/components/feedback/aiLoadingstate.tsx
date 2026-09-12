import { Sparkles } from 'lucide-react'

export function AiLoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="relative flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Sparkles className="size-5 animate-pulse" />
      </div>
      <p className="text-sm font-medium text-fg">{label}</p>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-fg-subtle"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  )
}