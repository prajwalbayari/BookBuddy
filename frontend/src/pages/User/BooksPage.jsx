import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BookSection from '../../components/User/Home/BookSection';

const BooksPage = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's a hash in the URL and scroll to that element
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        // Add a small delay to ensure the element is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // If no hash, scroll to top of page
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 xl:py-12">
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-8 xl:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
            Book Library
          </h1>
          <p className="text-base sm:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-2xl xl:max-w-4xl mx-auto px-4">
            Discover, connect, and share amazing books with our community of passionate readers
          </p>
        </div>
        
        <BookSection />
      </div>
    </div>
  );
};

export default BooksPage;
