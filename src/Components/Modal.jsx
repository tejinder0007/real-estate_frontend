import React from 'react';

/**
 * Reusable Modal Component (for status messages)
 */
export const Modal = ({ title, message, isError, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
      <h3 className={`text-2xl font-bold mb-4 ${isError ? 'text-red-600' : 'text-blue-600'}`}>
        {title}
      </h3>
      <p className="text-gray-700 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
      >
        Close
      </button>
    </div>
  </div>
);

export default Modal;

