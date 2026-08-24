import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Profile from './pages/Profile';
import Layout from './components/layout/layout';
import InterviewSetup from './pages/InterviewSetup';

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
        path:'interview-setup',
        element: (
            <ProtectedRoute>
                <Layout>
                    <InterviewSetup/>
                </Layout>
            </ProtectedRoute>
        )
    }
])