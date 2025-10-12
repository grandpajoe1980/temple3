import api from './api';

export const eventsService = {
  /**
   * Fetch events for the active tenant.
   * @param {{ startDate?: string, endDate?: string, eventType?: string, limit?: number, offset?: number }} params
   */
  async list(params = {}) {
    const response = await api.get('/events', { params });
    return response.data;
  },

  /**
   * Create a new calendar event for the active tenant.
   * @param {{ title: string, description?: string, startTime: string, endTime: string, location?: string, eventType?: string, isRecurring?: boolean, recurrenceRule?: string }} payload
   */
  async create(payload) {
    const response = await api.post('/events', payload);
    return response.data;
  },

  /**
   * Update an existing calendar event.
   * @param {string|number} id
   * @param {Record<string, unknown>} updates
   */
  async update(id, updates) {
    const response = await api.put(`/events/${id}`, updates);
    return response.data;
  },

  /**
   * Delete an event by id.
   * @param {string|number} id
   */
  async remove(id) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};
