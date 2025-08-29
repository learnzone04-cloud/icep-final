// Socket.IO Chat Client Example
// Usage:
// 1. Replace JWT_TOKEN and CHAT_URL with your values.
// 2. Run: node socketio-chat-client.js
// 3. The script will create a chat, join it, and send a message.
//
// You can also use the class in your own scripts for more advanced testing.

const { io } = require('socket.io-client');

class ChatSocketClient {
  constructor({ url, token }) {
    this.socket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => console.log('✅ Connected:', this.socket.id));
    this.socket.on('connect_error', (err) => console.error('❌ Connect error:', err.message));
    this.socket.on('disconnect', () => console.log('❌ Disconnected'));
    this.socket.on('new_message', (msg) => {
      console.log('📩 New message:', msg);
    });
  }

  joinChat(chatId) {
    this.socket.emit('join', { chatId });
    console.log(`Joined chat room: ${chatId}`);
  }

  createChat(otherId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('create_chat', { otherId });
      this.socket.once('create_chat', (data) => resolve(data));
      this.socket.once('error', (err) => reject(err));
    });
  }

  sendMessage(chatId, message) {
    this.socket.emit('send_message', { chatId, message });
  }

  onNewMessage(callback) {
    this.socket.on('new_message', callback);
  }
}

// === USAGE EXAMPLE ===
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoid2Fzc2VtICBtamFya2VzaCIsImlkIjozLCJyb2xlIjoiVGVhY2hlciIsInRlYWNoZXJJZCI6MSwiaWF0IjoxNzUyNzY0MTcxLCJleHAiOjE4MDI3NjQxNzF9.HaJS1BhBVsL8RiAIEjlVV_b5g46_vxvINVfuQJs_cvE';
const CHAT_URL = 'http://localhost:3000/chat';

const client = new ChatSocketClient({ url: CHAT_URL, token: JWT_TOKEN });

// Example: create a chat, join it, and send a message
(async () => {
  // Replace with the other user's id (teacherId or studentId, depending on your role)
  const otherId = 1;

  // Create chat
  const { chatId, chat } = await client.createChat(otherId);
  console.log('Created chat:', chatId);

  // Join chat room
  client.joinChat(chatId);

  // Listen for new messages
  client.onNewMessage((msg) => {
    console.log('Received new message:', msg);
  });

  // Send a message
  client.sendMessage(chatId, 'Hello from Socket.IO client!');
})(); 