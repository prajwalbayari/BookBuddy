import React, { useState, useEffect, useRef } from 'react';
import { booksApi } from '../../../api/booksApi';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Get number of visible items based on screen size
  const getVisibleItems = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 600) return 1; // 600px and below: 1 card
      if (window.innerWidth < 1024) return 2; // 600px to 1023px: 2 cards
      if (window.innerWidth < 1280) return 3; // 1024px to 1279px: 3 cards
      return 4; // 1280px and above: 4 cards
    }
    return 4;
  };

  const [visibleItems, setVisibleItems] = useState(getVisibleItems());

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

  // Handle window resize for responsive visible items
  useEffect(() => {
    const handleResize = () => {
      const newVisibleItems = getVisibleItems();
      setVisibleItems(newVisibleItems);
      // Reset active index if it's out of bounds
      if (activeIndex >= books.length - newVisibleItems + 1) {
        setActiveIndex(Math.max(0, books.length - newVisibleItems));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, books.length]);

  const nextSlide = () => {
    if (books.length <= visibleItems) return;
    setActiveIndex((prev) => {
      const maxIndex = books.length - visibleItems;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    if (books.length <= visibleItems) return;
    setActiveIndex((prev) => {
      const maxIndex = books.length - visibleItems;
      return prev === 0 ? maxIndex : prev - 1;
    });
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Calculate translation percentage based on visible items
  const getTranslationPercentage = () => {
    return (100 / visibleItems) * activeIndex;
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
          userName: selectedBook.ownerName || (selectedBook.owner && (typeof selectedBook.owner === 'object' ? selectedBook.owner.userName : selectedBook.owner)) || 'Unknown'
        } 
      });
    }
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Requested':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Borrowed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'Returned':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
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
        <p className="text-gray-500 dark:text-gray-400">No books available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg">
        <div 
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${getTranslationPercentage()}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {books.map((book, index) => (
            <div 
              key={book._id} 
              className={`px-2 sm:px-3 flex-shrink-0 ${
                visibleItems === 1 ? 'w-full' : 
                visibleItems === 2 ? 'w-1/2' : 
                visibleItems === 3 ? 'w-1/3' :
                'w-1/4'
              }`}
            >
              <BookCard 
                book={book}
                onViewBook={handleViewBook}
              />
            </div>
          ))}
        </div>
      </div>

      {books.length > visibleItems && (
        <>
          {/* Navigation buttons */}
          <div className="flex justify-center mt-6 space-x-4">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.max(0, books.length - visibleItems + 1) }, (_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  i === activeIndex ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Book Details Popup */}
      {showPopup && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-popup">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold truncate pr-4 text-gray-900 dark:text-white">{selectedBook.bookName}</h2>
              <button 
                onClick={closePopup}
                className="flex-shrink-0 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 touch-manipulation"
                aria-label="Close popup"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden mb-3">
                    {selectedBook.bookImages && selectedBook.bookImages.length > 0 ? (
                      <img 
                        src={selectedBook.bookImages[0]} 
                        alt={selectedBook.bookName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 mb-1">
                      <span className="font-medium">Edition:</span> {selectedBook.edition || 'N/A'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-1">
                      <span className="font-medium">Owner:</span> {selectedBook.ownerName || (selectedBook.owner && (typeof selectedBook.owner === 'object' ? selectedBook.owner.userName : selectedBook.owner)) || 'Unknown'}
                    </p>
                    {selectedBook.feedback && selectedBook.feedback.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(Math.round(calculateAverageRating(selectedBook.feedback)))}
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                            {calculateAverageRating(selectedBook.feedback)} ({selectedBook.feedback.length} feedback{selectedBook.feedback.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedBook.description}</p>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate(`/book-details/${selectedBook._id}`, { 
                        state: { book: selectedBook } 
                      })}
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors touch-manipulation"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Book Details
                    </button>
                    <button
                      onClick={handleChatWithOwner}
                      className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors touch-manipulation"
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
        </div>
      )}
    </div>
  );
};

export default BookCarousel;
