import React, { useState, useEffect, useRef } from 'react';
import { booksApi } from '../../../api/booksApi';
import { useNavigate } from 'react-router-dom';
import Card from '../../Card';

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const carouselRef = useRef(null);
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
        const limitedBooks = sortedBooks.slice(0, 10); // Limit to 10 books for carousel
        setBooks(limitedBooks);
      } catch (err) {
        setError("Failed to load books. Please try again.");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const nextSlide = () => {
    if (books.length <= 3) return;
    setActiveIndex((prev) => (prev + 1) % (books.length - 2));
  };

  const prevSlide = () => {
    if (books.length <= 3) return;
    setActiveIndex((prev) => (prev === 0 ? books.length - 3 : prev - 1));
  };

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
          userName: selectedBook.ownerName
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No books available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg">
        <div 
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 25}%)` }}
        >
            {books.map((book, index) => (
              <div key={book._id} className="min-w-[280px] max-w-[280px] px-3 flex-shrink-0">
                <Card className="h-full flex flex-col overflow-hidden bg-white border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    {book.bookImages && book.bookImages.length > 0 ? (
                      <img 
                        src={book.bookImages[0]} 
                        alt={book.bookName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(book.available)}`}>
                      {book.available}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col p-1">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">{book.bookName}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{book.description}</p>
                    <div className="mt-auto flex justify-between items-center pt-2">
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500 font-medium">Edition</p>
                        <p className="text-sm font-semibold text-gray-700">{book.edition || 'N/A'}</p>
                      </div>
                      <button 
                        onClick={() => handleViewBook(book)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

      {books.length > 3 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button 
            onClick={prevSlide}
            className="p-2 rounded-lg bg-white border shadow-sm hover:bg-gray-50 transition-colors duration-200"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="p-2 rounded-lg bg-white border shadow-sm hover:bg-gray-50 transition-colors duration-200"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

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
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700">{selectedBook.description}</p>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleChatWithOwner}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
    </div>
  );
};

export default BookCarousel;
