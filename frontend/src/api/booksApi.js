import { apiClient } from './apiClient';

export const booksApi = {
  // Get all books
  getAllBooks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/books${queryString ? `?${queryString}` : ''}`);
  },

  // Get book by ID
  getBookById: async (bookId) => {
    return apiClient.get(`/books/${bookId}`);
  },

  // Search books
  searchBooks: async (query, filters = {}) => {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/books/search?${queryString}`);
  },

  // Get featured books
  getFeaturedBooks: async () => {
    return apiClient.get('/books/featured');
  },

  // Get recommended books for user
  getRecommendations: async (userId) => {
    return apiClient.get(`/books/recommendations/${userId}`);
  },

  // Get books by category
  getBooksByCategory: async (category) => {
    return apiClient.get(`/books/category/${category}`);
  },

  // Add book to favorites
  addToFavorites: async (bookId) => {
    return apiClient.post(`/books/${bookId}/favorite`);
  },

  // Remove book from favorites
  removeFromFavorites: async (bookId) => {
    return apiClient.delete(`/books/${bookId}/favorite`);
  },

  // Get user's favorite books
  getFavorites: async () => {
    return apiClient.get('/books/favorites');
  },

  // Rate a book
  rateBook: async (bookId, rating) => {
    return apiClient.post(`/books/${bookId}/rating`, { rating });
  },

  // Get book reviews
  getBookReviews: async (bookId) => {
    return apiClient.get(`/books/${bookId}/reviews`);
  },

  // Add book review
  addReview: async (bookId, reviewData) => {
    return apiClient.post(`/books/${bookId}/reviews`, reviewData);
  },
};