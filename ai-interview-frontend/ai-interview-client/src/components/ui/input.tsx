import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border bg-bg-raised px-3 text-sm text-fg placeholder:text-fg-subtle transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-danger' : 'border-border',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }