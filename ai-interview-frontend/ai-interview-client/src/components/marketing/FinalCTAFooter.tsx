import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '../Navigation/Logo'


export function FinalCta() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Your next interview is coming. Be ready for it.
        </h2>
        <p className="mt-3 max-w-md text-fg-muted">
          Upload your resume and run your first mock interview in the next five minutes.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link to="/login">
            Start Practicing
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#credits' },
  ],
  Account: [
    { label: 'Sign In', href: '/login' },
    { label: 'Get Started', href: '/login' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Logo/>
          <p className="mt-3 text-sm text-fg-muted">
            An AI interview coach that reads your resume and scores you like the real
            thing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-medium text-fg-subtle">{section}</p>
              <ul className="mt-3 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-fg-muted hover:text-fg">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-border pt-6 text-xs text-fg-subtle">
        © {new Date().getFullYear()} Loopcoach. All rights reserved.
      </div>
    </footer>
  )
}