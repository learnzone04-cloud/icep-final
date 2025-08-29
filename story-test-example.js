// Example: How to test the Story System

// 1. Create a text story (teachers only)
fetch('/api/stories', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_teacher_jwt_token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'text',
    content: 'Hello everyone! This is my first story! 📚',
    backgroundColor: '#ff6b6b',
    textColor: '#ffffff',
    fontSize: 24
  })
});

// 2. Create a photo story (teachers only)
fetch('/api/stories', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_teacher_jwt_token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'photo',
    mediaUrl: 'https://example.com/photo.jpg',
    content: 'Check out this amazing photo! 📸'
  })
});

// 3. Upload photo for story
const formData = new FormData();
formData.append('photo', fileInput.files[0]);

fetch('/api/stories/upload-photo', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_teacher_jwt_token'
  },
  body: formData
});

// 4. Get stories for student (from followed teachers)
fetch('/api/stories/for-student', {
  headers: {
    'Authorization': 'Bearer your_student_jwt_token'
  }
});

// 5. Get teacher's own stories
fetch('/api/stories/my-stories', {
  headers: {
    'Authorization': 'Bearer your_teacher_jwt_token'
  }
});

// 6. Get stories by specific teacher
fetch('/api/stories/teacher/123', {
  headers: {
    'Authorization': 'Bearer your_jwt_token'
  }
});

// 7. Like a story (students only)
fetch('/api/stories/123/like', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_student_jwt_token'
  }
});

// 8. Unlike a story (students only)
fetch('/api/stories/123/like', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer your_student_jwt_token'
  }
});

// 9. Check if student has liked a story
fetch('/api/stories/123/has-liked', {
  headers: {
    'Authorization': 'Bearer your_student_jwt_token'
  }
});

// 10. Get story likes
fetch('/api/stories/123/likes', {
  headers: {
    'Authorization': 'Bearer your_jwt_token'
  }
});

// 11. Delete story (teachers only)
fetch('/api/stories/123', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer your_teacher_jwt_token'
  }
});

// 12. Clean up expired stories (admin)
fetch('/api/stories/cleanup-expired', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_admin_jwt_token'
  }
});

// Story Features:
// ✅ Stories disappear after 24 hours
// ✅ Students can like stories
// ✅ Only followers can see stories
// ✅ Support for both photo and text stories
// ✅ Customizable text styling (color, size, background)
// ✅ Privacy controls (followers only)
// ✅ Auto-cleanup of expired stories
// ✅ Like/unlike functionality
// ✅ Story management for teachers

// Story Types:
// - PHOTO: Upload photos with optional captions
// - TEXT: Create text stories with custom styling

// Privacy:
// - Only students who follow the teacher can see their stories
// - Only students who follow the teacher can like their stories
// - Teachers can only delete their own stories

// Expiration:
// - Stories automatically expire after 24 hours
// - Expired stories are marked and can be cleaned up
// - Cleanup can be run manually or via cron job 