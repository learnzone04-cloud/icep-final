// Example: How to test the notification system

// 1. Connect to Socket.IO for real-time notifications
const socket = io('http://localhost:3000/notifications', {
  auth: {
    token: 'your_jwt_token_here'
  }
});

// 2. Listen for notifications
socket.on('newNotification', (notification) => {
  console.log('New notification received:', notification);
  // Show notification to user (toast, popup, etc.)
  showNotification(notification);
});

socket.on('unreadCountUpdate', (data) => {
  console.log('Unread count updated:', data.count);
  updateUnreadBadge(data.count);
});

// 3. Subscribe to notifications
socket.emit('subscribe');

// 4. HTTP API endpoints for managing notifications

// Get user notifications
fetch('/api/notifications?limit=20&offset=0', {
  headers: {
    'Authorization': 'Bearer your_jwt_token_here'
  }
});

// Get unread count
fetch('/api/notifications/unread-count', {
  headers: {
    'Authorization': 'Bearer your_jwt_token_here'
  }
});

// Mark notification as read
fetch('/api/notifications/123/read', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_jwt_token_here'
  }
});

// Mark all as read
fetch('/api/notifications/mark-all-read', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_jwt_token_here'
  }
});

// Delete notification
fetch('/api/notifications/123', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer your_jwt_token_here'
  }
});

// 5. Notification types that will be sent automatically:
// - ROOM_CREATED: When a teacher creates a new room
// - ROOM_ENROLLMENT: When a student enrolls in a room
// - ROOM_STARTING: When teacher joins the room (room starts)
// - ROOM_CANCELLED: When a room is cancelled
// - ROOM_COMPLETED: When a room is completed
// - PAYMENT_SUCCESS: When payment is successful
// - PAYMENT_FAILED: When payment fails

// 6. LiveKit Integration - Additional endpoints:
// Complete a room (teachers only)
fetch('/api/livekit/room/123/complete', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_jwt_token_here'
  }
});

// Cancel a room (teachers only)
fetch('/api/livekit/room/123/cancel', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_jwt_token_here'
  }
});

// 7. Real-time notifications for LiveKit events:
// - When teacher joins room → Students get "Room Starting" notification
// - When student joins room → Teacher gets "Student Joined" notification
// - When room is completed → All participants get "Room Completed" notification
// - When room is cancelled → All participants get "Room Cancelled" notification 