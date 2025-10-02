import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Layout from './components/layout/Layout';
import LandingPage from './components/landing/LandingPage';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <TenantProvider>
              <Layout>
                <LandingPage />
              </Layout>
            </TenantProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
