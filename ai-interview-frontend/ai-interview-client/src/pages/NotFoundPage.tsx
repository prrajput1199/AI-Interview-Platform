import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Navigation/Logo'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="font-mono text-sm text-fg-subtle">404</p>
        <h1 className="text-2xl font-semibold text-fg">Page not found</h1>
        <p className="max-w-sm text-sm text-fg-muted">
          The page you're looking for doesn't exist or may have moved.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}