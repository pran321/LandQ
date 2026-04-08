# Aadhaar Verification System

## Overview
The platform now requires Aadhaar verification for all buyers and sellers before they can engage in land transactions. This ensures authenticity and security for all parties involved.

## Features Implemented

### Backend Changes

1. **User Model Updates** (`backend/models/user.ts`)
   - Added `aadhaarNumber` field (12 digits, unique)
   - Added `aadhaarVerified` boolean flag
   - Added `aadhaarDocument` field for storing document path
   - Validation for 12-digit Aadhaar format

2. **Aadhaar Controller** (`backend/controller/aadhaarController.ts`)
   - `submitAadhaar`: Users submit Aadhaar number and document
   - `getAadhaarStatus`: Check verification status
   - `verifyAadhaar`: Admin approves/rejects Aadhaar (Admin only)
   - `getPendingVerifications`: List all pending verifications (Admin only)
   - `getVerifiedUsers`: List all verified users (Admin only)

3. **Aadhaar Routes** (`backend/routes/aadhaarRoutes.ts`)
   - POST `/api/aadhaar/submit` - Submit Aadhaar for verification
   - GET `/api/aadhaar/status` - Get verification status
   - GET `/api/aadhaar/pending` - Get pending verifications (Admin)
   - GET `/api/aadhaar/verified` - Get verified users (Admin)
   - PUT `/api/aadhaar/verify/:userId` - Verify/reject Aadhaar (Admin)

4. **Aadhaar Check Middleware** (`backend/middleware/aadhaarCheck.ts`)
   - `requireAadhaarVerification`: Middleware to check Aadhaar status
   - Blocks transactions if Aadhaar not submitted or not verified
   - Admin bypass for administrative actions

5. **Protected Routes**
   - Land creation (POST `/api/lands`)
   - Land updates (PUT `/api/lands/:id`)
   - Land deletion (DELETE `/api/lands/:id`)
   - Buyer lead creation (POST `/api/buyer-leads`)

### Frontend Changes

1. **Aadhaar Verification Page** (`frontend/src/pages/AadhaarVerification.tsx`)
   - Form to submit 12-digit Aadhaar number
   - Upload Aadhaar document (image or PDF)
   - Real-time validation
   - Status display (Not Submitted / Pending / Verified)
   - Visual feedback with color-coded badges

2. **Aadhaar Admin Page** (`frontend/src/pages/AadhaarAdmin.tsx`)
   - View pending verifications
   - View verified users
   - Approve/reject Aadhaar submissions
   - View uploaded documents in modal
   - Filter by status (pending/verified)

3. **Dashboard Updates** (`frontend/src/pages/Dashboard.tsx`)
   - Aadhaar status alerts
   - Prompts to verify Aadhaar if not done
   - Visual indicators for verification status
   - Quick link to verification page

4. **Admin Panel Updates** (`frontend/src/pages/AdminPanel.tsx`)
   - Added "Aadhaar Verification" tab
   - Quick access to Aadhaar management

5. **API Service** (`frontend/src/services/api.ts`)
   - Added `aadhaarService` with all necessary methods

## User Flow

### For Buyers/Sellers

1. **Register/Login** to the platform
2. **Navigate to Dashboard** - See Aadhaar verification alert
3. **Click "Verify Aadhaar Now"** or go to `/aadhaar-verification`
4. **Submit Aadhaar Details**:
   - Enter 12-digit Aadhaar number
   - Upload Aadhaar document (JPG, PNG, or PDF)
   - Submit for verification
5. **Wait for Admin Approval** (24-48 hours)
6. **Receive Verification** - Can now buy/sell land

### For Admins

1. **Login as Admin**
2. **Go to Admin Panel** → Click "Aadhaar Verification"
3. **Review Pending Verifications**:
   - View user details
   - Check Aadhaar number
   - View uploaded document
4. **Approve or Reject**:
   - Click "✓ Verify" to approve
   - Click "✗ Reject" to reject
5. **View Verified Users** in the "Verified" tab

## API Endpoints

### User Endpoints

```
POST /api/aadhaar/submit
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- aadhaarNumber: string (12 digits)
- aadhaarDocument: File (image or PDF, max 5MB)

Response:
{
  "message": "Aadhaar submitted successfully. Pending admin verification.",
  "user": {
    "aadhaarNumber": "123456789012",
    "aadhaarVerified": false,
    "aadhaarDocument": "/uploads/aadhaar/aadhaar-1234567890.jpg"
  }
}
```

```
GET /api/aadhaar/status
Authorization: Bearer <token>

Response:
{
  "aadhaarNumber": "123456789012",
  "aadhaarVerified": false,
  "aadhaarDocument": "/uploads/aadhaar/aadhaar-1234567890.jpg",
  "hasAadhaar": true
}
```

### Admin Endpoints

```
GET /api/aadhaar/pending
Authorization: Bearer <admin-token>

Response:
{
  "count": 5,
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "userType": "seller",
      "aadhaarNumber": "123456789012",
      "aadhaarDocument": "/uploads/aadhaar/aadhaar-1234567890.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

```
PUT /api/aadhaar/verify/:userId
Authorization: Bearer <admin-token>
Content-Type: application/json

Body:
{
  "verified": true
}

Response:
{
  "message": "Aadhaar verified successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "aadhaarNumber": "123456789012",
    "aadhaarVerified": true
  }
}
```

## Error Responses

### When Aadhaar Not Submitted
```json
{
  "message": "Aadhaar verification required. Please submit your Aadhaar details to proceed with land transactions.",
  "requiresAadhaar": true,
  "aadhaarSubmitted": false
}
```

### When Aadhaar Pending Verification
```json
{
  "message": "Your Aadhaar is pending verification. Please wait for admin approval before proceeding with land transactions.",
  "requiresAadhaar": true,
  "aadhaarSubmitted": true,
  "aadhaarVerified": false
}
```

## Security Features

1. **Unique Aadhaar Numbers**: Each Aadhaar can only be registered once
2. **12-Digit Validation**: Strict format validation
3. **Secure File Upload**: 5MB limit, only images and PDFs allowed
4. **Admin-Only Verification**: Only admins can approve/reject
5. **Encrypted Storage**: Aadhaar documents stored securely
6. **Transaction Blocking**: Cannot buy/sell without verification

## File Storage

- Aadhaar documents are stored in: `uploads/aadhaar/`
- Naming format: `aadhaar-{timestamp}-{random}.{ext}`
- Accessible via: `http://localhost:5000/uploads/aadhaar/{filename}`

## Testing

### Test as User

1. Register as a buyer or seller
2. Go to `/aadhaar-verification`
3. Submit Aadhaar: `123456789012`
4. Upload a test document
5. Try to create a land listing or buyer lead (should be blocked)
6. Wait for admin verification

### Test as Admin

1. Login as admin
2. Go to `/admin/aadhaar`
3. View pending verifications
4. Click "View Document" to see uploaded file
5. Click "✓ Verify" to approve
6. Check user can now create listings/leads

## Database Schema

```typescript
{
  aadhaarNumber: {
    type: String,
    unique: true,
    sparse: true,
    validate: /^\d{12}$/
  },
  aadhaarVerified: {
    type: Boolean,
    default: false
  },
  aadhaarDocument: {
    type: String,
    default: null
  }
}
```

## Notes

- Admin users bypass Aadhaar verification requirements
- Users can view their verification status anytime
- Pending verifications are sorted by submission date
- Documents are viewable in a modal for easy review
- Real-time status updates after verification
- Color-coded alerts for different verification states
