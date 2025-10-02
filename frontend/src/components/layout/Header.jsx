import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { tenantData } = useTenant();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Temple Name */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              {tenantData?.name || 'Temple3'}
            </h1>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, {user?.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
