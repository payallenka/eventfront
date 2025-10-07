import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (url, options = {}) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const isConnectingRef = useRef(false); // Add flag to prevent multiple connections
  
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    maxReconnectAttempts = 3, // Reduce max attempts
    reconnectInterval = 5000, // Increase interval
    shouldReconnect = true
  } = options;

  const connect = useCallback(() => {
    try {
      // Prevent multiple connections
      if (isConnectingRef.current || 
          wsRef.current?.readyState === WebSocket.CONNECTING || 
          wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      isConnectingRef.current = true;
      
      // Close existing connection
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket(url);
      wsRef.current = ws;
      setConnectionStatus('connecting');

      ws.onopen = (event) => {
        setConnectionStatus('connected');
        setError(null);
        reconnectAttempts.current = 0;
        isConnectingRef.current = false;
        onOpen?.(event);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          onMessage?.(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
          setError('Failed to parse message');
        }
      };

      ws.onclose = (event) => {
        setConnectionStatus('disconnected');
        wsRef.current = null;
        isConnectingRef.current = false;
        onClose?.(event);

        // Attempt to reconnect if enabled and not max attempts reached
        if (shouldReconnect && 
            reconnectAttempts.current < maxReconnectAttempts &&
            !event.wasClean && 
            document.visibilityState === 'visible') {
          
          reconnectAttempts.current += 1;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval * reconnectAttempts.current); // Exponential backoff
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setConnectionStatus('failed');
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setConnectionStatus('error');
        setError('Connection error');
        isConnectingRef.current = false;
        onError?.(event);
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setConnectionStatus('error');
      setError(err.message);
    }
  }, [url, onMessage, onOpen, onClose, onError, maxReconnectAttempts, reconnectInterval, shouldReconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    isConnectingRef.current = false;
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Disconnected by client');
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        const data = typeof message === 'string' ? message : JSON.stringify(message);
        wsRef.current.send(data);
        return true;
      } catch (err) {
        console.error('Failed to send WebSocket message:', err);
        setError('Failed to send message');
        return false;
      }
    } else {
      console.warn('WebSocket is not connected');
      return false;
    }
  }, []);

  // Initialize connection
  useEffect(() => {
    connect();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && 
          connectionStatus === 'disconnected' && 
          shouldReconnect) {
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      disconnect();
    };
  }, []); // Remove the dependency array to prevent infinite reconnections

  return {
    connectionStatus,
    lastMessage,
    error,
    sendMessage,
    connect,
    disconnect,
    isConnected: connectionStatus === 'connected'
  };
};

export default useWebSocket;
