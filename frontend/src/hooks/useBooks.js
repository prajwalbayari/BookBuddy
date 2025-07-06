import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';

export const useBooks = (initialParams = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchBooks = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookService.getAllBooks(
        params.page || 1,
        params.limit || 20,
        params.filters || {}
      );
      
      setBooks(response.results);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookService.searchBooks(query, filters);
      setBooks(response.results);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (bookId) => {
    try {
      await bookService.addToFavorites(bookId);
      // Optionally update local state
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFromFavorites = async (bookId) => {
    try {
      await bookService.removeFromFavorites(bookId);
      // Optionally update local state
    } catch (err) {
      setError(err.message);
    }
  };

  const rateBook = async (bookId, rating) => {
    try {
      await bookService.rateBook(bookId, rating);
      // Optionally update local state
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchBooks(initialParams);
  }, []);

  return {
    books,
    loading,
    error,
    pagination,
    fetchBooks,
    searchBooks,
    addToFavorites,
    removeFromFavorites,
    rateBook,
  };
};