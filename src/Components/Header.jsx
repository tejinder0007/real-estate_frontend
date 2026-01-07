import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Header Component - Responsive Dark Design
 */
export const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  // 1. State for Mobile Menu Toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false); // Close menu on logout
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO SECTION --- */}
          <Link to="/" className="flex items-center text-2xl font-bold cursor-pointer">
            <img 
              src="/vite.svg" 
              alt="Teji Property Dealer Logo"
              className="h-8 w-8 mr-2 object-contain" 
            />
            <span className="text-xl sm:text-3xl font-bold text-white truncate">
              Teji Property Dealer
            </span>
          </Link>
          
          {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                Home
              </Link>
            )}
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                    Admin
                  </Link>
                )}
                <span className="text-gray-300 text-sm font-medium px-2">
                  Hi, {user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* --- MOBILE HAMBURGER BUTTON (Visible only on Mobile) --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
            >
              {isMenuOpen ? (
                // Close Icon (X)
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon (Three lines)
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            {user && (
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </Link>
            )}

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="px-3 py-2 text-gray-400 text-sm italic border-b border-gray-700 mb-2">
                  Logged in as: {user.email}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium mt-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;