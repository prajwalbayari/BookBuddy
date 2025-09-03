import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import { sanitizeUrl, isValidUrl } from "../../utils/urlUtils";
import { toast } from "react-hot-toast";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // bookId for which action is happening

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllRequests();
      setRequests(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (bookId) => {
    setActionLoading(bookId);
    try {
      await adminApi.approveBook(bookId);
      setRequests((prev) => prev.filter((b) => b._id !== bookId));
      toast.success("Book approved successfully");
    } catch (err) {
      const msg = Array.isArray(err?.response?.data?.message)
        ? err.response.data.message[0]
        : err?.response?.data?.message || "Failed to approve";
      toast.error(msg, { duration: 4000 });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookId) => {
    setActionLoading(bookId);
    try {
      await adminApi.rejectBook(bookId);
      setRequests((prev) => prev.filter((b) => b._id !== bookId));
      toast.success("Book rejected successfully");
    } catch (err) {
      const msg = Array.isArray(err?.response?.data?.message)
        ? err.response.data.message[0]
        : err?.response?.data?.message || "Failed to reject";
      toast.error(msg, { duration: 4000 });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 w-full max-w-none">
      <div className="max-w-8xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2">Pending Book Requests</h2>
          <p className="text-gray-600 text-sm lg:text-base">Review and manage book submission requests</p>
        </div>
        
        {requests.length === 0 ? (
          <div className="text-center py-12 lg:py-16">
            <svg className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
            <p className="text-sm text-gray-500">All book requests have been processed.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:gap-8">
            {requests.map((book) => (
              <div key={book._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 lg:px-8 py-4 lg:py-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-2 lg:p-3">
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-900">{book.bookName}</h3>
                        <p className="text-xs lg:text-sm text-gray-600">Submitted by {book.requestedBy || 'Unknown'}</p>
                        {book.url && isValidUrl(book.url) ? (
                          <a
                            href={sanitizeUrl(book.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium mt-1"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Digital Copy
                          </a>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">
                            Softcopy not available
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Pending Review
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 lg:p-8">
                  {/* Desktop Layout (admin breakpoint and up): Image left, details right */}
                  <div className="hidden admin:flex gap-6 lg:gap-8">
                    {/* Book Image - Left Side */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        {book.bookImages && book.bookImages.length > 0 ? (
                          <img
                            src={book.bookImages[0]}
                            alt={book.bookName}
                            className="w-44 h-56 lg:w-48 lg:h-60 object-cover rounded-xl border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200"
                          />
                        ) : (
                          <div className="w-44 h-56 lg:w-48 lg:h-60 flex items-center justify-center bg-blue-50 rounded-xl border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200">
                            <svg className="w-16 h-16 lg:w-20 lg:h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200"></div>
                      </div>
                    </div>
                    
                    {/* Book Details - Right Side */}
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Left Column */}
                        <div className="space-y-4 lg:space-y-6">
                          <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                            <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide">Edition</span>
                            </div>
                            <p className="text-base lg:text-lg xl:text-xl font-semibold text-gray-900">
                              {book.edition ? `Edition ${book.edition}` : "N/A"}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                            <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide">Owner</span>
                            </div>
                            <p className="text-base lg:text-lg xl:text-xl font-semibold text-blue-600 break-words">{book.requestedBy || 'Unknown'}</p>
                          </div>

                          {/* Digital Copy URL */}
                          <div className={`rounded-lg p-4 lg:p-6 ${book.url && isValidUrl(book.url) ? 'bg-blue-50' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                              <svg className={`w-4 h-4 ${book.url && isValidUrl(book.url) ? 'text-blue-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {book.url && isValidUrl(book.url) ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                )}
                              </svg>
                              <span className={`text-xs lg:text-sm font-medium uppercase tracking-wide ${book.url && isValidUrl(book.url) ? 'text-blue-600' : 'text-gray-600'}`}>
                                Digital Copy
                              </span>
                            </div>
                            {book.url && isValidUrl(book.url) ? (
                              <a
                                href={sanitizeUrl(book.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium break-all"
                              >
                                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Softcopy
                              </a>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Softcopy not available
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="space-y-4 lg:space-y-6">
                          <div className="bg-gray-50 rounded-lg p-4 lg:p-6 h-full">
                            <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                              </svg>
                              <span className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide">Description</span>
                            </div>
                            <div className="text-xs lg:text-sm xl:text-base text-gray-700 leading-relaxed break-words">
                              {book.description || "No description provided."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile/Tablet Layout (below admin breakpoint): Current card structure */}
                  <div className="admin:hidden">
                    <div className="flex flex-col 2xl:flex-row gap-6 lg:gap-8">
                      {/* Book Image */}
                      <div className="flex-shrink-0 mx-auto 2xl:mx-0">
                        <div className="relative group">
                          {book.bookImages && book.bookImages.length > 0 ? (
                            <img
                              src={book.bookImages[0]}
                              alt={book.bookName}
                              className="w-36 h-48 sm:w-40 sm:h-52 lg:w-44 lg:h-56 xl:w-48 xl:h-60 object-cover rounded-xl border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200"
                            />
                          ) : (
                            <div className="w-36 h-48 sm:w-40 sm:h-52 lg:w-44 lg:h-56 xl:w-48 xl:h-60 flex items-center justify-center bg-blue-50 rounded-xl border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200">
                              <svg className="w-16 h-16 lg:w-20 lg:h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200"></div>
                        </div>
                      </div>
                      
                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8">
                          {/* Left Column */}
                          <div className="space-y-4 lg:space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                              <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide">Edition</span>
                              </div>
                              <p className="text-base lg:text-lg xl:text-xl font-semibold text-gray-900">
                                {book.edition ? `Edition ${book.edition}` : "N/A"}
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                              <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide">Owner</span>
                              </div>
                              <p className="text-base lg:text-lg xl:text-xl font-semibold text-blue-600 break-words">{book.requestedBy || 'Unknown'}</p>
                            </div>
                          </div>
                          
                          {/* Right Column */}
                          <div className="space-y-4 lg:space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4 lg:p-6 h-full">
                              <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                <span className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide">Description</span>
                              </div>
                              <div className="text-xs lg:text-sm xl:text-base text-gray-700 leading-relaxed break-words">
                                {book.description || "No description provided."}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Actions */}
                <div className="bg-gray-50 px-6 lg:px-8 py-4 lg:py-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 sm:justify-end">
                    <button
                      className="flex items-center justify-center px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-xs lg:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      onClick={() => handleReject(book._id)}
                      disabled={actionLoading === book._id}
                    >
                      {actionLoading === book._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject Request
                        </>
                      )}
                    </button>
                    <button
                      className="flex items-center justify-center px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-xs lg:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      onClick={() => handleApprove(book._id)}
                      disabled={actionLoading === book._id}
                    >
                      {actionLoading === book._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Approving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
