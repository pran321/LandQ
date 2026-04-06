# Quick Start Guide

Get the Land Selling Platform up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (should be v18+)
node --version

# Check npm
npm --version

# Check MongoDB (if using local)
mongosh --version
```

## Installation

### Option 1: Quick Install (Recommended)

```bash
# Install all dependencies at once
npm run install-all
```

### Option 2: Manual Install

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

## Configuration

### 1. Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/land-selling
JWT_SECRET=my-super-secret-key
NODE_ENV=development
```

### 2. Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

## Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Seller user: `seller@example.com` / `seller123`
- Buyer user: `buyer@example.com` / `buyer123`
- 3 sample land listings

## Start Development Servers

### Option 1: Start Both (from root)

```bash
npm run dev
```

### Option 2: Start Separately

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## First Steps

1. Open http://localhost:3000
2. Click "Register" to create an account
3. Login with your credentials
4. Browse land listings
5. To access admin features:
   - Login as admin (if you seeded data)
   - OR manually update your user role in MongoDB

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get lands
curl http://localhost:5000/api/lands
```

### Using Postman

1. Import `POSTMAN_COLLECTION.json`
2. Set `base_url` variable to `http://localhost:5000`
3. Test all endpoints

## Common Commands

```bash
# Backend
cd backend
npm run dev          # Start dev server
npm run build        # Build for production
npm run seed         # Seed sample data

# Frontend
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Root
npm run install-all  # Install all dependencies
npm run dev          # Start both servers
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port in backend/.env
PORT=5001
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Application is running
2. 📖 Read [README.md](README.md) for full documentation
3. 🔧 Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
4. 📚 Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
5. 🚀 Start building your features!

## Project Structure

```
land-selling-platform/
├── backend/           # Node.js + Express API
│   ├── config/       # Database config
│   ├── controller/   # Route controllers
│   ├── middleware/   # Auth, upload, errors
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── seeders/      # Sample data
├── frontend/         # React + TypeScript
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── public/
└── docs/             # Documentation

```

## Support

Need help?
- Check the [README.md](README.md)
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Check console logs for errors
- Verify environment variables

## Features Overview

✅ User authentication (JWT)
✅ Role-based access (User/Admin)
✅ Land CRUD operations
✅ Image uploads
✅ Advanced filtering
✅ Save favorite lands
✅ Contact sellers
✅ Responsive UI
✅ TypeScript
✅ Error handling
✅ Loading states

Happy coding! 🚀
