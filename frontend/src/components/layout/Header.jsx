import { useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { Menu, Transition } from '@headlessui/react';
import AuthModal from '../auth/AuthModal';
import Button from '../shared/Button';
import {
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { tenantData } = useTenant();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // TODO: fetch from API
  const navigate = useNavigate();
  const location = useLocation();

  const navigationTabs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Posts', path: '/posts' },
    { name: 'Texts', path: '/texts' },
    { name: 'Messages', path: '/messages' },
    { name: 'Media', path: '/media' },
    { name: 'Donations', path: '/donations' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo/Temple Name */}
            <div 
              className="flex items-center cursor-pointer hover:opacity-80"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            >
              <h1 className="text-xl font-bold text-gray-900">
                {tenantData?.name || 'Temple3'}
              </h1>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
                    <BellIcon className="h-6 w-6" />
                    {notificationCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                        {getInitials()}
                      </div>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.firstName || user?.email}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => navigate('/profile')}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                Your Profile
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => navigate('/settings')}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                                Settings
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="py-1 border-t border-gray-100">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } flex w-full items-center px-4 py-2 text-sm text-red-700`}
                              >
                                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-400" />
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
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

          {/* Navigation Tabs (only show when authenticated) */}
          {isAuthenticated && (
            <nav className="flex space-x-8 border-t border-gray-200">
              {navigationTabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <button
                    key={tab.name}
                    onClick={() => navigate(tab.path)}
                    className={`${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                    } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          )}
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
