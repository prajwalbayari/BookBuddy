
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
              ownerName: user.userName,
              createdAt: book.createdAt,
            });
          });
        });
        // Sort by creation time descending (most recent first)
        allBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBooks(allBooks);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-600 text-center mt-4">{error}</div>;

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Statistics</h2>
      <div className="flex gap-8 mb-8">
        <div className="bg-blue-100 rounded-lg px-6 py-4 text-center flex-1">
          <div className="text-3xl font-bold">{users.length}</div>
          <div className="text-gray-600">Users</div>
        </div>
        <div className="bg-green-100 rounded-lg px-6 py-4 text-center flex-1">
          <div className="text-3xl font-bold">{books.length}</div>
          <div className="text-gray-600">Books</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {books.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No books yet</div>
        ) : (
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Book Name</th>
                <th className="py-2 px-4 border-b text-left">Edition</th>
                <th className="py-2 px-4 border-b text-left">Owner</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, idx) => (
                <tr key={book.bookId || idx} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{book.bookName}</td>
                  <td className="py-2 px-4 border-b">{book.edition}</td>
                  <td className="py-2 px-4 border-b">{book.ownerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Statistics;
