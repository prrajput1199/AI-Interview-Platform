import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Profile from './pages/Profile';
import Layout from './components/layout/layout';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import InterviewHistory from './pages/InterviewHistory';
import Payment from './pages/Payment';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Layout>
                    <Dashboard />
                </Layout>
            </ProtectedRoute>
        )
    },
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <Layout>
                    <Profile />
                </Layout>
            </ProtectedRoute>
        )
    },
    {
        path: '/interview-setup',
        element: (
            <ProtectedRoute>
                <Layout>
                    <InterviewSetup />
                </Layout>
            </ProtectedRoute>
        )
    },
    {
        path: '/interview-session/:interviewId',
        element: (
            <ProtectedRoute>
                <Layout>
                    <InterviewSession />
                </Layout>
            </ProtectedRoute>
        )
    },
    {
        path: '/history',
        element: (
            <ProtectedRoute>
                <Layout>
                    <InterviewHistory />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: '/payment',
        element: (
            <ProtectedRoute>
                <Layout>
                    <Payment />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
    path: '*',
    element: <NotFound />,
  },
])