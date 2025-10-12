import { useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { Menu, Transition } from '@headlessui/react';
import AuthModal from '../auth/AuthModal';
import Button from '../shared/Button';
import usePermissions from '../../hooks/usePermissions';
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
  const [notificationCount] = useState(3); // TODO: fetch from API
  const navigate = useNavigate();
  const location = useLocation();

  const { isAdmin, hasPermission } = usePermissions();
  const canSeeAdminNav = isAdmin() || hasPermission('manage_settings');

  const navigationTabs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Posts', path: '/posts' },
    { name: 'Texts', path: '/texts' },
    { name: 'Messages', path: '/messages' },
    { name: 'Media', path: '/media' },
    { name: 'Donations', path: '/donations' },
    ...(canSeeAdminNav ? [{ name: 'Admin', path: '/admin' }] : []),
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
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-slate-200/60 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.45)]">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            {/* Logo/Temple Name */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            >
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg flex items-center justify-center text-white font-semibold">
                {(tenantData?.name || 'T3').slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                  {tenantData?.name || 'Temple3'}
                </h1>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Sacred connections</p>
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <button className="relative group rounded-full bg-white/60 p-2 text-slate-500 hover:text-slate-900 shadow-inner shadow-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <BellIcon className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white shadow-lg">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-2 rounded-full border border-white/60 bg-white/60 p-1 pr-3 shadow-md shadow-indigo-200/40 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                        {getInitials()}
                      </div>
                      <span className="text-sm font-medium text-slate-700 hidden md:block">
                        {user?.firstName || 'You'}
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-150"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-100"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-3 w-60 origin-top-right overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-2xl backdrop-blur-xl focus:outline-none">
                        <div className="px-4 py-4 bg-gradient-to-r from-indigo-50/70 to-blue-50/70">
                          <p className="text-sm font-semibold text-slate-900">
                            {user?.firstName || user?.email}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => navigate('/profile')}
                                className={`${
                                  active ? 'bg-indigo-50/80 text-indigo-600' : 'text-slate-600'
                                } flex w-full items-center px-4 py-2 text-sm transition-colors`}
                              >
                                <UserCircleIcon className="mr-3 h-5 w-5 text-indigo-400" />
                                Your Profile
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => navigate('/settings')}
                                className={`${
                                  active ? 'bg-indigo-50/80 text-indigo-600' : 'text-slate-600'
                                } flex w-full items-center px-4 py-2 text-sm transition-colors`}
                              >
                                <Cog6ToothIcon className="mr-3 h-5 w-5 text-indigo-400" />
                                Settings
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="py-2 border-t border-slate-100">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-rose-50/90 text-rose-600' : 'text-rose-500'
                                } flex w-full items-center px-4 py-2 text-sm font-medium transition-colors`}
                              >
                                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-rose-400" />
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
                  className="shadow-lg shadow-indigo-200/60 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 border border-white/40"
                >
                  Enter Portal
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Tabs (only show when authenticated) */}
          {isAuthenticated && (
            <nav className="relative flex items-center justify-center pb-4">
              <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/60 p-1 shadow-inner shadow-indigo-100/70 backdrop-blur">
                {navigationTabs.map((tab) => {
                  const isActive = location.pathname === tab.path;
                  return (
                    <button
                      key={tab.name}
                      onClick={() => navigate(tab.path)}
                      className={`${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-lg'
                          : 'text-slate-500 hover:text-slate-900'
                      } whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300`}
                    >
                      {tab.name}
                    </button>
                  );
                })}
              </div>
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
