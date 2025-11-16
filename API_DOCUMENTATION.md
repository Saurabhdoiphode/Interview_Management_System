# Interview Management System - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "candidate"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "candidate"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Logout
```http
POST /auth/logout
```
Headers: `Authorization: Bearer <token>`

### Get Current User
```http
GET /auth/me
```
Headers: `Authorization: Bearer <token>`

### Update Profile
```http
PUT /auth/me
```
Headers: `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "department": "Engineering"
}
```

### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
```

---

## Job Endpoints

### Get All Jobs
```http
GET /jobs?page=1&limit=10&status=open&department=Engineering&search=developer
```
Headers: `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Job status (draft, open, closed, etc.)
- `department` (optional): Filter by department
- `location` (optional): Filter by location
- `search` (optional): Search in title and description

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "jobs": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### Get Job by ID
```http
GET /jobs/:id
```
Headers: `Authorization: Bearer <token>`

### Create Job
```http
POST /jobs
```
Headers: `Authorization: Bearer <token>`
Roles: `super_admin`, `hr_manager`, `hiring_manager`

**Request Body:**
```json
{
  "title": "Senior Frontend Developer",
  "description": "We are looking for...",
  "department": "Engineering",
  "location": "Remote",
  "employmentType": "full-time",
  "experienceLevel": "senior",
  "salaryRange": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "skills": ["React", "TypeScript", "Node.js"],
  "requirements": ["5+ years experience", "..."],
  "responsibilities": ["Lead development", "..."],
  "benefits": ["Health insurance", "..."],
  "openings": 2
}
```

### Update Job
```http
PUT /jobs/:id
```
Headers: `Authorization: Bearer <token>`
Roles: `super_admin`, `hr_manager`, `hiring_manager`

### Delete Job
```http
DELETE /jobs/:id
```
Headers: `Authorization: Bearer <token>`
Roles: `super_admin`, `hr_manager`

### Update Job Status
```http
PATCH /jobs/:id/status
```
Headers: `Authorization: Bearer <token>`
Roles: `super_admin`, `hr_manager`

**Request Body:**
```json
{
  "status": "open"
}
```

### Get Job Statistics
```http
GET /jobs/stats
```
Headers: `Authorization: Bearer <token>`
Roles: `super_admin`, `hr_manager`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "open": 12,
    "closed": 30,
    "byStatus": [
      { "_id": "open", "count": 12 },
      { "_id": "closed", "count": 30 }
    ]
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Header:** `X-RateLimit-Remaining`

When limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

---

## Pagination

All list endpoints support pagination:

**Request:**
```http
GET /endpoint?page=2&limit=20
```

**Response:**
```json
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

## User Roles

- `super_admin`: Full system access
- `hr_manager`: Manage jobs, candidates, interviews
- `hiring_manager`: Manage team hiring
- `interviewer`: Conduct interviews, provide feedback
- `candidate`: Apply for jobs, view applications

---

## WebSocket Events

Connect to: `ws://localhost:5000`

**Authentication:**
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-access-token'
  }
});
```

**Events:**
- `notification`: New notification
- `interview-scheduled`: Interview scheduled
- `application-update`: Application status changed
- `message`: New message

---

For more details, visit the Swagger documentation at `/api-docs` when running the server.
