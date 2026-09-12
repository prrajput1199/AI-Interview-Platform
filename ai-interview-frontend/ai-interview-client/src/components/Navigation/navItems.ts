import {
  LayoutDashboard,
  ListChecks,
  FileText,
  BarChart3,
  Coins,
  UserRound,
  Sparkles,
} from 'lucide-react'

export const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/interviews/new', label: 'Start Interview', icon: Sparkles },
  { to: '/interviews', label: 'Interviews', icon: ListChecks, end: true },
  { to: '/resume', label: 'Resume', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/credits', label: 'Credits', icon: Coins },
  { to: '/profile', label: 'Profile', icon: UserRound },
]