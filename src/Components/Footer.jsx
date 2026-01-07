import React from 'react';

/**
 * Footer Component
 */
export const Footer = () => (
  <footer className="bg-gray-800 text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
      <p>&copy; {new Date().getFullYear()} Teji Property Dealer. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
