import React, { createContext, useContext } from 'react';
import { useAuth } from '../Components/hooks.js';
import { LoadingSpinner } from '../Components/LoadingSpinner.jsx';

// 1. Create the context
export const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
    const auth = useAuth();
    
    // Show a top-level spinner while auth is loading
    if (auth.loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <LoadingSpinner />
            </div>
        );
    }
    
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// 3. Create the hook to use the context
export const useAuthContext = () => useContext(AuthContext);