import api from './api';

export const tenantService = {
  // Get list of tenants (for search)
  async list(params = {}) {
    const queryParams = { ...params };
    if (typeof queryParams.search === 'string') {
      queryParams.search = queryParams.search.trim();
    }

    const response = await api.get('/tenant/discover', { params: queryParams });
    return response.data;
  },

  // Get tenant by subdomain
  async getBySubdomain(subdomain) {
    if (!subdomain) {
      throw new Error('Subdomain is required');
    }

    const response = await api.get(`/tenant/lookup/${encodeURIComponent(subdomain)}`);
    return response.data;
  },

  // Create new tenant
  async create(tenantData) {
    const response = await api.post('/tenant', tenantData);
    return response.data;
  },

  // Update tenant
  async update(tenantData) {
    const response = await api.put('/tenant/current', tenantData);
    return response.data;
  },

  // Set current tenant in localStorage
  setCurrentTenant(subdomain) {
    if (!subdomain) {
      localStorage.removeItem('currentTenant');
      return;
    }

    localStorage.setItem('currentTenant', subdomain.trim().toLowerCase());
  },

  // Get current tenant from localStorage
  getCurrentTenant() {
    return localStorage.getItem('currentTenant');
  },

  // Clear current tenant
  clearCurrentTenant() {
    localStorage.removeItem('currentTenant');
  }
};
