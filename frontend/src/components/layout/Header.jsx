import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import AuthModal from '../auth/AuthModal';
import Button from '../shared/Button';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { tenantData } = useTenant();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Temple Name */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600">
                {tenantData?.name || 'Temple3'}
              </h1>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700">
                    Welcome, {user?.firstName || user?.email}
                  </span>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="primary"
                  size="sm"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
};

export default Header;
