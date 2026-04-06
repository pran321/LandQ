#!/bin/bash

echo "🔐 Installing Google Authentication..."
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install passport passport-google-oauth20 @types/passport @types/passport-google-oauth20

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Get Google OAuth credentials from: https://console.cloud.google.com/"
echo "2. Update backend/.env with your credentials:"
echo "   GOOGLE_CLIENT_ID=your_client_id"
echo "   GOOGLE_CLIENT_SECRET=your_client_secret"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo "5. Test by clicking 'Sign in with Google' on login page"
echo ""
echo "📚 Full guide: GOOGLE_AUTH_COMPLETE_GUIDE.md"
