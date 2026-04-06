# Google Authentication Setup Guide

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create a New Project (or select existing)
1. Click on project dropdown at top
2. Click "New Project"
3. Name it: "Land Selling Website"
4. Click "Create"

### 1.3 Enable Google+ API
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### 1.4 Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: Land Selling Website
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue"
   - Scopes: Add email, profile, openid
   - Click "Save and Continue"
   - Test users: Add your email (for testing)
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: Web application
   - Name: Land Selling Website
   - Authorized JavaScript origins:
     - http://localhost:5173
     - http://localhost:3000
   - Authorized redirect URIs:
     - http://localhost:5000/api/auth/google/callback
     - http://localhost:5000/api/auth/google/redirect
   - Click "Create"

5. Copy your credentials:
   - Client ID: (looks like: xxxxx.apps.googleusercontent.com)
   - Client Secret: (random string)

### 1.5 Add to .env file
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## Step 2: Install Required Packages

```bash
cd backend
npm install passport passport-google-oauth20 @types/passport @types/passport-google-oauth20
```

---

## Step 3: Backend Implementation

Files to create/modify:
1. `backend/config/passport.ts` - Passport configuration
2. `backend/controller/authController.ts` - Add Google auth methods
3. `backend/routes/auth.ts` - Add Google auth routes
4. `backend/models/user.ts` - Add googleId field
5. `backend/index.ts` - Initialize passport

---

## Step 4: Frontend Implementation

Files to modify:
1. `frontend/src/pages/Login.tsx` - Add Google login button
2. `frontend/src/pages/Register.tsx` - Add Google signup button

---

## Step 5: Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Click "Sign in with Google"
4. Authorize the app
5. You should be logged in!

---

## Production Setup

When deploying to production:

1. Update Google Console:
   - Add production URLs to authorized origins
   - Add production callback URL
   
2. Update .env:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   ```

3. Update frontend redirect URL

---

## Troubleshooting

### Error: redirect_uri_mismatch
- Check that callback URL in Google Console matches exactly
- Include http:// or https://
- No trailing slashes

### Error: invalid_client
- Check Client ID and Secret are correct
- Check they're in .env file
- Restart backend server

### User not created
- Check MongoDB connection
- Check backend logs
- Verify user model has googleId field

---

## Security Notes

- Never commit .env file to git
- Keep Client Secret secure
- Use HTTPS in production
- Validate user data from Google
- Set proper CORS settings

---

## Next Steps

After Google Auth is working:
1. Add Facebook authentication
2. Add GitHub authentication
3. Add Apple Sign In
4. Add two-factor authentication
