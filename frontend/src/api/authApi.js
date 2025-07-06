import { apiClient } from './apiClient';

export const authApi = {
  // User signup
  signup: async (userData) => {
    return apiClient.post('/auth/signup', userData);
  },

  // User login
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  // User logout
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  // Get current user profile
  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiClient.put('/auth/profile', userData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiClient.put('/auth/change-password', passwordData);
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (resetData) => {
    return apiClient.post('/auth/reset-password', resetData);
  },
};