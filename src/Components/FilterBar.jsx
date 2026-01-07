import React, { useMemo } from 'react';
// --- FIX: Updated import path ---
import { formatCurrency } from './utils.js';

/**
 * Filter Bar Component
 */
export const FilterBar = ({ maxPrice, setMaxPrice, propertyType, setPropertyType, resetFilters }) => {
  const priceDisplay = useMemo(() => {
    return formatCurrency(maxPrice);
  }, [maxPrice]);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <h3 className="text-xl font-semibold text-gray-800 col-span-1 md:col-span-4">Filter Properties</h3>
        
        <div className="md:col-span-2">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Max Price: <span className="font-bold text-blue-600">{priceDisplay}</span>
          </label>
          <input
            type="range"
            id="price"
            min="500000"
            max="50000000"
            step="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="md:col-span-1">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Property Type
          </label>
          <select
            id="type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option>All</option>
            <option>House</option>
            <option>Apartment</option>
            <option>Kothi</option>
            <option>Plot</option>
          </select>
        </div>
        
        <div className="md:col-span-1 flex items-end justify-end">
          <button
            onClick={resetFilters}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

