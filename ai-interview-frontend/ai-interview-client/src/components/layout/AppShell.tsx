import { Outlet } from 'react-router-dom'
import { Sidebar } from './sideBar'
import { MobileNav } from './mobileNav'
import { ThemeToggle } from '../Navigation/Themetoggle'


export function AppShell() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <header className="hidden h-16 items-center justify-end border-b border-border px-6 lg:flex">
          <ThemeToggle />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}