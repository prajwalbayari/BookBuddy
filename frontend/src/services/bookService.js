import { booksApi } from '../api/booksApi';

class BookService {
  // Get all books with pagination and filters
  async getAllBooks(page = 1, limit = 20, filters = {}) {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      
      // In real implementation, this would be:
      // return await booksApi.getAllBooks(params);
      
      // Mock response
      return this.getMockBooks(page, limit, filters);
    } catch (error) {
      console.error('Get all books failed:', error);
      throw error;
    }
  }

  // Search books
  async searchBooks(query, filters = {}) {
    try {
      // In real implementation, this would be:
      // return await booksApi.searchBooks(query, filters);
      
      // Mock search
      const mockBooks = this.getMockBooks(1, 10, filters);
      return {
        ...mockBooks,
        results: mockBooks.results.filter(book => 
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase())
        ),
      };
    } catch (error) {
      console.error('Search books failed:', error);
      throw error;
    }
  }

  // Get book details
  async getBookById(bookId) {
    try {
      // In real implementation, this would be:
      // return await booksApi.getBookById(bookId);
      
      // Mock book details
      return {
        id: bookId,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A classic American novel about the Jazz Age and the American Dream.',
        genre: 'Fiction',
        publishedYear: 1925,
        pages: 180,
        isbn: '978-0-7432-7356-5',
        rating: 4.2,
        reviews: 1250,
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        availability: 'Available',
      };
    } catch (error) {
      console.error('Get book by ID failed:', error);
      throw error;
    }
  }

  // Get featured books
  async getFeaturedBooks() {
    try {
      // In real implementation, this would be:
      // return await booksApi.getFeaturedBooks();
      
      // Mock featured books
      return {
        results: [
          {
            id: 1,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            genre: 'Fiction',
            rating: 4.8,
            coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
          },
          {
            id: 2,
            title: '1984',
            author: 'George Orwell',
            genre: 'Science Fiction',
            rating: 4.7,
            coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
          },
        ],
      };
    } catch (error) {
      console.error('Get featured books failed:', error);
      throw error;
    }
  }

  // Get user recommendations
  async getRecommendations(userId) {
    try {
      // In real implementation, this would be:
      // return await booksApi.getRecommendations(userId);
      
      // Mock recommendations
      return this.getMockBooks(1, 5, { recommended: true });
    } catch (error) {
      console.error('Get recommendations failed:', error);
      throw error;
    }
  }

  // Add book to favorites
  async addToFavorites(bookId) {
    try {
      // In real implementation, this would be:
      // return await booksApi.addToFavorites(bookId);
      
      console.log('Added book to favorites:', bookId);
      return { success: true };
    } catch (error) {
      console.error('Add to favorites failed:', error);
      throw error;
    }
  }

  // Remove book from favorites
  async removeFromFavorites(bookId) {
    try {
      // In real implementation, this would be:
      // return await booksApi.removeFromFavorites(bookId);
      
      console.log('Removed book from favorites:', bookId);
      return { success: true };
    } catch (error) {
      console.error('Remove from favorites failed:', error);
      throw error;
    }
  }

  // Rate a book
  async rateBook(bookId, rating) {
    try {
      // In real implementation, this would be:
      // return await booksApi.rateBook(bookId, rating);
      
      console.log('Rated book:', bookId, 'Rating:', rating);
      return { success: true, rating };
    } catch (error) {
      console.error('Rate book failed:', error);
      throw error;
    }
  }

  // Mock books data
  getMockBooks(page = 1, limit = 20, filters = {}) {
    const mockBooks = [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        rating: 4.2,
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        description: 'A classic American novel about the Jazz Age.',
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        rating: 4.8,
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        description: 'A gripping tale of racial injustice and childhood innocence.',
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        genre: 'Science Fiction',
        rating: 4.7,
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        description: 'A dystopian social science fiction novel.',
      },
      {
        id: 4,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        rating: 4.6,
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        description: 'A romantic novel of manners.',
      },
      {
        id: 5,
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Fiction',
        rating: 4.0,
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        description: 'A coming-of-age story in 1950s New York.',
      },
    ];

    return {
      results: mockBooks,
      pagination: {
        page,
        limit,
        total: mockBooks.length,
        pages: Math.ceil(mockBooks.length / limit),
      },
    };
  }
}

export const bookService = new BookService();