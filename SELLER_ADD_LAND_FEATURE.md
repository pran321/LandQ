# Seller Add Land Feature

## Overview
Sellers can now add land listings with descriptions and all necessary details through a dedicated form.

## Changes Made

### Backend Changes

1. **Updated Authorization Middleware** (`backend/middleware/auth.ts`)
   - Modified `authorize` function to support both `UserRole` and `UserType`
   - Now accepts sellers and admins for land creation

2. **Updated Land Routes** (`backend/routes/landRoutes.ts`)
   - Changed POST `/api/lands` route to allow both `ADMIN` and `SELLER` user types
   - Sellers can now create land listings

### Frontend Changes

1. **New Page: AddLand** (`frontend/src/pages/AddLand.tsx`)
   - Complete form for adding land listings
   - Fields include:
     - Title and description
     - Price, size, length, breadth
     - Location details (city, state, address)
     - Land type (residential, commercial, agricultural, industrial, mixed)
     - Amenities (comma-separated)
     - Status (available, pending, sold)
     - Images (up to 10)
     - Documents (up to 5)
     - Optional: latitude and longitude

2. **Updated App Routes** (`frontend/src/App.tsx`)
   - Added `/add-land` route (protected)

3. **Updated Dashboard** (`frontend/src/pages/Dashboard.tsx`)
   - Added "Add New Land" button in the "My Lands" tab for sellers
   - Shows empty state with call-to-action when no lands exist

4. **Updated Navbar** (`frontend/src/components/Navbar.tsx`)
   - Added "➕ Add Land" button for sellers (visible when logged in as seller)

## How to Use

### For Sellers:

1. **Login as a seller** (userType: 'seller')

2. **Access the Add Land form** via:
   - Click "➕ Add Land" button in the navbar
   - Go to Dashboard → My Lands tab → Click "Add New Land"
   - Navigate directly to `/add-land`

3. **Fill in the form**:
   - Required fields: title, description, price, size, length, breadth, location, city, state
   - Optional: images, documents, amenities, coordinates

4. **Submit** to create the listing

5. **View your listings** in Dashboard → My Lands tab

## API Endpoint

```
POST /api/lands
Authorization: Bearer <token>
Content-Type: multipart/form-data

Required fields:
- title: string
- description: string
- price: number
- size: number
- length: number
- breadth: number
- location: string
- city: string
- state: string
- landType: 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'mixed'

Optional fields:
- lat: number
- long: number
- amenities: string[]
- status: 'available' | 'pending' | 'sold'
- images: File[] (max 10)
- documents: File[] (max 5)
```

## Testing

1. Register/login as a seller
2. Navigate to `/add-land`
3. Fill in the form with test data
4. Upload test images (optional)
5. Submit and verify the land appears in "My Lands" tab
6. Verify the land appears in the public land listings

## Notes

- Area is automatically calculated from length × breadth
- Seller ID is automatically attached from the authenticated user
- Images are stored in `uploads/lands/`
- Documents are stored in `uploads/documents/`
- All file uploads have a 10MB limit
