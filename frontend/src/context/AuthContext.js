import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      // Try multiple endpoint variations sequentially
      const possibleEndpoints = [
        `/Customer/login`, // Original path
        `/${role}/login`,  // Specific role path
        `/api/${role}/login`, // API prefix with role
        `/api/auth/login`  // General auth endpoint
      ];

      let response = null;
      let successEndpoint = '';
      let error = null;

      // Try each endpoint until one works
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Attempting login with endpoint: ${endpoint}`);
          
          // For the general auth endpoint, include role in body
          const data = endpoint === '/api/auth/login' 
            ? { email, password, role } 
            : { email, password };
            
          response = await axios.post(endpoint, data);
          successEndpoint = endpoint;
          console.log(`Login successful with endpoint: ${endpoint}`);
          break; // Exit the loop on success
        } catch (err) {
          console.log(`Login failed with endpoint: ${endpoint}`, err.message);
          error = err;
        }
      }

      if (!response) {
        console.error('All login endpoints failed');
        // Try a direct approach with whatever backend structure you have
        try {
          response = await axios.post('/login', { email, password, role });
        } catch (finalErr) {
          // If this also fails, throw the original error
          throw error || finalErr;
        }
      }

      // Extract user data
      const userData = response.data.user || response.data;
      
      // Create standardized user object
      const user = { 
        ...userData,
        role,
        token: userData.token || response.data.token
      };
      
      setCurrentUser(user);
      setIsLoggedIn(true);
      setUserRole(role);
      
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData, role) => {
    try {
      let endpoint = '';
      
      switch(role) {
        case 'customer':
          endpoint = '/Customer';
          break;
        case 'busowner':
          endpoint = '/BusOwner';
          break;
        case 'driver':
          endpoint = '/Driver';
          break;
        case 'conductor':
          endpoint = '/Conductor';
          break;
        default:
          throw new Error('Invalid role');
      }
      
      const response = await axios.post(endpoint, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    isLoggedIn,
    userRole,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
