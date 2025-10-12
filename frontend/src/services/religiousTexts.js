import api from './api';

export const religiousTextService = {
  /**
   * List religious texts for the active tenant.
   * @param {{ limit?: number, offset?: number, category?: string, isPublic?: boolean }} params
   */
  async list(params = {}) {
    const response = await api.get('/religious-texts', { params });
    return response.data;
  },

  /**
   * Create a new religious text entry.
   * @param {{ title: string, content: string, author?: string, category?: string, tags?: string[], isPublic?: boolean }} payload
   */
  async create(payload) {
    const response = await api.post('/religious-texts', payload);
    return response.data;
  }
};
