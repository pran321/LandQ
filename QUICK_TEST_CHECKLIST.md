# ✅ Quick Test Checklist - Google Auth

## Before You Start
- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Google account ready
- [ ] 15 minutes available

---

## Installation (2 minutes)

```bash
cd backend
npm install passport passport-google-oauth20 @types/passport @types/passport-google-oauth20
```

---

## Google Console Setup (5 minutes)

### Quick Steps:
1. [ ] Go to https://console.cloud.google.com/
2. [ ] Create project: "Land Selling Website Test"
3. [ ] Enable "Google+ API"
4. [ ] Configure OAuth consent screen:
   - [ ] Type: External
   - [ ] Add your email as test user
5. [ ] Create OAuth Client ID:
   - [ ] Type: Web application
   - [ ] Redirect URI: `http://localhost:5000/api/auth/google/callback`
6. [ ] Copy Client ID and Secret

---

## Configuration (1 minute)

### Update `backend/.env`:
```env
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

---

## Start Servers (1 minute)

### Terminal 1:
```bash
cd backend
npm run dev
```
✅ Should see: "Server is running on port 5000"

### Terminal 2:
```bash
cd frontend
npm run dev
```
✅ Should see: "Local: http://localhost:5173/"

---

## Test (2 minutes)

1. [ ] Open http://localhost:5173
2. [ ] Click "Login"
3. [ ] See "Sign in with Google" button
4. [ ] Click the button
5. [ ] Redirected to Google login
6. [ ] Select your Google account
7. [ ] Click "Continue" to authorize
8. [ ] Redirected back to website
9. [ ] See "Completing Google sign in..."
10. [ ] Redirected to Dashboard
11. [ ] **YOU'RE LOGGED IN!** 🎉

---

## Verify (1 minute)

- [ ] Your name appears in navbar
- [ ] Can see Dashboard
- [ ] Can logout
- [ ] Can login again with Google

---

## Common Issues

### "redirect_uri_mismatch"
→ Check redirect URI in Google Console is exactly:
`http://localhost:5000/api/auth/google/callback`

### "invalid_client"
→ Check Client ID/Secret in .env, restart backend

### Button doesn't work
→ Check backend is running, check browser console

---

## Success Indicators

✅ Google button visible
✅ Redirects to Google
✅ Can authorize app
✅ Redirects to dashboard
✅ User logged in
✅ Name in navbar
✅ User in MongoDB

---

## Total Time: ~10-15 minutes

**That's it! You can test Google Auth locally.** 🚀

For detailed guide: `TEST_GOOGLE_AUTH_LOCALLY.md`
