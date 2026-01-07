import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../Components/utils.js'; 
import { LoadingSpinner } from '../Components/LoadingSpinner.jsx';
import { FilterBar } from '../Components/FilterBar.jsx';
import { PropertyCard } from '../Components/PropertyCard.jsx';


export const HomePage = ({ authContext }) => { 
  const [allListings, setAllListings] = useState([]);
 
  const [propertyStats, setPropertyStats] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Filter States
  const [maxPrice, setMaxPrice] = useState(50000000); // 5 Crore
  const [propertyType, setPropertyType] = useState('All');

  // Fetch properties on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch properties (public)
        const propResponse = await api.getProperties();
        if (!propResponse.success) throw new Error(propResponse.message || 'Failed to load properties');
        setAllListings(propResponse.data || []);

        // --- NEW: If user is admin, fetch property stats ---
        if (authContext.user && authContext.user.role === 'admin') {
          const statsResponse = await api.getAdminStats(authContext.token);
          if (statsResponse.success) {
            // This will now work
            setPropertyStats(statsResponse.data.propertyStats || {});
          }
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [authContext.user, authContext.token]); 
  const filteredListings = useMemo(() => {
   
    const listingsWithStats = (allListings || []).map(listing => ({
        ...listing,
        
        appointmentCount: (authContext.user && authContext.user.role === 'admin') 
                            ? (propertyStats[listing._id] || 0) 
                            : undefined 
    }));

    return listingsWithStats.filter(listing => {
      const priceMatch = listing.price <= maxPrice;
      const typeMatch = propertyType === 'All' || listing.type === propertyType;
      return priceMatch && typeMatch;
    });
  }, [allListings, maxPrice, propertyType, propertyStats, authContext.user]); // 'propertyStats' is now correctly defined

  const resetFilters = () => {
    setMaxPrice(50000000);
    setPropertyType('All');
  };

  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <FilterBar
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        resetFilters={resetFilters}
      />
      
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Listings</h2>

      {loading && <LoadingSpinner />}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg text-center">
          <p className="font-semibold">Failed to load properties.</p>
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && filteredListings.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-xl text-gray-600 font-semibold">
            {allListings.length === 0 ? "No properties are currently available." : "No properties match your filter criteria."}
          </p>
          <button onClick={resetFilters} className="mt-4 text-blue-600 underline hover:text-blue-800">Clear Filters</button>
        </div>
      )}
      
      {!loading && !error && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map(listing => (
            <PropertyCard 
              key={listing._id} 
              listing={listing}
              onClick={() => handleCardClick(listing._id)}
              
              appointmentCount={listing.appointmentCount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;