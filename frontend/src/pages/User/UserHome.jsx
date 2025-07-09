import React from 'react';
import { Link } from 'react-router-dom';
import Welcome from '../../components/User/Home/Welcome';
import BookCarousel from '../../components/User/Home/BookCarousel';

const UserHome = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Welcome Section */}
        <Welcome />
        
        {/* Book Carousel */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <BookCarousel />
          <div className="text-center mt-8">
            <Link 
              to="/user/books#books-section"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              View All Books
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
