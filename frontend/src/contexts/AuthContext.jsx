/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { tenantService } from '../services/tenant';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const currentTenant = tenantService.getCurrentTenant();

      if (!currentTenant) {
        return {
          success: false,
          error: 'Select your temple from the search bar before signing in.'
        };
      }

      const data = await authService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const apiError = data?.error;

        if (
          status === 400 &&
          typeof apiError === 'string' &&
          apiError.toLowerCase().includes('tenant context')
        ) {
          return {
            success: false,
            error: 'Select your temple from the search bar before signing in.'
          };
        }

        if (status === 401) {
          return {
            success: false,
            error: apiError || 'Invalid email or password. Please try again.'
          };
        }

        if (status === 403) {
          return {
            success: false,
            error: apiError || 'Your account is inactive. Contact your administrator for help.'
          };
        }

        if (status === 404) {
          return {
            success: false,
            error: 'We could not find that temple. Please select it again and try once more.'
          };
        }

        return { success: false, error: apiError || 'Login failed. Please try again.' };
      }

      if (error.request) {
        return {
          success: false,
          error: 'Unable to reach the server. Check your connection and try again.'
        };
      }

      return { success: false, error: error.message || 'Login failed. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const currentTenant = tenantService.getCurrentTenant();

      if (!currentTenant) {
        return {
          success: false,
          error: 'Select your temple from the search bar before creating an account.'
        };
      }

      const data = await authService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const apiError = data?.error;

        if (
          status === 400 &&
          typeof apiError === 'string' &&
          apiError.toLowerCase().includes('tenant context')
        ) {
          return {
            success: false,
            error: 'Select your temple from the search bar before creating an account.'
          };
        }

        if (status === 409) {
          return {
            success: false,
            error: apiError || 'An account with that email already exists.'
          };
        }

        return { success: false, error: apiError || 'Registration failed. Please try again.' };
      }

      if (error.request) {
        return {
          success: false,
          error: 'Unable to reach the server. Check your connection and try again.'
        };
      }

      return { success: false, error: error.message || 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
