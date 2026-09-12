import { FileSearch, MessageSquareText, Gauge, LineChart, FileBarChart, ListTree } from 'lucide-react'

const FEATURES = [
  {
    icon: FileSearch,
    title: 'Resume-powered questions',
    description:
      "Upload your resume once — Loopcoach reads your skills and projects and generates questions that actually reference what you've built.",
  },
  {
    icon: MessageSquareText,
    title: 'AI mock interviews',
    description:
      'Answer in your own words, at your own pace, across ten interview tracks from frontend to system design to behavioral.',
  },
  {
    icon: Gauge,
    title: 'Instant AI evaluation',
    description:
      'Every answer is scored the moment you submit it, with specific feedback and the keywords a strong answer should hit.',
  },
  {
    icon: LineChart,
    title: 'Performance analytics',
    description:
      'Track your average score, your strongest and weakest question types, and how your performance trends over time.',
  },
  {
    icon: FileBarChart,
    title: 'Detailed reports',
    description:
      'Every completed interview compiles into a full report — strengths, weaknesses, suggestions — downloadable as a PDF.',
  },
  {
    icon: ListTree,
    title: 'Multiple interview modes',
    description:
      'Frontend, backend, full stack, React, Node, system design, databases, DevOps, HR, and behavioral rounds.',
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Everything you need before the real interview
          </h2>
          <p className="mt-3 text-fg-muted">
            Not a quiz bank. A full loop of preparation, practice, and feedback built
            around your background.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-lg border border-border p-6">
              <div className="flex size-9 items-center justify-center rounded-md bg-accent-soft text-accent">
                <Icon className="size-[18px]" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-fg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}