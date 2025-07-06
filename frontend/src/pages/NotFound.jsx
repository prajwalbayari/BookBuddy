import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-primary-300 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 flex flex-col items-center">
        <h1 className="text-7xl font-extrabold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700 transition-colors"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
