const express = require('express');
const { io } = require('socket.io-client');

// === CONFIGURATION ===
const SOCKET_URL = 'http://localhost:3000/hub';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoid2Fzc2VtICBtamFya2VzaCIsImlkIjoxLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NTE4ODk1NTAsImV4cCI6MTgwMTg4OTU1MH0.Nt4u2H6u5VkJgubWq7KVbLVRybu3NyUdcvo8x6TZKyM'
const PORT = 40003; // Port for this proxy app

// === SETUP SOCKET.IO CLIENT ===
const socket = io(SOCKET_URL, {
  auth: { token: JWT_TOKEN },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => console.log('✅ Socket.IO connected:', socket.id));
socket.on('connect_error', (err) => console.error('❌ Socket.IO connect error:', err.message));
socket.on('disconnect', () => console.log('❌ Socket.IO disconnected'));

// === SETUP EXPRESS APP ===
const app = express();
app.use(express.json());

// Register on connect
socket.on('connect', () => {
  socket.emit('register');
});

// === HTTP ENDPOINTS ===

// Send a message
app.post('/send-message', (req, res) => {
  const { content, typeId } = req.body;
  if (!content || !typeId) {
    return res.status(400).json({ error: 'content and typeId are required' });
  }
  socket.emit('sendMessage', { content, typeId });
  // Listen for the newMessage event
  socket.once('newMessage', (msg) => {
    res.json(msg);
  });
  // Listen for error event
  socket.once('error', (err) => {
    res.status(500).json({ error: err });
  });
});

// Get message history
app.get('/get-history', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  socket.emit('getHistory', { limit });
  socket.once('history', (messages) => {
    res.json(messages);
  });
  socket.once('error', (err) => {
    res.status(500).json({ error: err });
  });
});

// Get online users
app.get('/get-online-users', (req, res) => {
  socket.emit('getOnlineUsers');
  socket.once('onlineUsers', (users) => {
    res.json(users);
  });
  socket.once('error', (err) => {
    res.status(500).json({ error: err });
  });
});

// Health check
app.get('/', (req, res) => {
  res.send('Socket.IO Proxy is running');
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Proxy app listening on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST   /send-message   { content, typeId }');
  console.log('  GET    /get-history?limit=10');
  console.log('  GET    /get-online-users');
}); 