import React from 'react';
import Card from '../../Card';

const BookCard = ({ 
  book, 
  onViewBook, 
  className = "",
  showFullDescription = false,
  imageHeight = "h-48"
}) => {
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Requested':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Borrowed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'Returned':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Determine if this is for BookSection (has group class)
  const isBookSection = className.includes('group');

  return (
    <Card className={`h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800 border dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}>
      <div className={`relative ${imageHeight} mb-4 ${isBookSection ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700'} rounded-lg overflow-hidden`}>
        {book.bookImages && book.bookImages.length > 0 ? (
          <img 
            src={book.bookImages[0]} 
            alt={book.bookName} 
            className={`w-full h-full object-cover ${isBookSection ? 'group-hover:scale-105 transition-transform duration-500' : ''}`}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${isBookSection ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        {/* Overlay for BookSection */}
        {isBookSection && (
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        <span className={`absolute ${isBookSection ? 'top-3 right-3' : 'top-2 right-2'} px-${isBookSection ? '3' : '2'} py-1 text-xs font-${isBookSection ? 'semibold' : 'medium'} rounded-${isBookSection ? 'xl' : 'full'} ${isBookSection ? 'backdrop-blur-sm border border-white/30' : ''} ${getAvailabilityColor(book.available)}`}>
          {book.available}
        </span>
      </div>
      <div className="flex-1 flex flex-col p-1">
        <h3 className={`font-${isBookSection ? 'bold' : 'semibold'} text-lg mb-2 text-gray-800 dark:text-white line-clamp-1 ${isBookSection ? 'group-hover:text-primary-600 dark:group-hover:text-blue-400 transition-colors duration-200' : ''}`}>
          {book.bookName}
        </h3>
        <p className={`text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed ${showFullDescription ? '' : isBookSection ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {book.description}
        </p>
        <div className="mt-auto flex justify-between items-center pt-2">
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Edition</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{book.edition || 'N/A'}</p>
          </div>
          <button 
            onClick={() => onViewBook(book)}
            className={`px-${isBookSection ? '6' : '4'} py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${isBookSection ? 'shadow-sm hover:shadow-md' : ''} text-sm font-${isBookSection ? 'semibold' : 'medium'}`}
          >
            {isBookSection ? <span>View</span> : 'View'}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;
