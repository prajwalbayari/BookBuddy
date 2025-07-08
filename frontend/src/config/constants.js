// API Configuration
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

// App Configuration
export const APP_NAME = 'BookBuddy';
export const APP_VERSION = '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Book Rating
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// Authentication
export const TOKEN_KEY = 'authToken';
export const USER_KEY = 'currentUser';

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BOOKS: '/books',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  ADMIN: '/admin',
};

// Book Genres
export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Poetry',
  'Drama',
  'Horror',
  'Thriller',
  'Children',
  'Young Adult',
];

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};