import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TempleSearch from './TempleSearch';
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
      <div className="max-w-2xl mx-auto px-4 w-full">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-7xl font-bold text-gray-900 mb-6">
            Temple3
          </h1>
          <p className="text-3xl text-gray-600 mb-16">
            Your spiritual community platform for modern times
          </p>

          {/* Search Section */}
          <div className="mb-10 flex justify-center">
            <TempleSearch />
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowAuthModal(true)}
            >
              Login
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
