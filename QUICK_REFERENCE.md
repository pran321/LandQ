# 🚀 Quick Reference Guide

## Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## Admin Credentials

```
Email: purav@admin.com
Password: 123456
```

---

## Test Features Quickly

### 1. Upload Images (2 minutes)
1. Login as admin
2. Admin Panel → Add New Land
3. Fill form → Upload images → Submit

### 2. Advanced Search (1 minute)
1. Browse Lands
2. Search "farm" → Filter by type → Sort by price

### 3. Save Lands (1 minute)
1. Login as any user
2. Browse Lands → Click ❤️ icon
3. Dashboard → View saved lands

---

## New Features Added

| Feature | Status | Location |
|---------|--------|----------|
| Image Upload | ✅ Working | Admin Panel |
| Document Upload | ✅ Working | Admin Panel |
| Advanced Search | ✅ Working | Land Listing |
| Pagination | ✅ Working | Land Listing |
| Land Types | ✅ Working | Admin Panel |
| Featured Lands | ✅ Working | Admin Panel |
| View Tracking | ✅ Working | Auto |
| User Profile API | ✅ Ready | Backend |
| Price Offers API | ✅ Ready | Backend |
| Reviews API | ✅ Ready | Backend |
| Comparisons API | ✅ Ready | Backend |
| Notes API | ✅ Ready | Backend |
| Analytics API | ✅ Ready | Backend |

---

## API Endpoints Quick List

### Lands
```
GET    /api/lands?search=&landType=&sortBy=&page=
POST   /api/lands (with FormData)
GET    /api/lands/:id
PUT    /api/lands/:id
DELETE /api/lands/:id
```

### User Profile
```
GET /api/user/profile
PUT /api/user/profile (with FormData)
PUT /api/user/change-password
```

### Price Offers
```
POST   /api/price-offers
GET    /api/price-offers/my-offers
GET    /api/price-offers/received
PUT    /api/price-offers/:id/respond
DELETE /api/price-offers/:id
```

### Reviews
```
POST   /api/reviews
GET    /api/reviews/land/:landId
PUT    /api/reviews/:id
DELETE /api/reviews/:id
```

### Comparisons
```
POST   /api/comparisons
GET    /api/comparisons
GET    /api/comparisons/:id
DELETE /api/comparisons/:id
```

### Analytics
```
GET /api/analytics/admin
GET /api/analytics/seller
```

---

## File Upload Limits

- **Images**: 10 max, 5MB each
- **Documents**: 5 max, 10MB each
- **Profile Picture**: 1, 2MB

---

## Search Parameters

```javascript
{
  search: 'keyword',        // Searches title, description, city, state
  city: 'Chicago',          // Filter by city
  landType: 'residential',  // residential, commercial, agricultural, industrial, mixed
  minPrice: 50000,          // Minimum price
  maxPrice: 500000,         // Maximum price
  minSize: 1000,            // Minimum size (sq ft)
  maxSize: 10000,           // Maximum size (sq ft)
  sortBy: 'price_asc',      // createdAt, price_asc, price_desc, size_asc, size_desc, views, featured
  page: 1,                  // Page number
  limit: 12                 // Items per page
}
```

---

## Database Collections

- `users` - User accounts
- `lands` - Land listings
- `savedlands` - Saved/favorited lands
- `savedlandnotes` - Notes on saved lands
- `buyerleads` - Buyer inquiries
- `priceoffers` - Price negotiation offers
- `reviews` - Land reviews and ratings
- `comparisons` - Land comparisons

---

## Common Tasks

### Add Sample Data
```bash
cd backend
npm run seed
```

### Check Backend Logs
```bash
cd backend
npm run dev
# Watch terminal for logs
```

### Clear Database
```bash
# Connect to MongoDB
mongosh "your_mongodb_uri"
use landQ
db.dropDatabase()
```

### Test API with Postman
Import `POSTMAN_COLLECTION.json`

---

## Troubleshooting

### Images not uploading?
- Check `backend/uploads/lands/` exists
- Verify file size < 5MB
- Check backend logs

### Search not working?
- Verify MongoDB connection
- Check backend logs
- Test with simple keywords

### Can't login?
- Run seeder: `npm run seed`
- Use admin: purav@admin.com / 123456

---

## File Structure

```
backend/
├── models/           # Database models
├── controller/       # Business logic
├── routes/          # API routes
├── middleware/      # Auth, upload, errors
├── uploads/         # Uploaded files
│   ├── lands/       # Land images
│   ├── profiles/    # Profile pictures
│   └── documents/   # Land documents
└── index.ts         # Main server file

frontend/
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── services/    # API services
│   └── context/     # React context
└── public/          # Static files
```

---

## Next Steps

1. ✅ Test image upload
2. ✅ Test advanced search
3. ⏳ Create User Profile page
4. ⏳ Create Seller Analytics page
5. ⏳ Create Price Offer modal
6. ⏳ Add Review section to Land Details
7. ⏳ Create Comparison page
8. ⏳ Add toast notifications

---

## Documentation Files

- `README.md` - Project overview
- `IMPLEMENTATION_SUMMARY.md` - What was implemented
- `COMPLETE_FEATURES_GUIDE.md` - Detailed feature guide
- `NEW_FEATURES_IMPLEMENTATION.md` - Technical details
- `QUICK_REFERENCE.md` - This file
- `API_DOCUMENTATION.md` - API endpoints
- `SAVE_FEATURE_GUIDE.md` - Save feature guide

---

## Support

Check these files for help:
1. Backend logs
2. Browser console
3. MongoDB data
4. Documentation files above

---

**Everything is ready to use! Start testing and building the remaining frontend components.** 🎉
