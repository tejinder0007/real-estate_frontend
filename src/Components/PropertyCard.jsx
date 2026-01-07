import React from 'react';
// --- FIX: Corrected import path to match case ---
import { formatCurrency } from './utils.js'; 

/**
 * Property Card Component - Redesigned
 */
export const PropertyCard = ({ listing, onClick, appointmentCount }) => {
  const truncatedDesc = (listing.description || '').length > 100 
    ? listing.description.substring(0, 100) + '...' 
    : listing.description;

  return (
    <div 
      // --- UPDATED: Added transition and hover effects ---
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          className="w-full h-56 object-cover" 
          src={listing.imageUrl} 
          alt={listing.location} 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}
        />
        {listing.status && (
            <span className="absolute top-4 left-4 bg-gray-900/70 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase z-10">
                {listing.status}
            </span>
        )}
        {appointmentCount !== undefined && (
          <span 
            className="absolute top-4 right-4 bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-10 flex items-center"
            title={`${appointmentCount} successful bookings`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
            {appointmentCount}
          </span>
        )}
      </div>
      <div className="p-6">
        {/* --- UPDATED: Using serif font for the main heading --- */}
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2 truncate" title={listing.location}>{listing.location}</h3>
        {/* --- UPDATED: Using new accent color for price --- */}
        <p className="text-3xl font-extrabold text-green-800 mb-4">{formatCurrency(listing.price)}</p>
        
        <div className="flex justify-between text-gray-600 mb-4 border-b pb-4">
          <span className="flex items-center text-sm">
            {/* --- UPDATED: Changed icon color --- */}
            <svg className="w-5 h-5 mr-1 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10V5a2 2 0 114 0v5h4a2 2 0 110 4h-4v5a2 2 0 11-4 0v-5H4a2 2 0 110-4h4z" /></svg>
            {listing.bedrooms} Beds
          </span>
          <span className="flex items-center text-sm">
            <svg className="w-5 h-5 mr-1 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {listing.bathrooms} Baths
          </span>
          {listing.area && (
            <span className="flex items-center text-sm">
                <svg className="w-5 h-5 mr-1 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
                {listing.area} sq.ft.
            </span>
          )}
        </div>
        <p className="text-gray-700 text-sm h-10">{truncatedDesc}</p>
      </div>
    </div>
  );
};

export default PropertyCard;