const io = require('socket.io-client');

// Configuration
const SERVER_URL = 'http://localhost:3000';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

// Test data
const testMessage = {
  content: 'Hello from test script!',
  typeId: 1
};

async function testWebSocket() {
  console.log('🔌 Connecting to WebSocket...');
  
  // Connect to WebSocket with authentication
  const socket = io(`${SERVER_URL}/hub`, {
    auth: {
      token: JWT_TOKEN
    },
    transports: ['websocket', 'polling']
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket');
    console.log('Socket ID:', socket.id);
    
    // Register user
    socket.emit('register');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from WebSocket');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
  });

  // Hub events
  socket.on('registered', (data) => {
    console.log('✅ User registered:', data);
    
    // Send a test message after registration
    setTimeout(() => {
      console.log('📤 Sending test message...');
      socket.emit('sendMessage', testMessage);
    }, 1000);
  });

  socket.on('newMessage', (message) => {
    console.log('📨 New message received:', {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      timestamp: message.timestamp
    });
    
    // Get message history after receiving a message
    setTimeout(() => {
      console.log('📚 Requesting message history...');
      socket.emit('getHistory', { limit: 5 });
    }, 1000);
  });

  socket.on('history', (messages) => {
    console.log('📚 Message history received:', messages.length, 'messages');
    messages.forEach((msg, index) => {
      console.log(`  ${index + 1}. [${msg.senderId}] ${msg.content}`);
    });
    
    // Get online users after getting history
    setTimeout(() => {
      console.log('👥 Requesting online users...');
      socket.emit('getOnlineUsers');
    }, 1000);
  });

  socket.on('onlineUsers', (users) => {
    console.log('👥 Online users:', users);
    
    // Disconnect after testing
    setTimeout(() => {
      console.log('🔌 Disconnecting...');
      socket.disconnect();
      process.exit(0);
    }, 2000);
  });

  socket.on('error', (error) => {
    console.error('❌ Error received:', error);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🔌 Disconnecting...');
    socket.disconnect();
    process.exit(0);
  });
}

// Instructions
console.log('🚀 WebSocket Test Script');
console.log('========================');
console.log('Before running this script:');
console.log('1. Make sure your NestJS server is running on port 3000');
console.log('2. Replace JWT_TOKEN with a valid token from login');
console.log('3. Install socket.io-client: npm install socket.io-client');
console.log('4. Run: node test-websocket.js');
console.log('');

// Check if token is provided
if (JWT_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
  console.error('❌ Please replace JWT_TOKEN with a valid token from login');
  process.exit(1);
}

// Run the test
testWebSocket(); 