import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { booksApi } from '../../api/booksApi';

const EditBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [formData, setFormData] = useState({
    bookName: '',
    edition: '',
    description: '',
    available: 'Available'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // We need to get book details from the user's books since there's no individual book endpoint
      const response = await booksApi.getMyBooks();
      const book = response.data.data?.find(b => b._id === bookId) || response.data?.find(b => b._id === bookId);
      
      if (!book) {
        setError('Book not found or you do not have permission to edit this book');
        toast.error('Book not found');
        return;
      }

      setFormData({
        bookName: book.bookName || '',
        edition: book.edition?.toString() || '',
        description: book.description || '',
        available: book.available || 'Available'
      });
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Failed to load book details');
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.bookName.trim() || !formData.edition || !formData.description.trim()) {
        setError('All fields are required');
        toast.error('All fields are required');
        return;
      }

      if (isNaN(parseInt(formData.edition)) || parseInt(formData.edition) <= 0) {
        setError('Edition must be a valid positive number');
        toast.error('Edition must be a valid positive number');
        return;
      }

      const updateData = {
        bookName: formData.bookName.trim(),
        edition: parseInt(formData.edition),
        description: formData.description.trim(),
        available: formData.available
      };

      await booksApi.updateBook(bookId, updateData);
      
      // Success - show toast and navigate back to profile
      toast.success('Book updated successfully!');
      navigate('/user/profile', { 
        state: { 
          activeTab: 'books' 
        } 
      });

    } catch (err) {
      console.error('Error updating book:', err);
      const errorMessage = err.message || 'Failed to update book. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/user/profile', { state: { activeTab: 'books' } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.bookName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
          <p className="text-gray-600 mt-2">Update your book details</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Name */}
            <div>
              <label htmlFor="bookName" className="block text-sm font-medium text-gray-700 mb-2">
                Book Name *
              </label>
              <input
                type="text"
                id="bookName"
                name="bookName"
                value={formData.bookName}
                onChange={handleInputChange}
                placeholder="Enter the book name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Edition */}
            <div>
              <label htmlFor="edition" className="block text-sm font-medium text-gray-700 mb-2">
                Edition *
              </label>
              <input
                type="number"
                id="edition"
                name="edition"
                value={formData.edition}
                onChange={handleInputChange}
                placeholder="Enter edition number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the book condition, content, or any additional information"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="available" className="block text-sm font-medium text-gray-700 mb-2">
                Availability *
              </label>
              <select
                id="available"
                name="available"
                value={formData.available}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Available">Available</option>
                <option value="Requested">Requested</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Book...
                  </span>
                ) : (
                  'Update Book'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Note</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Book images cannot be updated through this form. If you need to change images, please contact support or delete and re-add the book.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
