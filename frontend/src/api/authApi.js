import { apiClient } from './apiClient';

export const authApi = {
  sendOTP: async (userData) => {
    return apiClient.post('/auth/send-otp', userData);
  },

  verifyOTP: async (verificationData) => {
    return apiClient.post('/auth/verify-otp', verificationData);
  },

  resendOTP: async (emailData) => {
    return apiClient.post('/auth/resend-otp', emailData);
  },

  signup: async (userData) => {
    return apiClient.post('/auth/signup', userData);
  },

  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  adminLogin: async (credentials) => {
    return apiClient.post('/auth/adminLogin', credentials);
  },

  checkAuth: async () => {
    return apiClient.get('/auth/check');
  }
};