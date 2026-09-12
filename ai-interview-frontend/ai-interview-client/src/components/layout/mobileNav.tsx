import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from '../Navigation/Logo'
import { ThemeToggle } from '../Navigation/Themetoggle'
import { navItems } from '../Navigation/navItems'
import { Avatar } from '../ui/avatar'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { user, logout, isLoggingOut } = useAuth()

  return (
    <div className="flex h-14 items-center justify-between border-b border-border bg-bg-raised px-4 lg:hidden">
      <Logo />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-sunken"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto flex h-full w-72 flex-col bg-bg-raised shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-sunken"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent-soft text-accent'
                        : 'text-fg-muted hover:bg-bg-sunken hover:text-fg',
                    )
                  }
                >
                  <Icon className="size-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {user && (
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
                  <Avatar name={user.name} src={user.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{user.name}</p>
                    <p className="truncate text-xs text-fg-subtle">
                      {user.creditWallet?.balance ?? 0} credits
                    </p>
                  </div>
                  <button
                    onClick={() => logout()}
                    disabled={isLoggingOut}
                    aria-label="Log out"
                    className="flex size-8 shrink-0 items-center justify-center rounded-md text-fg-subtle hover:bg-bg-sunken hover:text-danger disabled:opacity-50"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}