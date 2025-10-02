import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TempleSearch from './TempleSearch';
import CreateTempleButton from './CreateTempleButton';
import AuthModal from '../auth/AuthModal';
import Button from '../shared/Button';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Temple3
          </h1>
          <p className="text-2xl text-gray-600 mb-12">
            Your spiritual community platform for modern times
          </p>

          {/* Search Section */}
          <div className="mb-8 flex justify-center">
            <TempleSearch />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In / Sign Up
            </Button>
            <CreateTempleButton />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-semibold text-gray-900 mb-2">Events & Calendar</h3>
            <p className="text-sm text-gray-600">
              Manage services, events, and community gatherings
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Community Posts</h3>
            <p className="text-sm text-gray-600">
              Share updates, teachings, and connect with members
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🎧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Media Library</h3>
            <p className="text-sm text-gray-600">
              Host podcasts, videos, and sacred texts
            </p>
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
