import api from './api';

export const tenantService = {
  // Get list of tenants (for search)
  async list(params = {}) {
    const response = await api.get('/tenant', { params });
    return response.data;
  },

  // Get tenant by subdomain
  async getBySubdomain(subdomain) {
    const response = await api.get(`/tenant/${subdomain}`);
    return response.data;
  },

  // Create new tenant
  async create(tenantData) {
    const response = await api.post('/tenant', tenantData);
    return response.data;
  },

  // Update tenant
  async update(id, tenantData) {
    const response = await api.put(`/tenant/${id}`, tenantData);
    return response.data;
  },

  // Set current tenant in localStorage
  setCurrentTenant(subdomain) {
    localStorage.setItem('currentTenant', subdomain);
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
