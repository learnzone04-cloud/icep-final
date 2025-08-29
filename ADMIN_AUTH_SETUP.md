# Admin Authentication Setup Guide

## Overview
This system provides separate OAuth2 authentication for admin access using Google (for YouTube integration). It's completely separate from the existing teacher/student authentication system.

## Features
- ✅ OAuth2 Google authentication for admin access
- ✅ Separate JWT tokens with different secrets
- ✅ Email-based authorization (only specific emails can access)
- ✅ Different guards and strategies from regular auth
- ✅ Admin dashboard with protected routes

## Setup Instructions

### 1. Google OAuth2 Setup

✅ **Already Configured!** We're using the same Google OAuth2 credentials as your YouTube integration.

**Current Configuration:**
- Client ID: `[YOUR_GOOGLE_CLIENT_ID]` (from environment variables)
- Client Secret: `[YOUR_GOOGLE_CLIENT_SECRET]` (from environment variables)

**Required Action:** Add this redirect URI to your existing Google OAuth2 credentials:
```
http://127.0.0.1:3000/admin/auth/google/callback
```

**Your Google OAuth2 credentials should now have these redirect URIs:**
1. `http://127.0.0.1:3000/auth/google/callback` (for YouTube integration)
2. `http://127.0.0.1:3000/admin/auth/google/callback` (for admin auth)

⚠️ **Important:** After adding the redirect URI, it may take 5 minutes to several hours for Google to propagate the changes. If you get a "redirect_uri_mismatch" error, wait and try again later.

### 2. Configuration

✅ **Already Configured!** The admin authentication is using the same Google credentials as your YouTube integration.

**Current Settings:**
- Google OAuth2: Same credentials as YouTube integration
- Admin JWT Secret: `ADMIN_SECRET_KEY_2025_ICEP_BACKEND` (different from regular auth)
- JWT Expiration: 24 hours

### 3. Configure Allowed Admin Emails

**Required Action:** Update `src/admin-auth/admin-auth.config.ts` with your actual YouTube account email:

```typescript
allowedEmails: [
  'your-actual-youtube-email@gmail.com', // Replace with your real YouTube account email
  // Add more admin emails if needed
],
```

**Important:** Replace `'your-youtube-email@gmail.com'` with the actual email address of your YouTube account.

## API Endpoints

### Authentication Endpoints

1. **Initiate Google OAuth2 Flow**
   ```
   GET /admin/auth/google
   ```
   - Redirects to Google OAuth2 consent screen

2. **Google OAuth2 Callback**
   ```
   GET /admin/auth/google/callback
   ```
   - Handles Google OAuth2 callback
   - Redirects to admin dashboard with JWT token

3. **Verify Admin Token**
   ```
   GET /admin/auth/verify
   Authorization: Bearer <admin-jwt-token>
   ```

4. **Get Admin Profile**
   ```
   GET /admin/auth/profile
   Authorization: Bearer <admin-jwt-token>
   ```

### Admin Dashboard Endpoints

All dashboard endpoints require `AdminAuthGuard`:

1. **Dashboard Home**
   ```
   GET /admin/dashboard
   Authorization: Bearer <admin-jwt-token>
   ```

2. **YouTube Status**
   ```
   GET /admin/dashboard/youtube-status
   Authorization: Bearer <admin-jwt-token>
   ```

3. **User Statistics**
   ```
   GET /admin/dashboard/users/stats
   Authorization: Bearer <admin-jwt-token>
   ```

4. **System Restart**
   ```
   POST /admin/dashboard/system/restart
   Authorization: Bearer <admin-jwt-token>
   ```

## Usage Flow

### 1. Admin Login
1. Navigate to `http://localhost:3000/admin/auth/google`
2. Google OAuth2 consent screen appears
3. Sign in with your YouTube account email
4. If email is authorized, you'll be redirected to dashboard with JWT token

### 2. Using Admin APIs
```javascript
// Example: Get admin dashboard
fetch('http://localhost:3000/admin/dashboard', {
  headers: {
    'Authorization': 'Bearer ' + adminJwtToken
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### 3. Frontend Integration
```javascript
// Store admin token after OAuth2 callback
const urlParams = new URLSearchParams(window.location.search);
const adminToken = urlParams.get('token');
if (adminToken) {
  localStorage.setItem('adminToken', adminToken);
}

// Use token for admin API calls
const adminToken = localStorage.getItem('adminToken');
fetch('/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

## Security Features

1. **Separate JWT Secrets**: Admin tokens use different secret from regular auth
2. **Email Whitelist**: Only specific emails can access admin features
3. **Token Verification**: Each request verifies email is still in allowed list
4. **Shorter Expiration**: Admin tokens expire in 24 hours (vs 50000000s for regular)
5. **Different Guards**: Uses `AdminAuthGuard` instead of regular `JwtAuthGuard`

## Testing the Admin Authentication

### Step-by-Step Testing Guide

#### 1. **Test OAuth2 Flow** (After Google Console changes propagate)
```bash
# Start your NestJS server
npm run start:dev

# Open in browser
http://localhost:3000/admin/auth/google
```

**Expected Flow:**
1. Redirects to Google OAuth2 consent screen
2. Sign in with your YouTube account email
3. If email is authorized, redirects to admin dashboard with JWT token
4. If email not authorized, shows "Email not authorized" error

#### 2. **Test Token Verification**
```bash
# After successful OAuth2 login, you'll get a token
# Test token verification:
curl -X GET http://localhost:3000/admin/auth/verify \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### 3. **Test Admin Dashboard Access**
```bash
# Test dashboard access with token:
curl -X GET http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### 4. **Test Admin Profile**
```bash
# Get admin profile:
curl -X GET http://localhost:3000/admin/auth/profile \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Frontend Testing

#### 1. **Complete OAuth2 Flow**
```javascript
// Navigate to admin login
window.location.href = 'http://localhost:3000/admin/auth/google';

// After OAuth2 callback, extract token from URL
const urlParams = new URLSearchParams(window.location.search);
const adminToken = urlParams.get('token');

if (adminToken) {
  localStorage.setItem('adminToken', adminToken);
  console.log('Admin token stored:', adminToken);
}
```

#### 2. **Test Admin API Calls**
```javascript
// Get admin dashboard
const adminToken = localStorage.getItem('adminToken');
fetch('http://localhost:3000/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
})
.then(response => response.json())
.then(data => console.log('Dashboard data:', data))
.catch(error => console.error('Error:', error));
```

## Troubleshooting

### Common Issues

1. **"Email not authorized"**
   - Check if your email is in `allowedEmails` array in `admin-auth.config.ts`
   - Ensure you're using the correct YouTube account email
   - Update the email in the config file and restart the server

2. **"Invalid admin token"**
   - Token may have expired (24 hours)
   - Check if you're using the correct admin token (not regular user token)
   - Re-authenticate through OAuth2 flow

3. **"redirect_uri_mismatch" error**
   - Google Console changes haven't propagated yet (wait 5 min - several hours)
   - Verify the exact callback URL in Google Console
   - Check for typos in the redirect URI

4. **Google OAuth2 errors**
   - Verify Google Client ID and Secret are correct
   - Check redirect URI matches exactly
   - Ensure Google+ API is enabled
   - Check if you're using the correct Google account

### Testing Checklist

- [ ] Google Console redirect URI added
- [ ] Email updated in `admin-auth.config.ts`
- [ ] Server restarted after config changes
- [ ] OAuth2 flow works (no redirect_uri_mismatch)
- [ ] Admin token generated successfully
- [ ] Token verification works
- [ ] Dashboard access works
- [ ] Admin profile endpoint works

## Integration with YouTube

This admin authentication system is designed to work with your existing YouTube integration. The admin user will be the same account used for YouTube API access, ensuring seamless integration between admin dashboard and YouTube features. 