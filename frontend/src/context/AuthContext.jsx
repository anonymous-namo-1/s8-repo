import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const sendOTP = async (email) => {
    const response = await api.post('/api/auth/send-otp', { email });
    return response.data;
  };

  const verifyOTP = async (email, otp) => {
    const response = await api.post('/api/auth/verify-otp', { email, otp });

    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
    }

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data);
      } catch (error) {
        logout();
      }
    }
  };

  const getDownloadLink = async (templateId) => {
    const response = await api.get(`/api/auth/download/${templateId}`);
    return response.data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    sendOTP,
    verifyOTP,
    logout,
    refreshUser,
    getDownloadLink,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
