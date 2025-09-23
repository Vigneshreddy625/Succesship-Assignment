import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true = authenticated, false = not authenticated
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/me`);
      
      if (response.data.success && response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.log("Authentication check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
    if (response.data?.success) {
      setIsAuthenticated(true);
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, message: response.data?.message || 'Login failed' };
  };

  const register = async ({ fullName, email, password, mobile }) => {
    const response = await axios.post(`${apiUrl}/api/auth/register`, { fullName, email, password, mobile });
    if (response.data?.success) {
      setIsAuthenticated(true);
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, message: response.data?.message || 'Registration failed' };
  };

  const logout = async () => {
    try {
      await axios.post(`${apiUrl}/api/auth/logout`);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local state regardless of server response
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
