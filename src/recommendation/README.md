# 🎯 Recommendation System

A sophisticated, production-ready recommendation system for your English/German language learning platform that provides personalized content recommendations based on user behavior, learning level, and preferences.

## 🏗️ System Architecture

### Core Components

1. **UserInteraction Entity** - Stores raw user behavior data
2. **UserProfile Entity** - Stores aggregated user preferences and scores
3. **UserRecommendation Entity** - Stores pre-calculated recommendations (cache)
4. **RecommendationService** - Core scoring algorithm
5. **EventTrackingService** - Handles incoming interaction events
6. **BackgroundJobService** - Processes data and updates profiles
7. **RecommendationGateway** - Real-time SocketIO updates
8. **RecommendationController** - REST API endpoints

## 🧠 How It Works

### 1. Scoring Algorithm

```
FinalScore = BaseScore × EngagementMultiplier × RecencyFactor

Where:
BaseScore = (LevelMatch × 0.4) + (TagMatch × 0.3) + (TeacherFollow × 0.3)
```

- **LevelMatch (40%)**: Content difficulty matching student's level
- **TagMatch (30%)**: Content tags matching student's interests
- **TeacherFollow (30%)**: Content from followed teachers

### 2. Data Flow

```
Frontend → Track Event → UserInteraction Table
Background Job → Process Interactions → Update UserProfile
Background Job → Generate Recommendations → UserRecommendation Cache
Student Request → Get Cached Recommendations → Instant Response
```

### 3. Background Jobs

- **Every 6 hours**: Process interactions and update user profiles
- **Every 6 hours**: Generate new recommendations
- **Daily**: Clean up old interaction data (older than 2 weeks)

## 🚀 API Endpoints

### Get Recommendations
```
GET /recommendations/:contentType?userId=123&limit=20
```

### Track Event
```
POST /recommendations/track-event
Body: {
  userId: 123,
  contentId: 456,
  contentType: "reel",
  watchTime: 15,
  totalTime: 30,
  liked: true
}
```

### Manual Processing
```
POST /recommendations/process-recommendations/:userId
```

## 🔌 SocketIO Events

### Join Session
```javascript
socket.emit('join-recommendation-session', {
  userId: 123,
  sessionId: 'session-abc'
});
```

### Track Session Interaction
```javascript
socket.emit('track-session-interaction', {
  sessionId: 'session-abc',
  contentType: 'reel',
  contentTags: 'grammar,vocabs',
  engagement: 0.8
});
```

### Get Session Recommendations
```javascript
socket.emit('get-session-recommendations', {
  sessionId: 'session-abc',
  contentType: 'reel',
  limit: 20
});
```

## 📊 Database Tables

### user_interactions
- Raw user behavior data
- Stores watch time, scroll depth, likes, comments, etc.
- Auto-cleanup after 2 weeks

### user_profiles
- Aggregated user preferences
- Tag scores (grammar, vocabs, speaking, etc.)
- Engagement metrics (average watch time, scroll depth)
- Updated every 6 hours

### user_recommendations
- Pre-calculated recommendations
- Cached for fast access
- Expires every 6 hours
- Includes score breakdown for debugging

## 🎯 Content Types Supported

- **Reels** - Video content with watch time tracking
- **Articles** - Text content with scroll depth tracking
- **Short Videos** - Video content with engagement tracking

## 🔧 Configuration

### Weights (Configurable)
- Level Match: 40%
- Tag Match: 30%
- Teacher Follow: 30%

### Cache Settings
- Recommendation cache: 6 hours
- Interaction retention: 2 weeks
- Background job frequency: 6 hours

## 🚀 Performance Features

1. **Caching**: Pre-calculated recommendations for instant access
2. **Background Processing**: Non-blocking user experience
3. **Real-time Adjustments**: Session-based fine-tuning via SocketIO
4. **Data Cleanup**: Automatic cleanup of old data
5. **Indexed Queries**: Fast database lookups

## 📱 Frontend Integration

### 1. Track User Interactions
```javascript
// Track video watch time
await fetch('/recommendations/track-event', {
  method: 'POST',
  body: JSON.stringify({
    userId: 123,
    contentId: 456,
    contentType: 'reel',
    watchTime: 15,
    totalTime: 30,
    liked: true
  })
});
```

### 2. Get Recommendations
```javascript
// Get personalized recommendations
const response = await fetch('/recommendations/reel?userId=123&limit=20');
const recommendations = await response.json();
```

### 3. Real-time Updates
```javascript
// Connect to SocketIO
const socket = io('http://localhost:3000');

// Join recommendation session
socket.emit('join-recommendation-session', {
  userId: 123,
  sessionId: 'session-abc'
});

// Listen for new recommendations
socket.on('new-recommendations-available', (data) => {
  console.log('New recommendations available:', data);
});
```

## 🔍 Monitoring & Debugging

### Health Check
```
GET /recommendations/health
```

### Cache Status
- `fresh`: Recommendations less than 6 hours old
- `stale`: Recommendations older than 6 hours
- `expired`: No recommendations available

### Score Breakdown
Each recommendation includes:
- `levelScore`: How well content matches user's level
- `tagScore`: How well content matches user's interests
- `teacherScore`: Teacher following bonus
- `engagementMultiplier`: User's engagement history
- `recencyFactor`: Content age bonus

## 🚧 Production Considerations

### 1. Database Migration
Create migration to add new tables:
```sql
-- Add level field to existing content tables
ALTER TABLE reels ADD COLUMN level VARCHAR(255);
ALTER TABLE articles ADD COLUMN level VARCHAR(255);
ALTER TABLE short_videos ADD COLUMN level VARCHAR(255);
```

### 2. Environment Variables
```env
RECOMMENDATION_CACHE_DURATION=6 # hours
INTERACTION_RETENTION_DAYS=14
BACKGROUND_JOB_INTERVAL=6 # hours
```

### 3. Scaling
- Use Redis for caching in production
- Implement database connection pooling
- Add monitoring and alerting
- Consider horizontal scaling for high traffic

## 🎉 Benefits

1. **Instant Recommendations**: Cached results for fast response
2. **Personalized Content**: Based on actual user behavior
3. **Learning Level Matching**: Content at appropriate difficulty
4. **Teacher Following**: Builds community and trust
5. **Real-time Adjustments**: Session-based fine-tuning
6. **Scalable Architecture**: Handles thousands of users
7. **Production Ready**: Industry-standard approach

## 🔮 Future Enhancements

1. **Machine Learning**: Replace rule-based scoring with ML models
2. **A/B Testing**: Test different recommendation algorithms
3. **Content Discovery**: Explore new content types and formats
4. **Social Features**: Group recommendations and collaborative filtering
5. **Analytics Dashboard**: Monitor recommendation performance

---

**Built with ❤️ for your language learning platform**




