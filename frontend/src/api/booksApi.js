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

  // Remove a book (protected)
  removeBook: async (bookId) => {
    return apiClient.delete(`/book/removeBook/${bookId}`);
  },

  // Get book details by ID (protected)
  getBookDetails: async (bookId) => {
    return apiClient.get(`/book/details/${bookId}`);
  },

  // --- The following methods are not implemented in the backend yet ---

  // // Get book by ID
  // getBookById: async (bookId) => {
  //   return apiClient.get(`/books/${bookId}`);
  // },

  // // Search books
  // searchBooks: async (query, filters = {}) => {
  //   const params = { q: query, ...filters };
  //   const queryString = new URLSearchParams(params).toString();
  //   return apiClient.get(`/books/search?${queryString}`);
  // },

  // // Get featured books
  // getFeaturedBooks: async () => {
  //   return apiClient.get('/books/featured');
  // },

  // // Get recommended books for user
  // getRecommendations: async (userId) => {
  //   return apiClient.get(`/books/recommendations/${userId}`);
  // },

  // // Get books by category
  // getBooksByCategory: async (category) => {
  //   return apiClient.get(`/books/category/${category}`);
  // },

  // // Add book to favorites
  // addToFavorites: async (bookId) => {
  //   return apiClient.post(`/books/${bookId}/favorite`);
  // },

  // // Remove book from favorites
  // removeFromFavorites: async (bookId) => {
  //   return apiClient.delete(`/books/${bookId}/favorite`);
  // },

  // // Get user's favorite books
  // getFavorites: async () => {
  //   return apiClient.get('/books/favorites');
  // },

  // // Rate a book
  // rateBook: async (bookId, rating) => {
  //   return apiClient.post(`/books/${bookId}/rating`, { rating });
  // },

  // // Get book reviews
  // getBookReviews: async (bookId) => {
  //   return apiClient.get(`/books/${bookId}/reviews`);
  // },

  // // Add book review
  // addReview: async (bookId, reviewData) => {
  //   return apiClient.post(`/books/${bookId}/reviews`, reviewData);
  // },
};