import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">BB</span>
            </div>
            <span className="text-2xl font-bold gradient-text">BookBuddy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg bg-white hover:bg-primary-50 transition-colors font-medium"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 border border-primary-600 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`font-medium ${isActive('/') ? 'text-primary-600' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`font-medium ${isActive('/about') ? 'text-primary-600' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/login" 
                className="font-medium text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="font-medium text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;