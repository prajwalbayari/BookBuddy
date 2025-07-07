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
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  if (error)
    return <div className="text-red-600 text-center mt-4">{error}</div>;

  return (
    <div className="p-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Pending Book Requests</h2>
      {requests.length === 0 ? (
        <div className="text-gray-500">No pending requests.</div>
      ) : (
        <ul className="space-y-4">
          {requests.map((book) => (
            <li key={book._id} className="bg-gray-50 rounded-lg p-4 shadow">
              <div className="flex items-center space-x-6">
                <img
                  src={book.bookImages?.[0] || "/no-image.png"}
                  alt={book.bookName}
                  className="w-24 h-32 object-cover rounded border flex-shrink-0"
                />
                <div className="flex flex-col space-y-2">
                  <div>
                    <span className="font-semibold">Name:</span> {book.bookName}
                  </div>
                  <div>
                    <span className="font-semibold">Edition:</span>{" "}
                    {book.edition || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Description:</span>{" "}
                    {book.description || "No description."}
                  </div>
                  <div>
                    <span className="font-semibold">Requested By:</span> {book.requestedBy || 'Unknown'}
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mt-4">
                <button
                  className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 text-sm"
                  onClick={() => handleApprove(book._id)}
                  disabled={actionLoading === book._id}
                >
                  Approve
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
                  onClick={() => handleReject(book._id)}
                  disabled={actionLoading === book._id}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Requests;
