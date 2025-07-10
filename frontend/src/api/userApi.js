import { apiClient } from './apiClient';

export const userApi = {
  // Get current user profile
  getProfile: async () => {
    return apiClient.get('/user/userDetails');
  },

  // Update user profile (with PATCH)
  updateProfile: async (userData) => {
    return apiClient.patch('/user/updateDetails', userData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiClient.patch('/user/change-password', passwordData);
  },

  // Get borrowed books
  getBorrowedBooks: async () => {
    return apiClient.get('/user/borrowedBooks');
  },
};
