import api from './api';

export const postService = {
  /**
   * Retrieve layperson posts for the active tenant.
   * @param {{ limit?: number, offset?: number, isPublished?: boolean }} params
   */
  async list(params = {}) {
    const response = await api.get('/layperson-posts', { params });
    return response.data;
  },

  /**
   * Create a new layperson post.
   * @param {{ content: string, attachments?: unknown[], isPublished?: boolean }} payload
   */
  async create(payload) {
    const response = await api.post('/layperson-posts', payload);
    return response.data;
  },

  /**
   * Fetch the comments for a post.
   * @param {string|number} postId
   */
  async getComments(postId) {
    const response = await api.get(`/layperson-posts/${postId}/comments`);
    return response.data;
  },

  /**
   * Add a comment to a layperson post.
   * @param {string|number} postId
   * @param {{ content: string }} payload
   */
  async addComment(postId, payload) {
    const response = await api.post(`/layperson-posts/${postId}/comments`, payload);
    return response.data;
  }
};
