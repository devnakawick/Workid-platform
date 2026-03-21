let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 4000;

export const connectSocket = (callbacks = {}) => {
  const {
    onMessage = () => {},
    onOpen = () => {},
    onClose = () => {},
    onError = () => {},
  } = callbacks;

  // Prevent duplicate connections
  if (socket && (
    socket.readyState === WebSocket.OPEN ||
    socket.readyState === WebSocket.CONNECTING
  )) {
    console.log('[WS] Already connected/connecting → reusing existing socket');
    return socket;
  }

  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('[WS] No access_token in localStorage → cannot connect');
    return null;
  }

  const baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
  const wsUrl = `${baseUrl}/api/messages/ws/chat?token=${encodeURIComponent(token)}`;

  console.log('[WS] Connecting to:', wsUrl);

  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('[WS] Connected successfully');
    reconnectAttempts = 0;
    onOpen();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('[WS] Failed to parse incoming message:', event.data, err);
    }
  };

  socket.onerror = (err) => {
    console.error('[WS] WebSocket error:', err);
    onError(err);
  };

  socket.onclose = (event) => {
    console.log(`[WS] Closed → code: ${event.code}, reason: ${event.reason || 'none'}`);
    socket = null;
    onClose(event);

    // Auto-reconnect (except clean close by us)
    if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`[WS] Reconnecting... attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      setTimeout(() => connectSocket(callbacks), RECONNECT_DELAY_MS);
    } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WS] Max reconnect attempts reached. Giving up.');
    }
  };

  return socket;
};

export const sendSocketMessage = (conversationId, text) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('[WS] Cannot send → socket not open');
    return false;
  }

  const payload = { conversationId, text };
  socket.send(JSON.stringify(payload));
  console.log('[WS] Sent:', payload);
  return true;
};

export const disconnectSocket = (reason = 'manual disconnect') => {
  if (socket) {
    console.log('[WS] Disconnecting →', reason);
    socket.close(1000, reason);
    socket = null;
    reconnectAttempts = 0;
  }
};

export const isConnected = () => {
  return socket?.readyState === WebSocket.OPEN ?? false;
};