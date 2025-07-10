import { apiClient } from './apiClient';

export const booksApi = {
  // Get all books (protected)
  getAllBooks: async () => {
    return apiClient.get('/book/getAll');
  },

  // Get my books (protected)
  getMyBooks: async () => {
    return apiClient.get('/book/myBooks');
  },

  // Add a new book (protected, with file upload)
  addBook: async (bookData) => {
    return apiClient.post('/book/addBook', bookData);
  },

  // Update book details (protected)
  updateBook: async (bookId, bookData) => {
    return apiClient.patch(`/book/updateBook/${bookId}`, bookData);
  },

  // Get all users for borrower selection (protected)
  getAllUsers: async () => {
    return apiClient.get('/book/users');
  },

  // Remove a book (protected)
  removeBook: async (bookId) => {
    return apiClient.delete(`/book/removeBook/${bookId}`);
  },

  // Get book details by ID (protected)
  getBookDetails: async (bookId) => {
    return apiClient.get(`/book/details/${bookId}`);
  },
};