import api from './api';

export const messageService = {
  /**
   * Send a new direct message.
   * @param {{ recipientId: number|string, subject: string, content: string }} payload
   */
  async send(payload) {
    const response = await api.post('/messages', payload);
    return response.data;
  },

  /**
   * Fetch inbox messages for the authenticated user.
   * @param {{ limit?: number, offset?: number }} params
   */
  async getInbox(params = {}) {
    const response = await api.get('/messages/inbox', { params });
    return response.data;
  },

  /**
   * Fetch sent messages for the authenticated user.
   * @param {{ limit?: number, offset?: number }} params
   */
  async getSent(params = {}) {
    const response = await api.get('/messages/sent', { params });
    return response.data;
  },

  /**
   * Mark a message as read.
   * @param {number|string} id
   */
  async markAsRead(id) {
    const response = await api.put(`/messages/${id}/read`);
    return response.data;
  }
};
