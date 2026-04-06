# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "message": "Error message"
}
```

## Endpoints

### Authentication Routes

#### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "user"
}
```
- **Success Response**: `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "1234567890"
  }
}
```

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response**: `200 OK`
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Land Routes

#### Get All Lands
- **URL**: `/lands`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `city` (string): Filter by city
  - `minPrice` (number): Minimum price
  - `maxPrice` (number): Maximum price
  - `minSize` (number): Minimum size in sq ft
  - `maxSize` (number): Maximum size in sq ft
  - `status` (string): available, sold, pending
- **Success Response**: `200 OK`
```json
{
  "lands": [
    {
      "_id": "land_id",
      "title": "Beautiful Farm Land",
      "description": "Perfect for agriculture",
      "price": 50000,
      "size": 5000,
      "length": 100,
      "breadth": 50,
      "area": 5000,
      "location": "Rural Area",
      "city": "Springfield",
      "state": "Illinois",
      "images": ["/uploads/image1.jpg"],
      "seller": {
        "name": "Seller Name",
        "email": "seller@example.com"
      },
      "status": "available",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Land by ID
- **URL**: `/lands/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
```json
{
  "land": {
    "_id": "land_id",
    "title": "Beautiful Farm Land",
    "description": "Perfect for agriculture",
    "price": 50000,
    "size": 5000,
    "seller": {
      "name": "Seller Name",
      "email": "seller@example.com",
      "phone": "1234567890"
    }
  }
}
```

#### Create Land
- **URL**: `/lands`
- **Method**: `POST`
- **Auth Required**: Yes (Admin only)
- **Content-Type**: `multipart/form-data`
- **Body**:
```
title: Beautiful Farm Land
description: Perfect for agriculture
price: 50000
size: 5000
length: 100
breadth: 50
location: Rural Area
city: Springfield
state: Illinois
images: [file1, file2]
```
- **Success Response**: `201 Created`

#### Update Land
- **URL**: `/lands/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin or Owner)
- **Content-Type**: `multipart/form-data`
- **Success Response**: `200 OK`

#### Delete Land
- **URL**: `/lands/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin or Owner)
- **Success Response**: `200 OK`

#### Get My Lands
- **URL**: `/lands/my-lands`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

### Saved Lands Routes

#### Save Land
- **URL**: `/saved-lands`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
```json
{
  "landId": "land_id"
}
```
- **Success Response**: `201 Created`

#### Get Saved Lands
- **URL**: `/saved-lands`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

#### Unsave Land
- **URL**: `/saved-lands/:landId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

### Buyer Leads Routes

#### Create Lead
- **URL**: `/buyer-leads`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
```json
{
  "landId": "land_id",
  "message": "I'm interested in this property"
}
```
- **Success Response**: `201 Created`

#### Get My Leads
- **URL**: `/buyer-leads/my-leads`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

#### Get Leads for My Lands
- **URL**: `/buyer-leads/received`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

#### Update Lead Status
- **URL**: `/buyer-leads/:id/status`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Body**:
```json
{
  "status": "contacted"
}
```
- **Success Response**: `200 OK`

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Error Codes

Common error messages:
- "User already exists"
- "Invalid credentials"
- "Token is not valid"
- "Not authorized"
- "Land not found"
- "Validation Error"
