import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { booksApi } from '../../api/booksApi';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentFeedbackPage, setCurrentFeedbackPage] = useState(0);

  // Get book data from navigation state if available
  const bookFromState = location.state?.book;
  const fromProfile = location.state?.fromProfile;

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await booksApi.getBookDetails(bookId);
        
        if (response.data && response.data.success && response.data.data) {
          setBook(response.data.data);
        } else {
          setError("Invalid book data received from server.");
        }
      } catch (err) {
        
        if (bookFromState) {
          setBook(bookFromState);
          setError(null);
        } else {
          const errorMessage = err.response?.data?.message || "Failed to load book details. Please try again.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    if (bookFromState && bookFromState._id === bookId) {
      setBook(bookFromState);
      setLoading(false);
      setError(null);
    } else if (bookId) {
      fetchBookDetails();
    } else {
      setError("No book ID provided");
      setLoading(false);
    }
  }, [bookId, bookFromState]);

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Borrowed':
        return 'bg-blue-100 text-blue-800';
      case 'Requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'Returned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const calculateAverageRating = (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  };

  const handleChatWithOwner = () => {
    if (book && book.owner) {
      const chatData = {
        selectedUserId: typeof book.owner === 'object' ? book.owner._id : book.owner,
        userName: book.ownerName || (typeof book.owner === 'object' ? book.owner.userName : 'Unknown')
      };
      navigate('/user/chat', { 
        state: chatData
      });
    }
  };

  const nextImage = () => {
    if (book && book.bookImages && book.bookImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % book.bookImages.length);
    }
  };

  const prevImage = () => {
    if (book && book.bookImages && book.bookImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + book.bookImages.length) % book.bookImages.length);
    }
  };

  // Feedback pagination functions
  const FEEDBACKS_PER_PAGE = 5;
  
  const getCurrentFeedbacks = () => {
    if (!book?.feedback || book.feedback.length === 0) return [];
    const startIndex = currentFeedbackPage * FEEDBACKS_PER_PAGE;
    const endIndex = startIndex + FEEDBACKS_PER_PAGE;
    return book.feedback.slice(startIndex, endIndex);
  };

  const getTotalFeedbackPages = () => {
    if (!book?.feedback || book.feedback.length === 0) return 0;
    return Math.ceil(book.feedback.length / FEEDBACKS_PER_PAGE);
  };

  const goToPreviousFeedbackPage = () => {
    setCurrentFeedbackPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextFeedbackPage = () => {
    const totalPages = getTotalFeedbackPages();
    setCurrentFeedbackPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading book details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">Book not found</h3>
            <p className="text-gray-500 mb-6">The book you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/user/books')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Books
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb - Only show if current user is not the owner and not from profile */}
          {user && book && book.owner && (
            typeof book.owner === 'object' ? user._id !== book.owner._id : user._id !== book.owner
          ) && !fromProfile && (
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <button
                    onClick={() => navigate('/user/books')}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Books
                  </button>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-500 truncate max-w-xs">{book.bookName}</span>
                </li>
              </ol>
            </nav>
          )}

          {/* Back to Profile Button - Only show when coming from profile */}
          {fromProfile && (
            <div className="mb-6">
              <button
                onClick={() => navigate('/user/profile')}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to My Books</span>
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Book Images */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                      {book.bookImages && book.bookImages.length > 0 ? (
                        <>
                          <img
                            src={book.bookImages[currentImageIndex]}
                            alt={book.bookName}
                            className="w-full h-full object-cover"
                          />
                          {book.bookImages.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Image Thumbnails */}
                    {book.bookImages && book.bookImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {book.bookImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`aspect-[3/4] bg-gray-100 rounded-md overflow-hidden border-2 ${
                              index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${book.bookName} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Chat with Owner Button - Only show if current user is not the owner and not from profile */}
                    {user && book && book.owner && (
                      typeof book.owner === 'object' ? user._id !== book.owner._id : user._id !== book.owner
                    ) && !fromProfile && (
                      <button
                        onClick={handleChatWithOwner}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Chat with Owner
                      </button>
                    )}
                  </div>
                </div>

                {/* Book Details */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Title and Basic Info */}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.bookName}</h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                        <div className="space-y-2">
                          <p><span className="font-medium">Edition:</span> {book.edition || 'N/A'}</p>
                          <p><span className="font-medium">Owner:</span> {book.ownerName || 'Unknown'}</p>
                        </div>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Availability:</span> 
                            <span className={`ml-2 inline-block px-3 py-1 text-sm font-medium rounded-full ${getAvailabilityColor(book.available)}`}>
                              {book.available}
                            </span>
                          </p>
                          {book.borrowerName && (book.available === 'Borrowed' || book.available === 'Requested') && (
                            <p>
                              <span className="font-medium">
                                {book.available === 'Borrowed' ? 'Borrowed by:' : 'Requested by:'}
                              </span> {book.borrowerName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                      <p className="text-gray-700 leading-relaxed">{book.description}</p>
                    </div>

                    {/* Feedback Section */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback</h2>
                      
                      {book.feedback && book.feedback.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {renderStars(Math.round(calculateAverageRating(book.feedback)))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {calculateAverageRating(book.feedback)} out of 5 ({book.feedback.length} feedback{book.feedback.length !== 1 ? 's' : ''})
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {getCurrentFeedbacks().map((feedback, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-sm font-medium">
                                        {feedback.userId?.userName?.charAt(0).toUpperCase() || 'U'}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {feedback.userId?.userName || 'Anonymous'}
                                      </p>
                                      <div className="flex items-center">
                                        {renderStars(feedback.rating)}
                                      </div>
                                    </div>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(feedback.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700">{feedback.description}</p>
                              </div>
                            ))}
                          </div>

                          {/* Pagination Controls */}
                          {getTotalFeedbackPages() > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                  Page {currentFeedbackPage + 1} of {getTotalFeedbackPages()}
                                </span>
                                <span className="text-sm text-gray-400">
                                  (Showing {getCurrentFeedbacks().length} of {book.feedback.length} feedbacks)
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={goToPreviousFeedbackPage}
                                  disabled={currentFeedbackPage === 0}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                    currentFeedbackPage === 0
                                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                  }`}
                                >
                                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                  Previous
                                </button>
                                <button
                                  onClick={goToNextFeedbackPage}
                                  disabled={currentFeedbackPage >= getTotalFeedbackPages() - 1}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                    currentFeedbackPage >= getTotalFeedbackPages() - 1
                                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                  }`}
                                >
                                  Next
                                  <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <p className="text-gray-500">No feedbacks yet</p>
                          <p className="text-sm text-gray-400 mt-1">Be the first to share your experience with this book</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetails;
