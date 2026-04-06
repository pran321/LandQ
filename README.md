# Land Selling Website - MERN Stack

A full-featured land selling platform built with MongoDB, Express.js, React.js, and Node.js.

## Features

### User Features
- User registration and login with JWT authentication
- Browse all land listings with filters (price, location, size)
- View detailed land information
- Save favorite lands
- Contact sellers through inquiry forms
- Personal dashboard to manage saved lands and inquiries

### Admin Features
- Add new land listings with image uploads
- Edit existing land listings
- Delete land listings
- Manage all properties on the platform

## Tech Stack

### Frontend
- React.js with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- TypeScript

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── database.ts
│   ├── controller/
│   │   ├── authController.ts
│   │   ├── landController.ts
│   │   ├── userController.ts
│   │   ├── savedLandsController.ts
│   │   └── buyerLeadsController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── upload.ts
│   ├── models/
│   │   ├── user.ts
│   │   ├── land.ts
│   │   ├── savedLands.ts
│   │   └── buyerLeads.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── userRoutes.ts
│   │   ├── landRoutes.ts
│   │   ├── savedLandsRoutes.ts
│   │   └── buyerLeadsRoutes.ts
│   ├── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── LandCard.tsx
    │   │   ├── Navbar.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── LandListing.tsx
    │   │   ├── LandDetails.tsx
    │   │   ├── Dashboard.tsx
    │   │   └── AdminPanel.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    └── vite.config.ts
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/land-selling
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

5. Create uploads directory:
```bash
mkdir uploads
```

6. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```
VITE_API_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (protected)
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `DELETE /api/users/account` - Delete user account (protected)

### Lands
- `GET /api/lands` - Get all lands (with filters)
- `GET /api/lands/:id` - Get land by ID
- `POST /api/lands` - Create land (admin only)
- `PUT /api/lands/:id` - Update land (admin/owner)
- `DELETE /api/lands/:id` - Delete land (admin/owner)
- `GET /api/lands/my-lands` - Get user's lands (protected)

### Saved Lands
- `POST /api/saved-lands` - Save a land (protected)
- `GET /api/saved-lands` - Get saved lands (protected)
- `DELETE /api/saved-lands/:landId` - Unsave land (protected)

### Buyer Leads
- `POST /api/buyer-leads` - Create lead (protected)
- `GET /api/buyer-leads/my-leads` - Get user's leads (protected)
- `GET /api/buyer-leads/received` - Get leads for user's lands (protected)
- `PUT /api/buyer-leads/:id/status` - Update lead status (protected)
- `DELETE /api/buyer-leads/:id` - Delete lead (protected)

## Example API Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Lands
```bash
curl http://localhost:5000/api/lands
```

### Create Land (Admin)
```bash
curl -X POST http://localhost:5000/api/lands \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Beautiful Farm Land" \
  -F "description=Perfect for agriculture" \
  -F "price=50000" \
  -F "size=5000" \
  -F "length=100" \
  -F "breadth=50" \
  -F "location=Rural Area" \
  -F "city=Springfield" \
  -F "state=Illinois" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

## Default Admin Account

To create an admin account, register a user and manually update the role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Features Implemented

✅ User authentication with JWT
✅ Password hashing with bcrypt
✅ Role-based access control (User/Admin)
✅ Land CRUD operations
✅ Image upload with Multer
✅ Advanced filtering (price, location, size)
✅ Saved lands functionality
✅ Buyer leads/inquiry system
✅ Protected routes
✅ Responsive UI with Tailwind CSS
✅ Error handling
✅ Loading states
✅ Soft delete functionality
✅ TypeScript for type safety

## License

MIT
