# OAuth2 Google Signin Frontend Integration Test Guide

## Backend Changes Completed ✅

1. **Updated Admin Auth Config** - Added frontend URL configuration
2. **Enhanced Google Strategy** - Improved OAuth2 flow
3. **Modified Admin Auth Controller** - Added frontend redirect handling
4. **Added New Endpoints** - `/admin/auth/google/init` for frontend initiation

## Test the OAuth2 Flow

### 1. Test Backend Endpoints

```bash
# Test the new initiation endpoint
curl "http://localhost:3000/admin/auth/google/init?redirect_uri=http://localhost:8080"

# Expected response:
{
  "authUrl": "/admin/auth/google?redirect_uri=http%3A%2F%2Flocalhost%3A8080",
  "message": "Use this URL to initiate Google OAuth2 flow"
}
```

### 2. Test OAuth2 Flow

1. **Visit in browser**: `http://localhost:3000/admin/auth/google/init?redirect_uri=http://localhost:8080`
2. **Click the authUrl** or visit: `http://localhost:3000/admin/auth/google?redirect_uri=http://localhost:8080`
3. **Complete Google OAuth2** - You'll be redirected to Google
4. **After authorization** - You'll be redirected to: `http://localhost:8080/admin/auth-success?accessToken=...&user=...&youtubeTokens=...&success=true`

### 3. Test Error Handling

If authentication fails, you'll be redirected to:
`http://localhost:8080/admin/auth-error?error=authentication_failed&message=...`

## Frontend Integration Points

### Vue Router Routes Needed:
```javascript
// Add these routes to your Vue router
{
  path: '/admin/auth-success',
  name: 'AdminAuthSuccess',
  component: AdminAuthSuccess
},
{
  path: '/admin/auth-error', 
  name: 'AdminAuthError',
  component: AdminAuthError
}
```

### Token Extraction:
```javascript
// In your Vue component
mounted() {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('accessToken');
  const user = JSON.parse(urlParams.get('user') || '{}');
  const youtubeTokens = JSON.parse(urlParams.get('youtubeTokens') || '{}');
  
  if (accessToken) {
    // Store tokens in localStorage or Vuex
    localStorage.setItem('adminToken', accessToken);
    localStorage.setItem('adminUser', JSON.stringify(user));
    localStorage.setItem('youtubeTokens', JSON.stringify(youtubeTokens));
    
    // Redirect to admin dashboard
    this.$router.push('/admin/dashboard');
  }
}
```

## Environment Variables

Create a `.env` file in your backend root with:
```env
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
FRONTEND_BASE_URL=http://localhost:8080
ADMIN_JWT_SECRET=your_secure_jwt_secret
```

## Next Steps

1. **Test the backend flow** using the steps above
2. **Create Vue components** for auth success/error pages
3. **Implement token storage** in your Vue app
4. **Add protected admin routes** using the stored token
5. **Test the complete flow** from frontend to backend and back

## Troubleshooting

- **CORS errors**: Ensure CORS is enabled (already done in main.ts)
- **Redirect URI mismatch**: Check Google Console redirect URIs
- **Token not received**: Check browser console for errors
- **Frontend not receiving tokens**: Verify redirect URLs match exactly
