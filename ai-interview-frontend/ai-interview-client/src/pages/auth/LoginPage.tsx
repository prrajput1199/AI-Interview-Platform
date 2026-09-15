import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from '@/components/Navigation/Logo'
import { hasFirebaseConfig } from '@/lib/firebase'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.85-.08-1.66-.22-2.44H12v4.62h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.27v3.1C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.31A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.58.39-2.31v-3.1H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.41l4.02-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.02 3.1C6.23 6.86 8.88 4.75 12 4.75z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const { loginWithGoogle, isLoggingIn } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-bg-raised p-8 text-center">
          <h1 className="text-lg font-semibold text-fg">Sign in to Loopcoach</h1>
          <p className="mt-1.5 text-sm text-fg-muted">
            Practice interviews, track your scores, and pick up where you left off.
          </p>

          <Button
            variant="secondary"
            size="lg"
            className="mt-6 w-full"
            onClick={() => loginWithGoogle()}
            disabled={isLoggingIn || !hasFirebaseConfig}
          >
            {isLoggingIn ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>

          {!hasFirebaseConfig && (
            <p className="mt-4 text-xs text-warning">
              Google sign-in isn't configured yet. Set the VITE_FIREBASE_* environment
              variables to enable it.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-fg-subtle">
          By continuing, you agree to our terms and acknowledge our privacy practices.
        </p>
      </div>
    </div>
  )
}