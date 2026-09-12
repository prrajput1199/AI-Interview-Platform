import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageSpinner } from '../loading/pageSpinner'

export function ProtectedRoute() {
  const { isAuthenticated, isChecking } = useAuth()
  const location = useLocation()

  if (isChecking) return <PageSpinner />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, isChecking } = useAuth()

  if (isChecking) return <PageSpinner />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return <Outlet />
}