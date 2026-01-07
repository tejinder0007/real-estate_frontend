import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// --- FIX: Using absolute paths from /src/ ---
import { LoadingSpinner } from '/src/Components/LoadingSpinner.jsx';
import { Modal } from '/src/Components/Modal.jsx';
import { api, APPOINTMENT_FEE, PAYMENT_METHODS, formatCurrency } from '/src/Components/utils.js';
import { useScript } from '/src/Components/hooks.js';


const BedIcon = () => (
    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10V5a2 2 0 114 0v5h4a2 2 0 110 4h-4v5a2 2 0 11-4 0v-5H4a2 2 0 110-4h4z" /></svg>
);
const BathIcon = () => (
    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const AreaIcon = () => (
    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
);
const FacingIcon = () => (
    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
);
const StatusIcon = () => (
    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);
const AmenityIcon = () => (
    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);


// --- Main Page Component ---
export const PropertyDetailPage = ({ authContext }) => {
  const { id: propertyId } = useParams();
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = authContext;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false });
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

  useScript('https://checkout.razorpay.com/v1/checkout.js');

  useEffect(() => {
    if (!propertyId) {
      setError('No property selected.');
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getPropertyById(propertyId);
        if (!response.success) throw new Error(response.message);
        setProperty(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  // --- Payment Handler ---
  const handleBookAppointment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setBookingLoading(true); 

    try {
      const data = await api.bookAppointment(property._id, paymentMethod, token);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create appointment.');
      }

      // Handle "Pay on Visit" success
      if (data.isPayOnVisit) { 
        setBookingLoading(false);
        setModal({
          show: true,
          title: 'Appointment Booked!',
          message: `Your appointment is confirmed for "Pay on Visit". Our team will contact you shortly.`,
          isError: false,
        });
        return;
      }

      // --- Start Razorpay Flow ---
      const { 
        razorpayKeyId, 
        razorpayOrderId, 
        amount, 
        currency, 
        userName, 
        userEmail,
        appointmentId 
      } = data.data;

      const options = {
        key: razorpayKeyId,
        amount: amount, 
        currency: currency,
        name: "Teji Property Dealer",
        description: `Booking for ${property.location}`,
        image: "https://placehold.co/100x100/6366F1/FFFFFF?text=TPD",
        order_id: razorpayOrderId, 
        handler: async (response) => {
          setBookingLoading(true);
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId: appointmentId, 
            };
            
            const verifyRes = await api.verifyPayment(verificationData, token);

            if (verifyRes.success) {
              setModal({
                show: true,
                title: 'Appointment Booked!',
                message: `Your appointment is confirmed. Payment successful. Our team will contact you shortly.`,
                isError: false,
              });
            } else {
              throw new Error(verifyRes.message || "Payment verification failed.");
            }
          } catch (err) {
            setModal({ show: true, title: 'Booking Failed', message: `Payment was successful, but verification failed: ${err.message}`, isError: true });
          } finally {
            setBookingLoading(false);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#3B82F6" 
        },
        modal: {
            ondismiss: () => {
                setBookingLoading(false); 
            }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', (response) => {
        console.error('Razorpay payment failed:', response);
        setModal({
          show: true,
          title: 'Payment Failed',
          message: `Payment failed: ${response.error.description || 'Please try again.'}`,
          isError: true,
        });
        setBookingLoading(false);
      });

    } catch (err) {
      setModal({
        show: true,
        title: 'Booking Failed',
        message: err.message,
        isError: true,
      });
      setBookingLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ show: false, title: '', message: '', isError: false });
    if (!modal.isError) {
      navigate('/'); // Go to home after successful booking
    }
  };

  if (loading || authLoading) return <LoadingSpinner />;
  
  if (error) return (
    <div className="max-w-7xl mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold text-red-600">Error</h2>
      <p className="text-gray-700">{error}</p>
      <button onClick={() => navigate(-1)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">Back to Home</button>
    </div>
  );
  
  if (!property) return null; 

  return (
    <>
      {modal.show && <Modal title={modal.title} message={modal.message} isError={modal.isError} onClose={closeModal} />}
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:underline">
          &larr; Back to Listings
        </button>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{property.location}</h1>
          <p className="text-4xl font-bold text-blue-600">{formatCurrency(property.price)}</p>
        </div>

        <div className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className="sm:col-span-2 md:col-span-3 rounded-lg overflow-hidden shadow-lg border-4 border-white">
              <img 
                src={property.imageUrl} 
                alt="Main property view" 
                className="w-full h-[500px] object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x500/cccccc/ffffff?text=Image+Not+Found'; }}
              />
            </div>

            {property.galleryImages && property.galleryImages.length > 0 ? (
              property.galleryImages.map((imgUrl, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md border-2 border-white">
                  <img 
                    src={imgUrl} 
                    alt={`Gallery view ${index + 1}`} 
                    className="w-full h-64 object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 sm:col-span-2 md:col-span-3 p-4 bg-gray-50 rounded-lg">
                No additional gallery images available for this property.
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div className="flex items-center">
                        <BedIcon />
                        <div>
                            <span className="text-sm text-gray-500">Bedrooms</span>
                            <p className="text-lg font-semibold text-gray-900">{property.bedrooms}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <BathIcon />
                        <div>
                            <span className="text-sm text-gray-500">Bathrooms</span>
                            <p className="text-lg font-semibold text-gray-900">{property.bathrooms}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <AreaIcon />
                        <div>
                            <span className="text-sm text-gray-500">Area</span>
                            <p className="text-lg font-semibold text-gray-900">{property.area} sq.ft.</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <StatusIcon />
                        <div>
                            <span className="text-sm text-gray-500">Status</span>
                            <p className="text-lg font-semibold text-gray-900">{property.status}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <FacingIcon />
                        <div>
                            <span className="text-sm text-gray-500">Facing</span>
                            <p className="text-lg font-semibold text-gray-900">{property.facing}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Description</h2>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {property.description}
                </p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Amenities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {property.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center">
                                <AmenityIcon />
                                <span className="text-gray-700 text-lg">{amenity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {/* --- NEW: Right Column (Booking) --- */}
          <div className="lg:col-span-1">
            {/* --- NEW: Only show booking form if user is NOT an admin --- */}
            {user && user.role !== 'admin' && (
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-28">
                <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">Book a Viewing</h3>
                
                <div className="mb-6">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">Select Payment:</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        {PAYMENT_METHODS.map(method => (
                            <option key={method} value={method}>{method}</option>
                        ))}
                    </select>
                </div>

                <p className="text-gray-700 my-4 text-center">
                  Secure your appointment for a one-time fee of 
                  <span className="font-bold text-xl block mt-1"> ₹{APPOINTMENT_FEE.toLocaleString('en-IN')}</span>.
                </p>
                <button
                  onClick={handleBookAppointment}
                  disabled={bookingLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all disabled:bg-gray-400"
                >
                  {bookingLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span> : 'Book Appointment Now'}
                </button>
              </div>
            )}
            
            {/* --- NEW: Show this box if user IS an admin --- */}
            {user && user.role === 'admin' && (
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-28 text-center">
                 <h3 className="text-2xl font-bold text-gray-800 mb-4">Admin View</h3>
                 <p className="text-gray-600">You are viewing this page as an admin. Booking is disabled.</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </>
  );
};

export default PropertyDetailPage;