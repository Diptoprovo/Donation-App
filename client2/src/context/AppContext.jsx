import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { data } from "react-router-dom";

// Create context
const AppContext = createContext();

// API base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

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

  // Setup response interceptor to handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        setUser(null);
        // Optional: redirect to login
      }
      return Promise.reject(error);
    }
  );

  // Check if user is authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/auth/profile");
        if (data.success) {
          setUser(data.user);
        } else {
          console.log(data.message);
        }
      } catch (err) {
        setUser(null);
        console.log("Not logged in or session expired");
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
      const { data } = await api.post(`/auth/register/${userType}`, userData);
      if (data.success) {
        setUser(data.user);
        toast.success("Registration successful!");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", credentials);
      if (data.success) {
        setUser(data.user);
        toast.success("Login successful!");
      }
    } catch (err) {
      console.log("error here bro")
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/auth/logout");
      setUser(null);
      toast.info("Logged out");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Logout failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put("/auth/profile", userData);
      setUser(response.data);
      toast.success("Profile updated successfully");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Item functions
  const getItems = async () => {
    try {
      const { data } = await api.get("/item");
      const items = data.items;
      console.log(items);
      setItems(items);
      return items;
    } catch (err) {
      console.error("Failed to fetch items:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch items";
      setError(errorMessage);
      // Only show toast for network or server errors, not for 401 which is expected when not logged in
      if (err.response?.status !== 401) {
        toast.error(errorMessage);
      }
      return [];
    }
  };

  // const uploadItem = async (itemData) => {
  //   try {
  //     setLoading(true);
  //     const formData = new FormData();

  //     // Add text fields
  //     Object.keys(itemData).forEach((key) => {
  //       if (key !== "image") {
  //         formData.append(key, itemData[key]);
  //       }
  //     });

  //     // Add images
  //     if (itemData.image && itemData.image.length) {
  //       itemData.image.forEach((img) => {
  //         formData.append("image", img);
  //       });
  //     }

  //     const { data } = await api.post("/create-item", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (data.success) {
  //       setItems((prev) => [...prev, response.data]);
  //       toast.success("Item uploaded successfully");
  //     } else {
  //       toast.error('Failed to upload')
  //     }
  //     return response.data;
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || "Item upload failed";
  //     setError(errorMessage);
  //     toast.error(errorMessage);
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Transaction functions
  const getTransactions = async () => {
    try {
      console.log(user.type);
      const { data } = await api.get(`/${user.type}/transactions`);
      setTransactions(data.transactions);
      return data.transactions;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch transactions";
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    }
  };

  const initiateTranRecv = async (tranData) => {
    try {
      const { data } = await api.post("/transaction/new", tranData);
      if (data.success) {
        toast.success(error.message);
      } else {
        toast.error(error.message);
      }
      return data.success;
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Request functions
  const createRequest = async (requestData) => {
    try {
      setLoading(true);
      const response = await api.post("/request/create-request", requestData);
      toast.success("Request sent successfully");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Request creation failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const deleteRequest = async (requestData) => {
    try {
      setLoading(true);
      const a = await { requestId: requestData };
      console.log(a);
      const { requestId } = a;
      console.log(requestId);
      const r = { data: a };
      const response = await api.delete("/request/delete-request", r);
      toast.success("Request deleted successfully");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Request deletion failed";
      setError(errorMessage);
      toast.error(errorMessage);
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
    // uploadItem,

    // Transactions
    transactions,
    getTransactions,
    initiateTranRecv,

    // Requests
    createRequest,
    deleteRequest,
    // Utility
    api,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
