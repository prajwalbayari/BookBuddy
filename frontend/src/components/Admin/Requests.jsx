import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
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
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Pending Book Requests</h2>
        <p className="text-gray-600">Review and manage book submission requests</p>
      </div>
      
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
          <p className="text-gray-500">All book requests have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((book) => (
            <div key={book._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{book.bookName}</h3>
                      <p className="text-sm text-gray-600">Submitted by {book.requestedBy || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Pending Review
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex flex-col xl:flex-row gap-6">
                  {/* Book Image */}
                  <div className="flex-shrink-0 mx-auto xl:mx-0">
                    <div className="relative group">
                      {book.bookImages && book.bookImages.length > 0 ? (
                        <img
                          src={book.bookImages[0]}
                          alt={book.bookName}
                          className="w-32 h-44 sm:w-36 sm:h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200"
                        />
                      ) : (
                        <div className="w-32 h-44 sm:w-36 sm:h-48 flex items-center justify-center bg-blue-50 rounded-xl border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200">
                          <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200"></div>
                    </div>
                  </div>
                  
                  {/* Book Details */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Edition</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">
                            {book.edition ? `Edition ${book.edition}` : "N/A"}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Owner</span>
                          </div>
                          <p className="text-lg font-semibold text-blue-600">{book.requestedBy || 'Unknown'}</p>
                        </div>
                      </div>
                      
                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Description</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {book.description || "No description provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer with Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
  );
};

export default Requests;
