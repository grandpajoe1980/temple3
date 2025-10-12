/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import LandingPage from './components/landing/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import Calendar from './components/features/calendar/Calendar';
import Posts from './components/features/posts/Posts';
import ReligiousTexts from './components/features/texts/ReligiousTexts';
import Messages from './components/features/messages/Messages';
import Media from './components/features/media/Media';
import Donations from './components/features/donations/Donations';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Layout wrapper component
function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

// Route configuration
export const router = createBrowserRouter([
  {
    element: <LayoutWrapper />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/calendar',
        element: (
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        ),
      },
      {
        path: '/posts',
        element: (
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        ),
      },
      {
        path: '/texts',
        element: (
          <ProtectedRoute>
            <ReligiousTexts />
          </ProtectedRoute>
        ),
      },
      {
        path: '/messages',
        element: (
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        ),
      },
      {
        path: '/media',
        element: (
          <ProtectedRoute>
            <Media />
          </ProtectedRoute>
        ),
      },
      {
        path: '/donations',
        element: (
          <ProtectedRoute>
            <Donations />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
