import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFoundPage';
import {
  LazyDashboard,
  LazyInterviewSetup,
  LazyInterviewSession,
  LazyInterviewReport,
  LazyInterviewHistory,
  LazyAnalytics,
  LazyPayment,
  LazyProfile,
} from './utils/lazy';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/layout';
import { PageLoader } from './components/shared/PageLoader';

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader/>}>
    <Component />
  </Suspense>
);

const withLayout = (Component: React.ComponentType) => (
  <ProtectedRoute>
    <Layout>
      {withSuspense(Component)}
    </Layout>
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: withLayout(LazyDashboard),
  },
  {
    path: '/interview-setup',
    element: withLayout(LazyInterviewSetup),
  },
  {
    path: '/interview-session/:interviewId',
    element: withLayout(LazyInterviewSession),
  },
  {
    path: '/interview-report/:interviewId',
    element: withLayout(LazyInterviewReport),
  },
  {
    path: '/history',
    element: withLayout(LazyInterviewHistory),
  },
  {
    path: '/analytics',
    element: withLayout(LazyAnalytics),
  },
  {
    path: '/payment',
    element: withLayout(LazyPayment),
  },
  {
    path: '/profile',
    element: withLayout(LazyProfile),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);