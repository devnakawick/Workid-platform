import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const handlersRef = useRef(new Map()); 

  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState(null);

  const connect = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsConnected(false);
      return;
    }

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/chat?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setSocketError(null);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Broadcast to all 
        handlersRef.current.forEach((fn) => fn(data));
      } catch (err) {
        console.error('Invalid WebSocket message:', err);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      setSocketError('Connection error');
      setIsConnected(false);
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setIsConnected(false);

      // Reconnect logic 
      if (event.code !== 1000) { // 1000 = normal close
        const delay = Math.min(30000, 1000 * Math.pow(2, Math.random() * 3));
        console.log(`Reconnecting in ${delay / 1000}s...`);
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      }
    };
  };

  useEffect(() => {
    // Re-run connect when token changes
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close(1000, 'Component unmount');
      }
    };
  }, []); 
  // Watch token changes 
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'access_token') {
        if (socketRef.current) socketRef.current.close(1000, 'Token changed');
        connect();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const subscribe = (fn) => {
    handlersRef.current.add(fn);
    return () => {
      handlersRef.current.delete(fn);
    };
  };

  const sendMessage = (payload) => {   // More flexible: accept object
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn('WebSocket not connected – message queued or dropped');
    }
  };

  return (
    <SocketContext.Provider
      value={{
        subscribe,
        sendMessage,
        isConnected,
        socketError,
        reconnect: connect, 
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};