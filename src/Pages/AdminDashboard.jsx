import React, { useState, useEffect } from 'react';
// --- FIX: Corrected import paths to be relative and match your filenames ---
import { api, formatCurrency } from '../Components/utils.js';
import { LoadingSpinner } from '../Components/LoadingSpinner.jsx'; // Corrected case

// --- UPDATED: Stat Card Component ---
const StatCard = ({ title, value, icon }) => (
  // --- UPDATED: Changed colors to green accent ---
  <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-green-100 text-green-700 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// --- SVG Icons for Stats ---
const UsersIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>);
const BookingsIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>);
const RevenueIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3l3-3h-1a3 3 0 110-6z"></path></svg>);
const SuccessIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>);


// --- UPDATED: AddPropertyForm Component ---
const AddPropertyForm = ({ onPropertyAdded, token }) => {
  const [formData, setFormData] = useState({
    location: '', price: '', description: '', bedrooms: '', bathrooms: '',
    type: 'House', imageUrl: '', area: '', status: 'Ready to Move',
    facing: 'East', amenities: '', galleryImages: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean),
        galleryImages: formData.galleryImages.split(',').map(item => item.trim()).filter(Boolean)
      };
      const response = await api.createProperty(propertyData, token);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create property');
      }
      setSuccess(`Property "${response.data.location}" created successfully!`);
      onPropertyAdded(response.data); 
      e.target.reset(); 
      setFormData({ 
        location: '', price: '', description: '', bedrooms: '', bathrooms: '',
        type: 'House', imageUrl: '', area: '', status: 'Ready to Move',
        facing: 'East', amenities: '', galleryImages: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
      <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Add New Property</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" name="location" placeholder="Location (e.g., Modern Apartment, Amritsar)" onChange={handleChange} required className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
        <input type="text" name="imageUrl" placeholder="Main Image URL" onChange={handleChange} required className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
        <textarea name="description" placeholder="Description" onChange={handleChange} required className="md:col-span-2 p-3 border border-gray-300 rounded-lg h-24 focus:ring-green-500 focus:border-green-500" />
        <input type="number" name="price" placeholder="Price (e.g., 8000000)" onChange={handleChange} required className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
        <input type="number" name="area" placeholder="Area (sq.ft.)" onChange={handleChange} required className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
        <input type="number" name="bedrooms" placeholder="Bedrooms" onChange={handleChange} required className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
        <input type="number" name="bathrooms" placeholder="Bathrooms" onChange={handleChange} required className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
        
        <select name="type" onChange={handleChange} value={formData.type} className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500">
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Kothi">Kothi</option>
          <option value="Plot">Plot</option>
        </select>
        <select name="status" onChange={handleChange} value={formData.status} className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500">
          <option value="Ready to Move">Ready to Move</option>
          <option value="Under Construction">Under Construction</option>
        </select>
        <select name="facing" onChange={handleChange} value={formData.facing} className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500">
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
          <option value="North-East">North-East</option>
          <option value="North-West">North-West</option>
          <option value="South-East">South-East</option>
          <option value="South-West">South-West</option>
        </select>
        
        <input type="text" name="amenities" placeholder="Amenities (comma-separated)" onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
        <input type="text" name="galleryImages" placeholder="Gallery Image URLs (comma-separated)" onChange={handleChange} className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
        
        {/* --- UPDATED: Button Color --- */}
        <button type="submit" disabled={loading} className="md:col-span-2 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400">
          {loading ? 'Adding Property...' : 'Add Property'}
        </button>
      </form>
    </div>
  );
};


/**
 * Admin Dashboard Page
 */
export const AdminDashboard = ({ authContext }) => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]); 
  const [stats, setStats] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null); 
  const [deleteSuccess, setDeleteSuccess] = useState(null); 
  const { token } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [apptResponse, usersResponse, statsResponse, propResponse] = await Promise.all([
          api.getAppointments(token),
          api.getUsers(token),
          api.getAdminStats(token),
          api.getProperties() 
        ]);
        if (!apptResponse.success) throw new Error(`Appointments: ${apptResponse.message}`);
        if (!usersResponse.success) throw new Error(`Users: ${usersResponse.message}`);
        if (!statsResponse.success) throw new Error(`Stats: ${statsResponse.message}`);
        if (!propResponse.success) throw new Error(`Properties: ${propResponse.message}`);
        setAppointments(apptResponse.data || []);
        setUsers(usersResponse.data || []);
        setStats(statsResponse.data.dashboardStats);
        setProperties(propResponse.data || []); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handlePropertyAdded = (newProperty) => {
    setProperties([newProperty, ...properties]);
  };

  const handleDeleteProperty = async (propertyId) => {
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      const response = await api.deleteProperty(propertyId, token);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete property');
      }
      setDeleteSuccess(response.message);
      setProperties(properties.filter(p => p._id !== propertyId));
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* --- UPDATED: Serif Font --- */}
      <h1 className="font-serif text-5xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg text-center mb-6">
          <p className="font-semibold">Failed to load data.</p>
          <p>Error: {error}</p>
        </div>
      )}

      {/* --- Stats Overview Section --- */}
      {stats && (
        <div className="mb-10">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Stats Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Revenue" 
              value={formatCurrency(stats.totalRevenue)} 
              icon={<RevenueIcon />}
            />
            <StatCard 
              title="Total Users" 
              value={stats.totalUsers} 
              icon={<UsersIcon />}
            />
            <StatCard 
              title="Total Bookings" 
              value={stats.totalAppointments} 
              icon={<BookingsIcon />}
            />
            <StatCard 
              title="Successful Bookings" 
              value={stats.successfulAppointments} 
              icon={<SuccessIcon />}
            />
          </div>
        </div>
      )}

      {/* --- Add Property Form --- */}
      <AddPropertyForm onPropertyAdded={handlePropertyAdded} token={token} />

      {/* --- Manage Properties Section --- */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Manage Properties ({properties.length})</h2>
        {deleteError && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{deleteError}</div>}
        {deleteSuccess && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{deleteSuccess}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-gray-500">No properties found.</td></tr>
              ) : (
                properties.map(prop => (
                  <tr key={prop._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prop.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(prop.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prop.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteProperty(prop._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Appointments Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">All Appointments ({appointments.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-500">No appointments found.</td></tr>
              ) : (
                appointments.map(appt => (
                  <tr key={appt._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.property?.location || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.user?.email || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(appt.date).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{appt.fee.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.paymentMethod || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" 
                        style={{ color: appt.paymentStatus === 'Completed' ? '#166534' : (appt.paymentStatus === 'Failed' ? '#991B1B' : '#B45309') }}>
                        {appt.paymentStatus || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Users Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">All Users ({users.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-4 text-gray-500">No users found.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowVrap text-sm text-gray-500">{u.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u._id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;