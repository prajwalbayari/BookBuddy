import { apiClient } from './apiClient';

export const adminApi = {
  // Fetch all pending book requests
  getAllRequests: async () => {
    return apiClient.get('/admin/getRequests');
  },

  // Approve a book
  approveBook: async (bookId) => {
    return apiClient.patch(`/admin/approveBook/${bookId}`);
  },

  // Reject a book
  rejectBook: async (bookId) => {
    return apiClient.patch(`/admin/rejectBook/${bookId}`);
  },
  // Get all users mapped with their owned books
  getUsersWithBooks: async () => {
    return apiClient.get('/admin/users-with-books');
  },
};
