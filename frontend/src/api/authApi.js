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

  // Admin login
  adminLogin: async (credentials) => {
    return apiClient.post('/auth/adminLogin', credentials);
  },
};