import api from './api';

export const authService = {
  // Login with email and password
  async login(email, password) {
    const payload = {
      email: email?.trim().toLowerCase(),
      password
    };

    const response = await api.post('/auth/login', payload);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register new user
  async register(userData) {
    const payload = {
      email: userData.email?.trim().toLowerCase(),
      password: userData.password,
      firstName: userData.firstName?.trim(),
      lastName: userData.lastName?.trim()
    };

    if (userData.phone) {
      payload.phone = userData.phone.trim();
    }

    const response = await api.post('/auth/register', payload);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
