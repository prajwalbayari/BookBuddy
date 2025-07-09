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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BookSection />
      </div>
    </div>
  );
};

export default BooksPage;
