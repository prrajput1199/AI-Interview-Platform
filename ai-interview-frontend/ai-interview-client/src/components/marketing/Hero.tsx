import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-raised px-3 py-1 text-xs text-fg-muted">
            <Sparkles className="size-3.5 text-accent" />
            Resume-aware mock interviews, scored by AI
          </div>

          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[1.06] tracking-tight text-fg sm:text-6xl">
            Practice smarter.
            <br />
            Interview stronger.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-fg-muted">
            Loopcoach reads your resume, runs a realistic mock interview for the role
            you're targeting, and scores every answer instantly — so nothing about the
            real thing catches you off guard.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/login">
                Start Practicing
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-fg-subtle">
            <div>
              <p className="font-mono text-xl font-medium text-fg">10</p>
              <p>interview tracks</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-mono text-xl font-medium text-fg">&lt;60s</p>
              <p>per evaluation</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-mono text-xl font-medium text-fg">1:1</p>
              <p>resume-matched</p>
            </div>
          </div>
        </div>

        <ProductPreview />
      </div>
    </section>
  )
}

function ProductPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/10 blur-2xl" aria-hidden="true" />

      <div className="rounded-xl border border-border bg-bg-raised p-5 shadow-2xl shadow-black/5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-medium text-fg">React Developer Interview</p>
            <p className="text-xs text-fg-subtle">Question 3 of 6</p>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
            In progress
          </span>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm leading-relaxed text-fg">
            "How do you handle state management in large applications?"
          </p>

          <div className="rounded-lg bg-bg-sunken p-3">
            <p className="text-xs leading-relaxed text-fg-muted">
              I lean on colocated state first, then reach for a shared store like Redux
              Toolkit only for state that's genuinely cross-cutting...
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-xs text-fg-subtle">AI evaluation</p>
              <p className="mt-0.5 font-mono text-2xl font-semibold text-fg">8.0</p>
            </div>
            <div className="flex gap-1.5">
              {['React', 'Redux Toolkit', 'Scalability'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-bg-sunken px-2 py-1 text-[11px] text-fg-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-fg-subtle">
              <span>Interview progress</span>
              <span className="tabular">50%</span>
            </div>
            <Progress value={50} />
          </div>
        </div>
      </div>
    </div>
  )
}