import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from '../Navigation/Logo'
import { navItems } from '../Navigation/navItems'

export function Sidebar() {
  const { user, logout, isLoggingOut } = useAuth()
  if (!user) return null

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-bg-raised lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
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
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-bg-sunken hover:text-danger disabled:opacity-50"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}