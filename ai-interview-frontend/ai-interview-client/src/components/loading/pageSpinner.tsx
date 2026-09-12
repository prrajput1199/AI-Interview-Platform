import { Loader2 } from 'lucide-react'

export function PageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <Loader2 className="size-6 animate-spin text-fg-subtle" />
    </div>
  )
}