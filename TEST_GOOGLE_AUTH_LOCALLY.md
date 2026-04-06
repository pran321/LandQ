# 🧪 Testing Google Authentication Locally - Complete Guide

## Yes! You can test it locally. Here's how:

---

## 📋 Prerequisites

- Node.js installed
- MongoDB running (you already have this)
- Google account
- 15 minutes of time

---

## 🚀 Step-by-Step Testing Guide

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install passport passport-google-oauth20 @types/passport @types/passport-google-oauth20
```

This installs the Google OAuth libraries.

---

### Step 2: Get Google OAuth Credentials (5 minutes)

#### 2.1 Go to Google Cloud Console
Open: https://console.cloud.google.com/

#### 2.2 Create a Project
1. Click the project dropdown at the top
2. Click "New Project"
3. Name it: **"Land Selling Website Test"**
4. Click "Create"
5. Wait for project to be created (30 seconds)

#### 2.3 Enable Google+ API
1. In the left menu, go to: **"APIs & Services"** → **"Library"**
2. Search for: **"Google+ API"**
3. Click on it
4. Click **"Enable"**
5. Wait for it to enable (30 seconds)

#### 2.4 Configure OAuth Consent Screen
1. Go to: **"APIs & Services"** → **"OAuth consent screen"**
2. Select: **"External"**
3. Click **"Create"**
4. Fill in:
   - App name: **Land Selling Website**
   - User support email: **your email**
   - Developer contact: **your email**
5. Click **"Save and Continue"**
6. On Scopes page: Click **"Add or Remove Scopes"**
   - Select: `email`, `profile`, `openid`
   - Click **"Update"**
   - Click **"Save and Continue"**
7. On Test users page: Click **"Add Users"**
   - Add your email address
   - Click **"Add"**
   - Click **"Save and Continue"**
8. Click **"Back to Dashboard"**

#### 2.5 Create OAuth Client ID
1. Go to: **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select Application type: **"Web application"**
4. Name: **"Land Selling Website Local"**
5. Under **"Authorized JavaScript origins"**, click **"Add URI"**:
   ```
   http://localhost:5173
   ```
6. Under **"Authorized redirect URIs"**, click **"Add URI"**:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
7. Click **"Create"**
8. A popup will show your credentials:
   - **Client ID**: (looks like: 123456789-abc.apps.googleusercontent.com)
   - **Client Secret**: (random string like: GOCSPX-abc123)
   - **COPY BOTH** - you'll need them!

---

### Step 3: Update Your .env File

Open `backend/.env` and update these lines:

```env
PORT=5000
MONGO_URI=mongodb+srv://pranavtiwari8088_db_user:tFp8hoZUt8ECPybx@cluster0.5aukp6v.mongodb.net/land-selling
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

# Google OAuth - REPLACE WITH YOUR ACTUAL CREDENTIALS
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace `paste_your_client_id_here` and `paste_your_client_secret_here` with the actual values from Step 2.5!

---

### Step 4: Start Your Servers

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

---

### Step 5: Test Google Login! 🎉

#### 5.1 Open Your Browser
Go to: http://localhost:5173

#### 5.2 Click "Login"
You'll see the login page with:
- Email/password fields
- **"Sign in with Google"** button (new!)

#### 5.3 Click "Sign in with Google"
This will:
1. Redirect you to Google's login page
2. Show your Google accounts
3. Ask you to select an account

#### 5.4 Select Your Google Account
Choose the email you added as a test user in Step 2.4

#### 5.5 Authorize the App
Google will show:
- "Land Selling Website wants to access your Google Account"
- Permissions: View your email, View your profile
- Click **"Continue"** or **"Allow"**

#### 5.6 Success!
You should be:
1. Redirected back to your website
2. See a loading message: "Completing Google sign in..."
3. Redirected to the Dashboard
4. **Logged in!** 🎉

---

## ✅ Verification Checklist

After successful login, verify:

### 1. Check Frontend
- [ ] You're on the Dashboard page
- [ ] Your name appears in the navbar
- [ ] You can see "Saved Lands" tab

### 2. Check MongoDB
Open MongoDB Compass or mongosh:
```bash
mongosh "mongodb+srv://pranavtiwari8088_db_user:tFp8hoZUt8ECPybx@cluster0.5aukp6v.mongodb.net/land-selling"

use land-selling
db.users.find().pretty()
```

You should see a new user with:
- `googleId`: "123456789..."
- `authProvider`: "google"
- `email`: your Google email
- `name`: your Google name
- `profilePicture`: your Google profile picture URL

### 3. Check Browser
Open DevTools (F12) → Application → Local Storage:
- [ ] `token` is stored
- [ ] Token is a long JWT string

### 4. Test Logout and Re-login
- [ ] Click "Logout"
- [ ] Click "Login" again
- [ ] Click "Sign in with Google"
- [ ] Should login instantly (no authorization needed)

---

## 🎯 What You Can Test

### Test Case 1: New User Registration
1. Use a Google account that's NOT in your database
2. Click "Sign in with Google"
3. Verify new user is created in MongoDB

### Test Case 2: Existing User Login
1. Login with Google once (creates user)
2. Logout
3. Login with Google again
4. Should login instantly

### Test Case 3: Account Linking
1. Register normally with email: test@example.com
2. Logout
3. Try "Sign in with Google" using test@example.com
4. Should link Google account to existing user

### Test Case 4: Profile Picture
1. Login with Google
2. Check if your Google profile picture appears in navbar
3. Go to Dashboard - should see your picture

### Test Case 5: Register Page
1. Go to Register page
2. Click "Sign up with Google"
3. Should work the same as login

---

## 🐛 Troubleshooting

### Issue 1: "redirect_uri_mismatch"
**Error**: The redirect URI in the request does not match

**Solution**:
1. Go back to Google Console → Credentials
2. Edit your OAuth Client ID
3. Make sure redirect URI is EXACTLY:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
4. No trailing slash, no typos
5. Save and try again

### Issue 2: "invalid_client"
**Error**: The OAuth client was not found

**Solution**:
1. Check `backend/.env` file
2. Make sure Client ID and Secret are correct
3. No extra spaces or quotes
4. Restart backend server: `npm run dev`

### Issue 3: "Access blocked: This app's request is invalid"
**Error**: Google shows this error

**Solution**:
1. Go to Google Console → OAuth consent screen
2. Make sure your email is added as a test user
3. Make sure app is in "Testing" mode (not "Production")

### Issue 4: Button doesn't work
**Symptom**: Clicking Google button does nothing

**Solution**:
1. Open browser console (F12)
2. Check for errors
3. Verify backend is running on port 5000
4. Check `VITE_API_URL` in frontend

### Issue 5: Stuck on "Completing Google sign in..."
**Symptom**: Loading forever

**Solution**:
1. Check browser console for errors
2. Verify `/api/auth/me` endpoint works
3. Check backend logs for errors
4. Make sure MongoDB is connected

### Issue 6: "User not created"
**Symptom**: Login works but no user in database

**Solution**:
1. Check backend logs
2. Verify MongoDB connection
3. Check User model has `googleId` field
4. Try restarting backend

---

## 📊 Expected Flow (Visual)

```
Browser                Backend              Google              MongoDB
   |                      |                    |                    |
   |--Click Google------->|                    |                    |
   |                      |                    |                    |
   |                      |--Redirect--------->|                    |
   |                      |                    |                    |
   |<-----------------Google Login Page--------|                    |
   |                      |                    |                    |
   |--Select Account----->|                    |                    |
   |                      |                    |                    |
   |--Authorize---------->|                    |                    |
   |                      |                    |                    |
   |                      |<--User Data--------|                    |
   |                      |                    |                    |
   |                      |--Create/Find User---------------->|     |
   |                      |                    |                    |
   |                      |<--User Saved-----------------------|    |
   |                      |                    |                    |
   |<--Redirect + Token---|                    |                    |
   |                      |                    |                    |
   |--Fetch User Data---->|                    |                    |
   |                      |                    |                    |
   |<--User Info----------|                    |                    |
   |                      |                    |                    |
   [LOGGED IN!]           |                    |                    |
```

---

## 🎓 Understanding the Code

### Backend Flow:

1. **User clicks button** → Frontend redirects to `/api/auth/google`
2. **Passport middleware** → Redirects to Google login
3. **Google callback** → `/api/auth/google/callback` receives user data
4. **Passport strategy** → `backend/config/passport.ts` processes user:
   - Checks if user exists by `googleId`
   - If not, checks by `email`
   - Creates new user or links account
5. **Auth controller** → Generates JWT token
6. **Redirect** → Sends user back to frontend with token

### Frontend Flow:

1. **GoogleLoginButton** → Redirects to backend
2. **GoogleCallback page** → Receives token from URL
3. **Stores token** → In localStorage
4. **Fetches user** → Calls `/api/auth/me`
5. **Updates context** → AuthContext with user data
6. **Redirects** → To dashboard

---

## 🔒 Security Notes

### What's Secure:
- ✅ OAuth 2.0 protocol (industry standard)
- ✅ JWT tokens for authentication
- ✅ No password storage for Google users
- ✅ Email verified by Google
- ✅ Secure callback validation

### What to Know:
- Google credentials are in `.env` (never commit!)
- Tokens expire after 30 days
- Test users only work in development
- Production requires app verification

---

## 📝 Testing Checklist

Before considering it "done":

- [ ] Dependencies installed
- [ ] Google credentials obtained
- [ ] .env file updated
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Google button visible on login page
- [ ] Google button visible on register page
- [ ] Can click Google button
- [ ] Redirects to Google login
- [ ] Can select Google account
- [ ] Can authorize app
- [ ] Redirects back to website
- [ ] Shows loading message
- [ ] Redirects to dashboard
- [ ] User is logged in
- [ ] Name appears in navbar
- [ ] User in MongoDB with googleId
- [ ] Can logout
- [ ] Can login again with Google
- [ ] Profile picture shows (if available)

---

## 🎉 Success!

If all tests pass, you have successfully:
- ✅ Integrated Google OAuth 2.0
- ✅ Tested locally
- ✅ Verified user creation
- ✅ Confirmed authentication flow

**Your Google Authentication is working!** 🚀

---

## 🌐 Next Steps

### For Production:
1. Add production URLs to Google Console
2. Submit app for verification (if needed)
3. Update .env with production URLs
4. Enable HTTPS

### Additional Features:
1. Add Facebook login
2. Add GitHub login
3. Add Apple Sign In
4. Add two-factor authentication

---

## 📞 Need Help?

If you encounter issues:
1. Check backend logs
2. Check browser console
3. Review this guide
4. Check `GOOGLE_AUTH_COMPLETE_GUIDE.md`
5. Verify Google Console settings

---

**Happy Testing! 🎉**
