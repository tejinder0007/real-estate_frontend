import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../Components/utils.js'; 
import { useAuthContext } from '../context/AuthContext.jsx'; 


export const AuthPage = ({ isRegister = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const auth = useAuthContext(); 

  const title = isRegister ? 'Create an Account' : 'Login';
  const buttonText = isRegister ? 'Register' : 'Login';
  const switchPrompt = isRegister ? 'Already have an account?' : "Don't have an account?";
  const switchLink = isRegister ? '/login' : '/register';
  const switchText = isRegister ? 'Login' : 'Register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const authFn = isRegister ? api.register : api.login;
      const data = await authFn(email, password);
      
      if (data.token && data.user) {
        
        auth.login(data.user, data.token); 
        
        
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg text-center mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400"
        >
          {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span> : buttonText}
        </button>
      </form>
      
      <p className="text-center text-gray-600 mt-6">
        {switchPrompt}
        <Link 
          to={switchLink}
          className="text-blue-600 hover:underline font-medium ml-2"
        >
          {switchText}
        </Link>
      </p>
    </div>
  );
};

export default AuthPage;