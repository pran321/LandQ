# Seller Received Inquiries Feature - Fixed

## Problem
Sellers couldn't see inquiries sent by buyers about their land listings. The Dashboard only showed "My Inquiries" which was for buyers to see their sent inquiries.

## Solution
Added a separate "Received Inquiries" tab for sellers to view and manage inquiries from buyers.

## Changes Made

### Frontend (`frontend/src/pages/Dashboard.tsx`)

1. **Added State for Received Leads**
   ```typescript
   const [receivedLeads, setReceivedLeads] = useState([]);
   ```

2. **Updated fetchData Function**
   - Added condition to fetch received leads for sellers
   - Calls `buyerLeadService.getLeadsForMyLands()` when on 'received' tab

3. **Updated Tabs Section**
   - Buyers see: "❤️ Saved Lands" + "📧 My Inquiries"
   - Sellers see: "❤️ Saved Lands" + "🏞️ My Lands" + "📬 Received Inquiries"

4. **Added Received Inquiries Tab Content**
   - Shows buyer information (name, email, phone, profile picture)
   - Displays buyer's message
   - Shows land details
   - Status badges (pending, contacted, interested, rejected)
   - Action buttons to update status:
     - "Mark as Contacted"
     - "Mark as Interested"
     - "Reject"

5. **Added handleUpdateLeadStatus Function**
   - Updates inquiry status
   - Refreshes data after update

### API Service (`frontend/src/services/api.ts`)
- Already had `getLeadsForMyLands()` method ✅

## How It Works

### For Buyers:
1. Browse land listings
2. Click on a land
3. Submit inquiry with message
4. View sent inquiries in "My Inquiries" tab

### For Sellers:
1. Login as seller
2. Go to Dashboard
3. Click "📬 Received Inquiries" tab
4. See all inquiries from buyers about your lands
5. View buyer details and message
6. Update status:
   - **Pending** → Mark as Contacted or Interested or Reject
   - **Contacted** → Mark as Interested or Reject
   - **Interested** → Final status
   - **Rejected** → Final status

## API Endpoints Used

### Get Received Inquiries (Sellers)
```
GET /api/buyer-leads/received
Authorization: Bearer <seller-token>

Response:
{
  "leads": [
    {
      "_id": "lead_id",
      "buyerId": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "profilePicture": "/uploads/profiles/..."
      },
      "landId": {
        "title": "Prime Land",
        "price": 50000,
        "city": "Mumbai",
        "state": "Maharashtra"
      },
      "message": "I'm interested in this property",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Update Lead Status
```
PUT /api/buyer-leads/:id/status
Authorization: Bearer <seller-token>
Content-Type: application/json

Body:
{
  "status": "contacted" | "interested" | "rejected"
}

Response:
{
  "message": "Lead status updated",
  "lead": { ... }
}
```

## Status Flow

```
pending → contacted → interested
   ↓          ↓
rejected   rejected
```

## UI Features

- **Color-coded status badges**:
  - 🟡 Pending (yellow)
  - 🔵 Contacted (blue)
  - 🟢 Interested (green)
  - 🔴 Rejected (red)

- **Buyer information display**:
  - Profile picture
  - Name
  - Email
  - Phone number

- **Action buttons** (conditional based on status):
  - Only show relevant actions for current status
  - Prevent invalid status transitions

- **Empty state**:
  - Shows when no inquiries received
  - Helpful message for sellers

## Testing

1. **As Buyer**:
   - Register/login as buyer
   - Browse lands
   - Submit inquiry on a land
   - Check "My Inquiries" tab

2. **As Seller**:
   - Register/login as seller
   - Add a land listing
   - Wait for buyer inquiry
   - Go to "Received Inquiries" tab
   - See buyer's inquiry with details
   - Update status using action buttons

## Notes

- Inquiries are stored in the `buyerleads` collection
- Sellers can only see inquiries for their own lands
- Buyers can only see their own sent inquiries
- Status updates are instant and refresh the list
- Aadhaar verification is required to send inquiries
