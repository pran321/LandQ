# Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher) - [Download](https://nodejs.org/)
- MongoDB (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- npm (comes with Node.js) or yarn
- Git (optional, for version control)

## Step-by-Step Setup

### 1. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```
3. Verify MongoDB is running:
   ```bash
   mongosh
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Get your connection string
4. Whitelist your IP address
5. Create a database user

### 2. Backend Setup

1. Open terminal and navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/land-selling
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/land-selling
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=development
   ```

5. Create uploads directory for images:
   ```bash
   mkdir uploads
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

7. You should see:
   ```
   Server is running on port 5000
   MongoDB connected successfully
   ```

8. Test the API:
   ```bash
   curl http://localhost:5000/api/health
   ```

### 3. Frontend Setup

1. Open a new terminal window and navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

6. You should see:
   ```
   VITE v5.1.0  ready in XXX ms
   ➜  Local:   http://localhost:3000/
   ```

7. Open your browser and visit: `http://localhost:3000`

### 4. Create Admin Account

1. Register a new user through the UI or API
2. Connect to MongoDB:
   ```bash
   mongosh
   ```

3. Switch to your database:
   ```javascript
   use land-selling
   ```

4. Update user role to admin:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

5. Verify the update:
   ```javascript
   db.users.findOne({ email: "your-email@example.com" })
   ```

### 5. Testing the Application

1. Register a new user account
2. Login with your credentials
3. Browse land listings
4. Login as admin to add new lands
5. Test all features:
   - View land details
   - Save lands
   - Contact sellers
   - Admin panel (if admin)

## Common Issues and Solutions

### Issue: MongoDB Connection Error
**Solution**: 
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- For Atlas, verify IP whitelist and credentials

### Issue: Port Already in Use
**Solution**:
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Issue: Module Not Found
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Images Not Uploading
**Solution**:
- Ensure `uploads/` directory exists in backend
- Check file permissions
- Verify multer configuration

### Issue: CORS Errors
**Solution**:
- Ensure backend CORS is configured correctly
- Check VITE_API_URL in frontend .env
- Restart both servers

## Production Deployment

### Backend Deployment (Example: Heroku)

1. Create Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:
   ```bash
   heroku config:set MONGO_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Example: Vercel)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

3. Set environment variable in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.herokuapp.com
   ```

## Development Tips

1. Use MongoDB Compass for visual database management
2. Use Postman for API testing (import POSTMAN_COLLECTION.json)
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Use React DevTools for debugging React components

## Next Steps

- Customize the UI with your branding
- Add more features (reviews, ratings, etc.)
- Implement email notifications
- Add payment integration
- Enhance security measures
- Add unit and integration tests

## Support

For issues or questions:
1. Check the README.md
2. Review API_DOCUMENTATION.md
3. Check console logs for errors
4. Verify all environment variables are set correctly
