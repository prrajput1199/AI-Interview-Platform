import { Route, Routes } from 'react-router-dom'
import { useSessionBootstrap } from '@/hooks/useAuth'
import { ProtectedRoute, GuestRoute } from '@/components/layout/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'

import LandingPage from '@/pages/LandingPage'

import DashboardPage from '@/pages/dashboard/DashboardPage'
import InterviewHistoryPage from '@/pages/interviews/InterviewHistoryPage'
import NewInterviewPage from '@/pages/interviews/NewInterviewPage'
import InterviewSessionPage from '@/pages/interviews/InterviewSessionPage'
import InterviewReportPage from '@/pages/interviews/InterviewReportPage'
import ResumePage from '@/pages/resume/ResumePage'
import AnalyticsPage from '@/pages/analytics/AnalyticsPage'
import CreditsPage from '@/pages/credits/CreditsPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import LoginPage from './pages/Login'

export default function App() {
  useSessionBootstrap()

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/interviews" element={<InterviewHistoryPage />} />
          <Route path="/interviews/new" element={<NewInterviewPage />} />
          <Route path="/interviews/:interviewId" element={<InterviewSessionPage />} />
          <Route path="/interviews/:interviewId/report" element={<InterviewReportPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}