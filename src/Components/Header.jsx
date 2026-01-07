import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Header Component - NEW Dark Design
 */
export const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login'); // Redirect to login on logout
  };

  return (
    // --- UPDATED: Dark background, white text ---
    <header className="bg-gray-900 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center text-2xl font-bold cursor-pointer">
            <img 
              src="/vite.svg" 
              alt="Teji Property Dealer Logo"
              className="h-8 w-8 mr-2 object-contain" 
            />
            {/* --- UPDATED: Title is white --- */}
            <span className="text-3xl font-bold text-white">
              Teji Property Dealer
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link 
                to="/"
                // --- UPDATED: Light text for dark bg ---
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
            )}
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    // --- UPDATED: Light text for dark bg ---
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                {/* --- UPDATED: Light text for dark bg --- */}
                <span className="text-gray-300 text-sm font-medium">Hi, {user.email.split('@')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  // --- UPDATED: Light text for dark bg ---
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  // --- Reverted to blue button ---
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;