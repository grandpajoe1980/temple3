import api from './api';

export const userService = {
  /**
   * List users for the active tenant.
   * @param {{ limit?: number, offset?: number }} params
   */
  async list(params = {}) {
    const response = await api.get('/users', { params });
    return response.data;
  }
};
