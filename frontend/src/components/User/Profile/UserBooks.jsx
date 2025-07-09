import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserBooks = ({ books, onRefresh }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const handleRefresh = async () => {
    try {
      await onRefresh();
      toast.success('Books refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh books');
    }
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
          <h3 className="text-xl font-medium text-gray-900 mb-3">No books yet</h3>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Start building your book collection by adding your first book. Share your favorite reads with the community!
          </p>
          <button 
            onClick={() => navigate('/user/books/add')}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Your First Book</span>
          </button>
        </div>
      </div>
    );
  }

  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'title':
        return a.bookName.localeCompare(b.bookName);
      default:
        return 0;
    }
  });

  const filteredBooks = sortedBooks.filter(book => {
    // Filter by availability
    if (filterBy === 'available' && book.available !== 'Available') return false;
    if (filterBy === 'unavailable' && book.available === 'Available') return false;
    
    // Filter by status
    if (statusFilter === 'pending' && book.status !== 'Pending') return false;
    if (statusFilter === 'approved' && book.status !== 'Approved') return false;
    if (statusFilter === 'rejected' && book.status !== 'Rejected') return false;
    
    return true;
  });

  const BookCard = ({ book }) => (
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
            {/* Title and Edit Button */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-semibold text-gray-900 break-words">
                  {book.bookName}
                </h4>
                {book.edition && (
                  <p className="text-sm text-gray-600 mt-1">Edition: {book.edition}</p>
                )}
              </div>
              <button
                onClick={() => navigate(`/user/books/edit/${book._id}`)}
                className="sm:ml-3 inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>

            {/* Description */}
            {book.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                {book.description}
              </p>
            )}

            {/* Status Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                book.available === 'Available'
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {book.available || 'Unknown'}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                book.status === 'Approved' 
                  ? 'bg-blue-100 text-blue-800'
                  : book.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {book.status || 'Unknown'}
              </span>
            </div>

            {/* Date */}
            <div className="text-xs text-gray-500">
              Added {new Date(book.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="space-y-4">
          {/* Top Row: Title and Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">My Books</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredBooks.length} of {books.length} books
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => navigate('/user/books/add')}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Book</span>
              </button>
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

          {/* Filters and Sort Section */}
          <div className="pt-4 border-t border-gray-100">
            <div className="space-y-4">
              {/* Section Title */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Filter & Sort Options</h4>
              </div>
              
              {/* Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <select
                    id="filter"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  >
                    <option value="all">All Books</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Not Available</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
                    Approval Status
                  </label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                    Sort Order
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>
              
              {/* Active Filters Summary */}
              {(filterBy !== 'all' || statusFilter !== 'all' || sortBy !== 'newest') && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-gray-500">Active filters:</span>
                  {filterBy !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      {filterBy === 'available' ? 'Available' : 'Not Available'}
                      <button
                        onClick={() => setFilterBy('all')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                      {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {sortBy !== 'newest' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                      {sortBy === 'oldest' ? 'Oldest First' : 'Title A-Z'}
                      <button
                        onClick={() => setSortBy('newest')}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setFilterBy('all');
                      setStatusFilter('all');
                      setSortBy('newest');
                    }}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && books.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">No books match your filters</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Try adjusting your filters to see more results, or clear all filters to view your entire collection.
            </p>
            <button
              onClick={() => {
                setFilterBy('all');
                setStatusFilter('all');
                setSortBy('newest');
                toast.success('Filters cleared successfully!');
              }}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBooks;
