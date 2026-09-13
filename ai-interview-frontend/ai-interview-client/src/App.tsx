import { Route, Routes } from 'react-router-dom'
import { useSessionBootstrap } from '@/hooks/useAuth'
import { AppShell } from '@/components/layout/AppShell'
import LoginPage from './pages/Login'
import NotFoundPage from './pages/NotFoundPage'
import { GuestRoute, ProtectedRoute } from './components/layout/protectedRoute'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/dashboard/dashboard'
import InterviewHistoryPage from './pages/interviews/interviewHistoryPage'
import NewInterviewPage from './pages/interviews/newInterviewPage'
import InterviewSessionPage from './pages/interviews/interviewSessionPage'
import ProfilePage from './pages/profile/profilePage'
import CreditsPage from './pages/credits/creditsPage'
import InterviewReportPage from './pages/interviews/interviewReportPage'
import ResumePage from './pages/resume/resumePage'
import AnalyticsPage from './pages/analytics/analyticsPage'

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
          <Route path="/interviews/:interviewId/report" element={<InterviewReportPage/>} />
          <Route path="/resume" element={<ResumePage/>} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
  )
}