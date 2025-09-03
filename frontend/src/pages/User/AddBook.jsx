import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { booksApi } from '../../api/booksApi';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookName: '',
    edition: '',
    description: '',
    url: '',
    bookImages: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError('You can upload maximum 3 images');
      return;
    }

    setFormData(prev => ({
      ...prev,
      bookImages: files
    }));

    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
    setError(null);
  };

  const removeImage = (index) => {
    const newImages = formData.bookImages.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      bookImages: newImages
    }));
    setImagePreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.bookName.trim() || !formData.edition || !formData.description.trim()) {
        setError('All fields are required');
        return;
      }

      if (isNaN(parseInt(formData.edition)) || parseInt(formData.edition) <= 0) {
        setError('Edition must be a valid positive number');
        return;
      }

      // Validate URL if provided
      if (formData.url.trim()) {
        // Comprehensive URL regex that handles most common cases
        const urlPattern = /^(https?:\/\/)?([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,63})([\/\w \.\-~:?#\[\]@!$&'()*+,;=%]*)*\/?$/i;
        
        // Block dangerous protocols
        const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
        if (dangerousProtocols.test(formData.url.trim())) {
          setError('Invalid URL protocol detected');
          return;
        }
        
        if (!urlPattern.test(formData.url.trim())) {
          setError('Please provide a valid URL for the book softcopy');
          return;
        }
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('bookName', formData.bookName.trim());
      submitData.append('edition', parseInt(formData.edition));
      submitData.append('description', formData.description.trim());
      
      // Add URL if provided
      if (formData.url.trim()) {
        submitData.append('url', formData.url.trim());
      }
      
      // Append images
      formData.bookImages.forEach((image) => {
        submitData.append('bookImages', image);
      });

      await booksApi.addBook(submitData);
      
      // Success - show toast and navigate back to profile
      toast.success('Book added successfully! It will be reviewed by admin.');
      navigate('/user/profile', { 
        state: { 
          activeTab: 'books' 
        } 
      });

    } catch (err) {
      console.error('Error adding book:', err);
      const errorMessage = err.message || 'Failed to add book. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Book</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Share your book with the BookBuddy community</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Name */}
            <div>
              <label htmlFor="bookName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Name *
              </label>
              <input
                type="text"
                id="bookName"
                name="bookName"
                value={formData.bookName}
                onChange={handleInputChange}
                placeholder="Enter the book name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>

            {/* Edition */}
            <div>
              <label htmlFor="edition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the book condition, content, or any additional information"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>

            {/* Book URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Softcopy URL (Optional)
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/... or any public link to digital copy"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Provide a link to the digital/softcopy version of the book (Google Drive, Dropbox, etc.)
              </p>
            </div>

            {/* Book Images */}
            <div>
              <label htmlFor="bookImages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Images (Optional, max 3)
              </label>
              <input
                type="file"
                id="bookImages"
                name="bookImages"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload clear images of your book. Accepted formats: JPG, PNG, GIF
              </p>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview Images</h4>
                <div className="grid grid-cols-3 gap-4">
                  {imagePreview.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Book...
                  </span>
                ) : (
                  'Add Book'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Note</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Your book will be reviewed by our admin team before being made available to other users. You'll be notified once it's approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
