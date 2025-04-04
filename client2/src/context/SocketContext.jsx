import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import AppContext, { useApp } from './AppContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const appContext = useContext(AppContext);
  const user = appContext?.user;

  // Setup socket connection
  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    
    // Only create a new socket if one doesn't exist already
    if (!socketRef.current) {
      try {
        const socketInstance = io(SOCKET_URL, {
          withCredentials: true, 
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
        });

        socketRef.current = socketInstance;

        socketInstance.on('connect', () => {
          console.log('Socket connected');
          setConnected(true);
        });

        socketInstance.on('disconnect', () => {
          console.log('Socket disconnected');
          setConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
        });

        setSocket(socketInstance);
      } catch (err) {
        console.error('Failed to connect to socket:', err);
      }
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once

  // Join user's room when authenticated
  useEffect(() => {
    if (socketRef.current && connected && user?._id) {
      socketRef.current.emit('join', user._id);

      // Listen for notifications
      socketRef.current.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });

      // Cleanup event listeners on unmount or user change
      return () => {
        if (socketRef.current) {
          socketRef.current.off('notification');
        }
      };
    }
  }, [connected, user]);

  // Clear notification
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket: socketRef.current,
    notifications,
    connected,
    clearNotification,
    clearAllNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return { socket: null, notifications: [], connected: false };
  }
  return context;
};

export default SocketContext; 