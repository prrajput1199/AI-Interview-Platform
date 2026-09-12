import { useInterviewModes } from '@/hooks/useInterviewModes'
import { Skeleton } from '@/components/ui/skeleton'

// Used only as a graceful fallback if the API call fails, so the section
// still communicates the product's breadth — never used to fabricate scores or stats.
const FALLBACK_MODES = [
  { value: 'FRONTEND', label: 'Frontend Developer' },
  { value: 'BACKEND', label: 'Backend Developer' },
  { value: 'FULL_STACK', label: 'Full Stack Developer' },
  { value: 'REACT', label: 'React Developer' },
  { value: 'NODE', label: 'Node.js Developer' },
  { value: 'SYSTEM_DESIGN', label: 'System Design' },
  { value: 'DATABASE', label: 'Database Interview' },
  { value: 'DEVOPS', label: 'DevOps Interview' },
  { value: 'HR', label: 'HR Interview' },
  { value: 'BEHAVIORAL', label: 'Behavioral Interview' },
]

export function InterviewModes() {
  const { data, isLoading, isError } = useInterviewModes()
  const modes = data ?? (isError ? FALLBACK_MODES : [])

  return (
    <section className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Ten tracks, one platform
          </h2>
          <p className="mt-3 text-fg-muted">
            Practice the exact shape of interview you're about to sit for.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}

          {!isLoading &&
            modes.map((mode) => (
              <div
                key={mode.value}
                className="flex items-center rounded-lg border border-border bg-bg-raised px-4 py-4 text-sm font-medium text-fg transition-colors hover:border-border-strong"
              >
                {mode.label}
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}