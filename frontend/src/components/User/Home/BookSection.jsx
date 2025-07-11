import React, { useState, useEffect } from 'react';
import { booksApi } from '../../../api/booksApi';
import { useNavigate } from 'react-router-dom';
import Card from '../../Card';

const BookSection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await booksApi.getAllBooks();
        
        // Access the data correctly based on API response structure
        const booksData = response.data.data || response.data;
        
        // Filter only approved books
        const approvedBooks = booksData.filter(book => book.status === "Approved");
        // Sort by availability: Available, Requested, Returned, Borrowed
        const sortedBooks = approvedBooks.sort((a, b) => {
          const order = { "Available": 0, "Requested": 1, "Returned": 2, "Borrowed": 3 };
          return order[a.available] - order[b.available];
        });
        setBooks(sortedBooks);
      } catch (err) {
        setError("Failed to load books. Please try again.");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on status and search term
  const filteredBooks = books.filter(book => {
    // Filter by status
    const statusMatch = statusFilter === 'all' || book.available === statusFilter;
    
    // Filter by search term
    const searchMatch = !searchTerm || 
      book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  const handleViewBook = async (book) => {
    try {
      // Fetch detailed book information
      const response = await booksApi.getBookDetails(book._id);
      if (response.data.success) {
        setSelectedBook(response.data.data);
      } else {
        setSelectedBook(book);
      }
    } catch (err) {
      console.error("Error fetching book details:", err);
      setSelectedBook(book);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedBook(null);
  };

  const handleChatWithOwner = () => {
    if (selectedBook && selectedBook.owner) {
      // Close the popup
      setShowPopup(false);
      
      // Navigate to chat page with owner info in state
      navigate('/user/chat', { 
        state: { 
          selectedUserId: selectedBook.owner._id || selectedBook.owner,
          userName: selectedBook.ownerName || (selectedBook.owner && (typeof selectedBook.owner === 'object' ? selectedBook.owner.userName : selectedBook.owner)) || 'Unknown'
        } 
      });
    }
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'Borrowed':
        return 'bg-red-100 text-red-800';
      case 'Returned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateAverageRating = (feedback) => {
    if (!feedback || feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / feedback.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  const getStatusButtonClass = (status) => {
    return statusFilter === status 
      ? 'bg-blue-600 text-white shadow-md border border-blue-200' 
      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200 hover:border-blue-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading amazing books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5C3.498 18.333 4.46 20 6 20z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="py-8" id="books-section">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 mb-8 border shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Community Library
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                Discover amazing books shared by our passionate reading community
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="text-sm font-medium text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filter by status:
            </span>
            <button 
              onClick={() => setStatusFilter('all')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${getStatusButtonClass('all')}`}
            >
              All Books
            </button>
            <button 
              onClick={() => setStatusFilter('Available')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${getStatusButtonClass('Available')}`}
            >
              Available
            </button>
            <button 
              onClick={() => setStatusFilter('Requested')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${getStatusButtonClass('Requested')}`}
            >
              Requested
            </button>
            <button 
              onClick={() => setStatusFilter('Returned')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${getStatusButtonClass('Returned')}`}
            >
              Returned
            </button>
            <button 
              onClick={() => setStatusFilter('Borrowed')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${getStatusButtonClass('Borrowed')}`}
            >
              Borrowed
            </button>
          </div>
          
          {/* Results Counter */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
            <span>Showing {filteredBooks.length} of {books.length} books</span>
            {searchTerm && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Results for "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book._id} className="group h-full flex flex-col overflow-hidden bg-white/70 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white/90">
                <div className="relative h-52 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  {book.bookImages && book.bookImages.length > 0 ? (
                    <img 
                      src={book.bookImages[0]} 
                      alt={book.bookName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                      <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-xl backdrop-blur-sm border border-white/30 ${getAvailabilityColor(book.available)}`}>
                    {book.available}
                  </span>
                </div>
                <div className="flex-1 flex flex-col p-1">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1 group-hover:text-primary-600 transition-colors duration-200">{book.bookName}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{book.description}</p>
                  <div className="mt-auto flex justify-between items-center pt-2">
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500 font-medium">Edition</p>
                      <p className="text-sm font-semibold text-gray-700">{book.edition || 'N/A'}</p>
                    </div>
                    <button 
                      onClick={() => handleViewBook(book)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md text-sm font-semibold"
                    >
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Book Details Popup */}
      {showPopup && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-popup">
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close popup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden mb-3">
                  {selectedBook.bookImages && selectedBook.bookImages.length > 0 ? (
                    <img 
                      src={selectedBook.bookImages[0]} 
                      alt={selectedBook.bookName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getAvailabilityColor(selectedBook.available)}`}>
                  {selectedBook.available}
                </span>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-3">{selectedBook.bookName}</h2>
                <div className="mb-4">
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Edition:</span> {selectedBook.edition || 'N/A'}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Owner:</span> {selectedBook.ownerName || (selectedBook.owner && (typeof selectedBook.owner === 'object' ? selectedBook.owner.userName : selectedBook.owner)) || 'Unknown'}
                  </p>
                  {/* Show borrower name if book is borrowed or requested */}
                  {selectedBook.borrowerName && (selectedBook.available === 'Borrowed' || selectedBook.available === 'Requested') && (
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">
                        {selectedBook.available === 'Borrowed' ? 'Borrowed by:' : 'Requested by:'}
                      </span> {selectedBook.borrowerName}
                    </p>
                  )}
                  {selectedBook.feedback && selectedBook.feedback.length > 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="font-medium text-gray-700">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(Math.round(calculateAverageRating(selectedBook.feedback)))}
                        <span className="text-sm text-gray-600 ml-2">
                          {calculateAverageRating(selectedBook.feedback)} ({selectedBook.feedback.length} feedback{selectedBook.feedback.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700">{selectedBook.description}</p>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate(`/book-details/${selectedBook._id}`, { 
                      state: { book: selectedBook } 
                    })}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Book Details
                  </button>
                  <button
                    onClick={handleChatWithOwner}
                    className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat with Owner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookSection;
