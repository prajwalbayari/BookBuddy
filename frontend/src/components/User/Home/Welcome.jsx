import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../Button';

const Welcome = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 lg:w-16 lg:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white">
              Welcome Back, {user?.userName || 'Reader'}!
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
              Your personal library awaits. Discover new books, share your collection, 
              and connect with fellow book enthusiasts in our vibrant community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link to="/user/books">
                <Button className="px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm">
                  Explore Books
                </Button>
              </Link>
              
              <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-500 dark:bg-blue-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                  <div className="w-8 h-8 bg-purple-500 dark:bg-purple-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                  <div className="w-8 h-8 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <span className="text-sm font-medium">Join thousands of readers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
