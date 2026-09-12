import { FileUp, ListChecks, MessagesSquare, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    icon: FileUp,
    title: 'Upload your resume',
    description: 'A PDF is enough — Loopcoach extracts your skills, experience, and projects.',
  },
  {
    icon: ListChecks,
    title: 'Choose your interview type',
    description: 'Pick from ten tracks, from frontend and system design to behavioral rounds.',
  },
  {
    icon: MessagesSquare,
    title: 'Complete your AI interview',
    description: 'Answer each question at your own pace and get scored feedback as you go.',
  },
  {
    icon: TrendingUp,
    title: 'Review your performance',
    description: 'Read your full report, then track improvement across every interview after.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-fg-muted">Four steps between here and your next offer.</p>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="relative pl-0">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg-raised font-mono text-xs text-fg-subtle">
                  {index + 1}
                </span>
                <Icon className="size-4 text-accent" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-fg">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}