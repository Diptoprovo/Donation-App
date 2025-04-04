import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const AppContext = createContext();

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const AppProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Items state
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Setup axios with credentials
  axios.defaults.withCredentials = true;

  // Configure axios
  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Auth functions
  const register = async (userData, userType) => {
    try {
      setLoading(true);
      const response = await api.post(`/auth/register/${userType}`, userData);
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/auth/logout');
      setUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put('/auth/profile', userData);
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Item functions
  const getItems = async () => {
    try {
      const response = await api.get('/item');
      setItems(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch items');
      throw err;
    }
  };

  const uploadItem = async (itemData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add text fields
      Object.keys(itemData).forEach(key => {
        if (key !== 'image') {
          formData.append(key, itemData[key]);
        }
      });
      
      // Add images
      if (itemData.image && itemData.image.length) {
        itemData.image.forEach(img => {
          formData.append('image', img);
        });
      }

      const response = await api.post('/item', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setItems(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Item upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Transaction functions
  const getTransactions = async () => {
    try {
      const response = await api.get('/transaction');
      setTransactions(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      throw err;
    }
  };

  // Request functions
  const createRequest = async (requestData) => {
    try {
      setLoading(true);
      const response = await api.post('/request', requestData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Request creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  const value = {
    // Auth
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    clearError,
    
    // Items
    items,
    getItems,
    uploadItem,
    
    // Transactions
    transactions,
    getTransactions,
    
    // Requests
    createRequest,
    
    // Utility
    api
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
