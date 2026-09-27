import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AuthContext = createContext();

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token and get user profile
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Token might be invalid, remove it
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials) => {
    try {
      const response = await api.post('/api/auth/signin', credentials);
      const { access_token, ...userData } = response.data;
      
      // Store token and set api header
      localStorage.setItem('token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
      toast.success('Successfully signed in!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Sign in failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      const { access_token, ...userInfo } = response.data;
      
      // Store token and set api header
      localStorage.setItem('token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userInfo);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Sign up failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('Signed out successfully');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser: fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};