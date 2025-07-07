import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NotFound = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-2xl"></div>
      </div>

      {/* Floating books animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 opacity-10 animate-bounce">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div className="absolute top-3/4 right-1/4 opacity-10 animate-pulse">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/6 opacity-10 animate-bounce delay-300">
          <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className={`
        relative z-10 bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 
        flex flex-col items-center max-w-xl w-full mx-auto border border-white/20
        transform transition-all duration-1000 ease-out
        ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}>
        {/* 404 Number with animation */}
        <div className="relative mb-6">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
          <div className="absolute inset-0 text-6xl sm:text-7xl lg:text-8xl font-black text-gray-200 -z-10 transform translate-x-1 translate-y-1">
            404
          </div>
        </div>

        {/* Error illustration */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-xl">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          {/* Floating elements around the illustration */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        </div>

        {/* Text content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-2">
            Oops! Looks like this page went on a reading adventure and got lost in the library.
          </p>
          <p className="text-gray-500 text-sm sm:text-base">
            Don't worry, we'll help you find your way back to the books!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to="/"
            className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:scale-105 transform flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Go Back</span>
          </button>
        </div>

        {/* Additional help text */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Lost? Try searching for books or{' '}
            <Link to="/about" className="text-blue-600 hover:text-blue-700 underline transition-colors">
              learn more about BookBuddy
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-20">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
