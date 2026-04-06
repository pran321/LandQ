# Backend - Land Selling Platform

## Structure

```
backend/
├── config/          # Configuration files
├── controller/      # Request handlers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── seeders/         # Database seeders
├── uploads/         # Uploaded images
├── index.ts         # Entry point
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

## Environment Variables

Create a `.env` file with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/land-selling
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## API Routes

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout user

### Lands
- GET `/api/lands` - Get all lands
- GET `/api/lands/:id` - Get land by ID
- POST `/api/lands` - Create land (admin)
- PUT `/api/lands/:id` - Update land
- DELETE `/api/lands/:id` - Delete land
- GET `/api/lands/my-lands` - Get user's lands

### Saved Lands
- POST `/api/saved-lands` - Save land
- GET `/api/saved-lands` - Get saved lands
- DELETE `/api/saved-lands/:landId` - Unsave land

### Buyer Leads
- POST `/api/buyer-leads` - Create lead
- GET `/api/buyer-leads/my-leads` - Get user's leads
- GET `/api/buyer-leads/received` - Get received leads
- PUT `/api/buyer-leads/:id/status` - Update lead status
- DELETE `/api/buyer-leads/:id` - Delete lead

## Models

### User
- name, email, password, role, phone
- Roles: user, admin
- Password hashing with bcrypt

### Land
- title, description, price, size, dimensions
- location, city, state, coordinates
- images, seller reference, status

### SavedLands
- userId, landId references

### BuyerLeads
- buyerId, landId, message, status

## Middleware

### Authentication
- JWT token verification
- Role-based authorization

### Upload
- Multer for image uploads
- File type validation
- Size limits

### Error Handler
- Centralized error handling
- Validation errors
- Database errors
