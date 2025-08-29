const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const teacherToken = 'YOUR_TEACHER_JWT_TOKEN'; // Replace with actual token
const studentToken = 'YOUR_STUDENT_JWT_TOKEN'; // Replace with actual token

async function testStoryUpload() {
  try {
    console.log('🚀 Testing Story Upload System...\n');

    // 1. Upload a photo
    console.log('1. Uploading photo...');
    const formData = new FormData();
    formData.append('photo', fs.createReadStream('./test-image.jpg')); // Create a test image first

    const uploadResponse = await axios.post(`${BASE_URL}/stories/upload-photo`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${teacherToken}`
      }
    });

    console.log('✅ Photo uploaded:', uploadResponse.data);
    const mediaUrl = uploadResponse.data.mediaUrl;

    // 2. Create a photo story
    console.log('\n2. Creating photo story...');
    const photoStoryData = {
      type: 'photo',
      content: 'Check out this amazing photo!',
      mediaUrl: mediaUrl
    };

    const photoStoryResponse = await axios.post(`${BASE_URL}/stories`, photoStoryData, {
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Photo story created:', photoStoryResponse.data);
    const storyId = photoStoryResponse.data.id;

    // 3. Create a text story
    console.log('\n3. Creating text story...');
    const textStoryData = {
      type: 'text',
      content: 'This is a beautiful text story!',
      backgroundColor: '#ff6b6b',
      textColor: '#ffffff',
      fontSize: 24
    };

    const textStoryResponse = await axios.post(`${BASE_URL}/stories`, textStoryData, {
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Text story created:', textStoryResponse.data);

    // 4. Get teacher's stories
    console.log('\n4. Getting teacher stories...');
    const teacherStoriesResponse = await axios.get(`${BASE_URL}/stories/my-stories`, {
      headers: {
        'Authorization': `Bearer ${teacherToken}`
      }
    });

    console.log('✅ Teacher stories:', teacherStoriesResponse.data);

    // 5. Like a story (as student)
    console.log('\n5. Liking story as student...');
    await axios.post(`${BASE_URL}/stories/${storyId}/like`, {}, {
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    console.log('✅ Story liked successfully');

    // 6. Get story likes
    console.log('\n6. Getting story likes...');
    const likesResponse = await axios.get(`${BASE_URL}/stories/${storyId}/likes`, {
      headers: {
        'Authorization': `Bearer ${teacherToken}`
      }
    });

    console.log('✅ Story likes:', likesResponse.data);

    // 7. Get stories for student
    console.log('\n7. Getting stories for student...');
    const studentStoriesResponse = await axios.get(`${BASE_URL}/stories/for-student`, {
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    console.log('✅ Student stories:', studentStoriesResponse.data);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 Notes:');
    console.log('- Photos are saved in ./uploads/stories/');
    console.log('- Files are automatically deleted when stories expire');
    console.log('- Run cleanup manually: POST /api/stories/cleanup-expired');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Helper function to create a test image
function createTestImage() {
  const testImagePath = './test-image.jpg';
  if (!fs.existsSync(testImagePath)) {
    console.log('📸 Creating test image...');
    // Create a simple 1x1 pixel JPEG (base64 encoded)
    const base64Image = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A';
    fs.writeFileSync(testImagePath, Buffer.from(base64Image, 'base64'));
    console.log('✅ Test image created');
  }
}

// Run the test
if (require.main === module) {
  createTestImage();
  testStoryUpload();
}

module.exports = { testStoryUpload }; 