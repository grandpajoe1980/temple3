import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import TempleSearch from './TempleSearch';
import AuthModal from '../auth/AuthModal';
import Button from '../shared/Button';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { currentTenant } = useTenant();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleContinueAsGuest = () => {
    if (!currentTenant) {
      // Show error or guide user to select temple first
      alert('Please select a temple from the search box before continuing as guest.');
      return;
    }
    // Navigate to dashboard as guest (without authentication)
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-200/40 via-slate-100 to-rose-100/30" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-white via-transparent to-transparent" />

      {/* Main content - Google-like centered design */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Temple heading */}
          <h1 className="text-7xl sm:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 mb-12">
            Temple
          </h1>

          {/* Find your temple text */}
          <p className="text-xl text-slate-600 mb-8">
            Find your Temple
          </p>

          {/* Search box */}
          <div className="mb-10">
            <TempleSearch />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 shadow-xl shadow-indigo-200/60 border border-white/40 min-w-[180px]"
              onClick={() => setShowAuthModal(true)}
            >
              Login
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="border-2 border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-700 shadow-lg min-w-[180px]"
              onClick={handleContinueAsGuest}
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
};

export default LandingPage;
