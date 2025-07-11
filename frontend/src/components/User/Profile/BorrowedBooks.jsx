import { useState } from 'react';
import toast from 'react-hot-toast';
import { booksApi } from '../../../api/booksApi';
import { useAuth } from '../../../hooks/useAuth';

const BorrowedBooks = ({ books, onRefresh }) => {
  const { user } = useAuth();
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, book: null });
  const [feedbackData, setFeedbackData] = useState({ rating: 5, description: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const handleRefresh = async () => {
    try {
      await onRefresh();
      toast.success('Borrowed books refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh borrowed books');
    }
  };

  const openFeedbackModal = (book) => {
    setFeedbackModal({ isOpen: true, book });
    setFeedbackData({ rating: 5, description: '' });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ isOpen: false, book: null });
    setFeedbackData({ rating: 5, description: '' });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackData.description.trim()) {
      toast.error('Please provide a description for your feedback');
      return;
    }

    setSubmittingFeedback(true);
    try {
      await booksApi.addBookFeedback(feedbackModal.book._id, {
        rating: feedbackData.rating,
        description: feedbackData.description.trim()
      });
      
      toast.success('Feedback submitted successfully!');
      closeFeedbackModal();
      // Optionally refresh the books to update the feedback status
      await onRefresh();
    } catch (error) {
      console.error('Feedback submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit feedback';
      toast.error(errorMessage);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const hasUserGivenFeedback = (book, userId) => {
    return book.feedback && book.feedback.some(feedback => 
      feedback.userId === userId || feedback.userId._id === userId
    );
  };

  // Early return for empty books
  if (!books || books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">No borrowed books</h3>
          <p className="text-gray-500 mb-6 leading-relaxed">
            You haven't borrowed any books yet. Browse the community library to find books you'd like to borrow!
          </p>
        </div>
      </div>
    );
  }

  // Sort books by oldest first (least recently updated)
  const sortedBooks = [...books].sort((a, b) => {
    return new Date(a.updatedAt) - new Date(b.updatedAt);
  });

  const BookCard = ({ book }) => {
    const userHasFeedback = hasUserGivenFeedback(book, user?._id);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Book Cover */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              {book.bookImages && book.bookImages.length > 0 ? (
                <img
                  src={book.bookImages[0]}
                  alt={book.bookName}
                  className="h-28 w-20 sm:h-24 sm:w-18 object-cover rounded-md shadow-sm"
                />
              ) : (
                <div className="h-28 w-20 sm:h-24 sm:w-18 bg-gray-200 rounded-md flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              {/* Title and Owner */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 break-words">
                    {book.bookName}
                  </h4>
                  {book.edition && (
                    <p className="text-sm text-gray-600 mt-1">Edition: {book.edition}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Owner:</span> {book.ownerName}
                  </p>
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">Description:</span> {book.description}
                  </p>
                </div>
              )}

              {/* Status Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  book.available === 'Borrowed'
                    ? 'bg-blue-100 text-blue-800'
                    : book.available === 'Returned'
                    ? 'bg-green-100 text-green-800'
                    : book.available === 'Requested'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {book.available || 'Unknown'}
                </span>
                {userHasFeedback && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Feedback Given
                  </span>
                )}
              </div>

              {/* Date and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="text-xs text-gray-500">
                  Borrowed {new Date(book.updatedAt).toLocaleDateString()}
                </div>
                
                {/* Give Feedback Button */}
                {!userHasFeedback && (
                  <button
                    onClick={() => openFeedbackModal(book)}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v8a2 2 0 002 2h6a2 2 0 002-2V8M7 8v8a2 2 0 002 2h6a2 2 0 002-2V8" />
                    </svg>
                    Give Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Borrowed Books</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {sortedBooks.length} borrowed books
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {sortedBooks.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeFeedbackModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Give Feedback</h3>
                <button
                  onClick={closeFeedbackModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Book Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{feedbackModal.book?.bookName}</h4>
                <p className="text-sm text-gray-600">by {feedbackModal.book?.ownerName}</p>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                        className={`w-8 h-8 ${
                          star <= feedbackData.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {feedbackData.rating} out of 5 stars
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="feedback-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback-description"
                    rows={4}
                    value={feedbackData.description}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Share your thoughts about this book..."
                    required
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                  <button
                    type="button"
                    onClick={closeFeedbackModal}
                    disabled={submittingFeedback}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;
