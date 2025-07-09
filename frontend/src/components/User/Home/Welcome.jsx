import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../Button';

const Welcome = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-block relative">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <svg className="w-12 h-12 lg:w-16 lg:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-xl">✨</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, {user?.name || 'Reader'}!
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl">
            Your personal library awaits. Discover new books, share your collection, 
            and connect with fellow book enthusiasts in our vibrant community.
          </p>
          
          <Link to="/user/books">
            <Button 
              className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Explore Books
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
