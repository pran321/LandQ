# 🔑 How to Get Google OAuth Credentials (5 Minutes)

## The Error You Saw

```
TypeError: OAuth2Strategy requires a clientID option
```

This means you need to add real Google credentials to your `.env` file.

---

## 🚀 Quick Fix (Choose One)

### Option 1: Get Google Credentials (5 minutes) - RECOMMENDED

Follow the steps below to get real credentials.

### Option 2: Test Without Google Auth (Right Now)

The app will now work without Google credentials! 
- ✅ Backend will start successfully
- ✅ Regular login/register works
- ⚠️ Google button will show "not configured" message
- 📝 Add credentials later when ready

---

## 📋 Step-by-Step: Get Google Credentials

### Step 1: Go to Google Cloud Console (30 seconds)

Open this link: https://console.cloud.google.com/

Sign in with your Google account.

---

### Step 2: Create a Project (1 minute)

1. Click the **project dropdown** at the top (next to "Google Cloud")
2. Click **"New Project"**
3. Enter project name: **"LandQ Website"**
4. Click **"Create"**
5. Wait 30 seconds for project to be created
6. Select your new project from the dropdown

---

### Step 3: Enable Google+ API (1 minute)

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. In the search box, type: **"Google+ API"**
3. Click on **"Google+ API"** in the results
4. Click the blue **"Enable"** button
5. Wait for it to enable (30 seconds)

---

### Step 4: Configure OAuth Consent Screen (2 minutes)

1. In the left sidebar, click **"OAuth consent screen"**
2. Select **"External"** (for testing)
3. Click **"Create"**

**Fill in the form:**
- App name: **LandQ Website**
- User support email: **your email** (select from dropdown)
- App logo: (skip for now)
- App domain: (skip for now)
- Developer contact: **your email**

4. Click **"Save and Continue"**

**Scopes page:**
5. Click **"Add or Remove Scopes"**
6. Select these scopes:
   - ✅ `.../auth/userinfo.email`
   - ✅ `.../auth/userinfo.profile`
   - ✅ `openid`
7. Click **"Update"**
8. Click **"Save and Continue"**

**Test users page:**
9. Click **"Add Users"**
10. Enter your email address
11. Click **"Add"**
12. Click **"Save and Continue"**
13. Click **"Back to Dashboard"**

---

### Step 5: Create OAuth Client ID (1 minute)

1. In the left sidebar, click **"Credentials"**
2. Click **"Create Credentials"** (at the top)
3. Select **"OAuth client ID"**

**Configure the client:**
4. Application type: Select **"Web application"**
5. Name: **"LandQ Local Development"**

**Authorized JavaScript origins:**
6. Click **"Add URI"**
7. Enter: `http://localhost:5173`
8. Click **"Add URI"** again
9. Enter: `http://localhost:3000`

**Authorized redirect URIs:**
10. Click **"Add URI"**
11. Enter: `http://localhost:5000/api/auth/google/callback`

12. Click **"Create"**

---

### Step 6: Copy Your Credentials (30 seconds)

A popup will appear with your credentials:

```
Your Client ID
123456789-abcdefghijklmnop.apps.googleusercontent.com

Your Client Secret
GOCSPX-abc123def456ghi789
```

**IMPORTANT**: Copy both values! You'll need them in the next step.

---

### Step 7: Update Your .env File (30 seconds)

Open `backend/.env` and replace these lines:

```env
# Google OAuth
GOOGLE_CLIENT_ID=paste_your_actual_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_actual_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Example** (with fake credentials):
```env
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Save the file!**

---

### Step 8: Restart Backend (10 seconds)

Stop your backend (Ctrl+C) and start it again:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Google OAuth configured successfully
Server is running on port 5000
```

---

## ✅ Test It!

1. Open http://localhost:5173/login
2. Click **"Sign in with Google"**
3. Select your Google account
4. Click **"Continue"**
5. You should be logged in! 🎉

---

## 🐛 Troubleshooting

### "redirect_uri_mismatch"

**Problem**: The redirect URI doesn't match.

**Solution**:
1. Go back to Google Console → Credentials
2. Click on your OAuth Client ID
3. Under "Authorized redirect URIs", make sure you have EXACTLY:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
4. No trailing slash, no typos
5. Click "Save"
6. Try again

### "Access blocked: This app's request is invalid"

**Problem**: OAuth consent screen not configured properly.

**Solution**:
1. Go to OAuth consent screen
2. Make sure your email is added as a test user
3. Make sure app status is "Testing"

### Still seeing the error?

**Check these:**
- [ ] Copied Client ID correctly (no extra spaces)
- [ ] Copied Client Secret correctly (no extra spaces)
- [ ] Saved the .env file
- [ ] Restarted the backend server
- [ ] No quotes around the values in .env

---

## 📸 Visual Guide

### What Google Console Looks Like:

**Step 1: Project Dropdown**
```
┌─────────────────────────────┐
│ Google Cloud  [My Project ▼]│
│                              │
│  ┌────────────────────────┐ │
│  │ New Project            │ │
│  │ Select a project       │ │
│  └────────────────────────┘ │
└─────────────────────────────┘
```

**Step 5: Create Credentials**
```
┌─────────────────────────────────┐
│ Credentials                      │
│                                  │
│ [+ Create Credentials ▼]        │
│   ├─ API key                    │
│   ├─ OAuth client ID  ← Click   │
│   └─ Service account            │
└─────────────────────────────────┘
```

**Step 6: Your Credentials**
```
┌─────────────────────────────────┐
│ OAuth client created             │
│                                  │
│ Your Client ID                   │
│ 123456-abc.apps.googleusercontent│
│ [Copy] 📋                        │
│                                  │
│ Your Client Secret               │
│ GOCSPX-abc123                    │
│ [Copy] 📋                        │
│                                  │
│ [OK]                             │
└─────────────────────────────────┘
```

---

## 🎯 Quick Checklist

- [ ] Opened Google Cloud Console
- [ ] Created new project
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Added myself as test user
- [ ] Created OAuth Client ID
- [ ] Added redirect URI: `http://localhost:5000/api/auth/google/callback`
- [ ] Copied Client ID
- [ ] Copied Client Secret
- [ ] Updated backend/.env file
- [ ] Saved .env file
- [ ] Restarted backend server
- [ ] Saw "✅ Google OAuth configured successfully"
- [ ] Tested login with Google

---

## 💡 Pro Tips

1. **Keep Google Console open** while testing
2. **Use your personal email** as test user
3. **Copy credentials immediately** - you can't see Client Secret again
4. **No quotes needed** in .env file
5. **Restart backend** after changing .env

---

## 🎉 Success!

When you see this in your backend logs:
```
✅ Google OAuth configured successfully
Server is running on port 5000
```

You're ready to test! Click "Sign in with Google" and it should work.

---

## 📞 Still Having Issues?

If you're still stuck:
1. Check backend logs for specific errors
2. Check browser console (F12)
3. Verify .env file has no typos
4. Make sure you restarted the backend
5. Try a different browser

---

**Total Time: ~5 minutes**

Good luck! 🚀
