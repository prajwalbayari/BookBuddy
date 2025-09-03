
import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminApi.getUsersWithBooks();
        setUsers(res.data || []);
        // Flatten all books with owner info
        const allBooks = [];
        (res.data || []).forEach(user => {
          (user.books || []).forEach(book => {
            allBooks.push({
              ...book,
              ownerName: book.ownerName || user.userName,
              createdAt: book.createdAt,
            });
          });
        });
        // Sort by creation time ascending (oldest first)
        allBooks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setBooks(allBooks);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading statistics...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <svg className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 w-full max-w-none bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="max-w-8xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white mb-2">Statistics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">Overview of platform activity and approved books</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 lg:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs lg:text-sm font-medium">Total Users</p>
                <p className="text-2xl lg:text-3xl xl:text-4xl font-bold">{users.length}</p>
              </div>
              <div className="bg-blue-400 bg-opacity-50 rounded-lg p-3 lg:p-4">
                <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 lg:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs lg:text-sm font-medium">Approved Books</p>
                <p className="text-2xl lg:text-3xl xl:text-4xl font-bold">{books.length}</p>
              </div>
              <div className="bg-green-400 bg-opacity-50 rounded-lg p-3 lg:p-4">
                <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 lg:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs lg:text-sm font-medium">Avg Books/User</p>
                <p className="text-2xl lg:text-3xl xl:text-4xl font-bold">
                  {users.length > 0 ? (books.length / users.length).toFixed(1) : '0'}
                </p>
              </div>
              <div className="bg-orange-400 bg-opacity-50 rounded-lg p-3 lg:p-4">
                <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Books Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 lg:px-8 py-4 lg:py-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Book Inventory</h3>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">All approved books in the system</p>
          </div>
          
          <div className="overflow-x-auto">
            {books.length === 0 ? (
              <div className="text-center py-12 lg:py-16">
                <svg className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h4 className="text-base lg:text-lg font-medium text-gray-900 dark:text-white mb-2">No books yet</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">No approved books in the system yet.</p>
              </div>
            ) : (
              <div className="min-w-full">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                    <tr>
                      <th className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Book Name
                      </th>
                      <th className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Edition
                      </th>
                      <th className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-96">
                        Description
                      </th>
                      <th className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {books.map((book, idx) => (
                      <tr key={book.bookId || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{book.bookName}</div>
                        </td>
                        <td className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {book.edition ? `Edition ${book.edition}` : 'No Edition'}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{book.ownerName}</div>
                        </td>
                        <td className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 max-w-xs xl:max-w-md 2xl:max-w-lg">
                          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {book.description ? (
                              <p className="line-clamp-3 break-words">{book.description}</p>
                            ) : (
                              <span className="italic text-gray-400 dark:text-gray-500">No description available</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-semibold ${
                                book.available === 'Available' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700' :
                                book.available === 'Borrowed' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700' :
                                book.available === 'Requested' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700' :
                                book.available === 'Returned' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700' :
                                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                              }`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  book.available === 'Available' ? 'bg-green-500' :
                                  book.available === 'Borrowed' ? 'bg-red-500' :
                                  book.available === 'Requested' ? 'bg-yellow-500' :
                                  book.available === 'Returned' ? 'bg-blue-500' :
                                  'bg-gray-500'
                                }`}></div>
                                {book.available || 'Unknown'}
                              </span>
                            </div>
                            {book.available === 'Borrowed' && book.borrowerName && (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{book.borrowerName}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
