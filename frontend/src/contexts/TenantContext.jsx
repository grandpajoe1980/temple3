/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { tenantService } from '../services/tenant';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load current tenant from localStorage
    const savedTenant = tenantService.getCurrentTenant();
    if (savedTenant) {
      setCurrentTenant(savedTenant);
      loadTenantData(savedTenant);
    }
  }, []);

  const loadTenantData = async (subdomain) => {
    setLoading(true);
    try {
      const data = await tenantService.getBySubdomain(subdomain);
      setTenantData(data);
    } catch (error) {
      console.error('Failed to load tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchTenant = async (subdomain) => {
    tenantService.setCurrentTenant(subdomain);
    setCurrentTenant(subdomain);
    await loadTenantData(subdomain);
  };

  const clearTenant = () => {
    tenantService.clearCurrentTenant();
    setCurrentTenant(null);
    setTenantData(null);
  };

  const value = {
    currentTenant,
    tenantData,
    loading,
    switchTenant,
    clearTenant
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
