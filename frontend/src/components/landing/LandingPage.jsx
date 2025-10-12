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
  const { currentTenant, tenantData } = useTenant();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleContinueAsGuest = () => {
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" />

      <div className="relative w-full max-w-3xl space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">Temple</h1>
          <p className="text-lg text-slate-500 sm:text-xl">Find your temple.</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <TempleSearch />
          <p className="text-sm text-slate-400">
            Search by community name or location to choose the tenant you belong to.
          </p>
          {currentTenant && (
            <p className="text-sm text-slate-500">
              Connected to <span className="font-medium text-slate-700">{tenantData?.name || currentTenant}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            onClick={() => setShowAuthModal(true)}
            variant="primary"
            size="md"
            className="rounded-full px-8 py-3 text-base shadow-sm"
          >
            Log in
          </Button>
          <Button
            onClick={handleContinueAsGuest}
            variant="outline"
            size="md"
            className="rounded-full px-8 py-3 text-base"
          >
            Continue as guest
          </Button>
        </div>

        <div className="space-y-2 text-xs text-slate-400">
          <p>Log in to unlock your personalized tenant experience.</p>
          <p>Guest access lets you preview Temple without joining a community.</p>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
};

export default LandingPage;
