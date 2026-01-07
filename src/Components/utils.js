// --- CONSTANTS ---
export const API_BASE_URL = 'http://localhost:8888/api'; // Your backend URL
export const APPOINTMENT_FEE = 1000;
export const PAYMENT_METHODS = ['Razorpay', 'Pay on Visit'];

// --- API HELPER ---
/**
 * A helper function for making API calls.
 */
export const api = {
  // --- Auth Calls ---
  login: (email, password) => {
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json());
  },
  
  register: (email, password) => {
      return fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json());
  },

  // --- Property Calls ---
  getProperties: () => {
    return fetch(`${API_BASE_URL}/properties`).then(res => res.json());
  },
  
  getPropertyById: (id) => {
      return fetch(`${API_BASE_URL}/properties/${id}`).then(res => res.json());
  },

  // --- NEW: Admin Property Management ---
  createProperty: (propertyData, token) => {
    return fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(propertyData),
    }).then(res => res.json());
  },

  deleteProperty: (id, token) => {
    return fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json());
  },

  // --- Appointment Calls ---
  bookAppointment: (propertyId, paymentMethod, token) => {
    // Step 1: Initiates booking. Backend creates either a Razorpay order or a 'Pay on Visit' record.
    return fetch(`${API_BASE_URL}/appointments/book`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ propertyId, paymentMethod }),
    }).then(res => res.json());
  },
  
  verifyPayment: (paymentData, token) => {
    return fetch(`${API_BASE_URL}/appointments/payment-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData),
    }).then(res => res.json());
  },
  
  // --- Admin Calls ---
  getAppointments: (token) => {
    return fetch(`${API_BASE_URL}/appointments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json());
  },
  
  getUsers: (token) => {
    return fetch(`${API_BASE_URL}/auth/users`, { 
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json());
  },

  getAdminStats: (token) => {
    return fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json());
  }
};

// --- UTILITIES ---
/**
 * Formats a number into Indian Currency (Lakhs, Crores)
 * e.g., 1500000 becomes "₹15L"
 */
export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "₹0";

  if (num >= 10000000) { // 1 Crore+
    return `₹${(num / 10000000).toFixed(2)}Cr`;
  }
  if (num >= 100000) { // 1 Lakh+
    return `₹${(num / 100000).toFixed(2)}L`;
  }
  // Fallback for less than 1 Lakh
  return `₹${num.toLocaleString('en-IN')}`;
};