# Temple3 API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require a JWT token. Include it in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Tenant Context
All tenant-specific operations require tenant identification via one of:
- Header: `X-Tenant-Subdomain: your-subdomain`
- Header: `X-Tenant-Id: tenant-uuid`
- Query: `?tenant=your-subdomain`

---

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### Tenant Management

#### POST /api/tenant
Create a new tenant (church/temple).

**Request Body:**
```json
{
  "name": "First Baptist Church",
  "subdomain": "first-baptist",
  "domain": "firstbaptist.org",
  "contactEmail": "admin@firstbaptist.org",
  "phone": "+1-555-0100",
  "address": "123 Main St, City, State 12345"
}
```

**Response:** `201 Created`
```json
{
  "message": "Tenant created successfully",
  "tenant": {
    "id": "uuid",
    "name": "First Baptist Church",
    "subdomain": "first-baptist",
    "contactEmail": "admin@firstbaptist.org"
  }
}
```

**Errors:**
- `400`: Missing required fields or invalid subdomain format
- `409`: Subdomain already taken

---

#### GET /api/tenant/discover
Search for active tenants. Public endpoint that supports the landing page search experience.

**Query Parameters:**
- `search` (optional): partial match on tenant name, subdomain, domain, or address
- `limit` (optional, default 20): number of results to return (max 100)
- `offset` (optional, default 0): offset for pagination

**Response:** `200 OK`
```json
{
  "tenants": [
    {
      "id": "uuid",
      "name": "First Baptist Church",
      "subdomain": "first-baptist",
      "domain": "firstbaptist.org",
      "contactEmail": "admin@firstbaptist.org",
      "address": "123 Main St",
      "timezone": "UTC"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### GET /api/tenant/lookup/:subdomain
Retrieve public tenant information by subdomain. Useful for selecting a tenant before authentication.

**Response:** `200 OK`
```json
{
  "tenant": {
    "id": "uuid",
    "name": "First Baptist Church",
    "subdomain": "first-baptist",
    "domain": "firstbaptist.org",
    "contactEmail": "admin@firstbaptist.org",
    "phone": "+1-555-0100",
    "address": "123 Main St",
    "timezone": "UTC",
    "settings": {}
  }
}
```

---

#### GET /api/tenant/current
Get current tenant information (requires authentication and tenant context).

**Headers:**
```
X-Tenant-Subdomain: first-baptist
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "First Baptist Church",
  "subdomain": "first-baptist",
  "domain": "firstbaptist.org",
  "contactEmail": "admin@firstbaptist.org",
  "phone": "+1-555-0100",
  "address": "123 Main St",
  "timezone": "UTC",
  "isActive": true,
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

---

#### PUT /api/tenant/current
Update tenant information (requires authentication and tenant context).

**Headers:**
```
X-Tenant-Subdomain: first-baptist
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Church Name",
  "domain": "newdomain.org",
  "contact_email": "newemail@church.org",
  "phone": "+1-555-0200",
  "address": "456 New St",
  "timezone": "America/New_York",
  "settings": {
    "theme": "light",
    "feature_flags": {}
  }
}
```

**Response:** `200 OK`
```json
{
  "message": "Tenant updated successfully",
  "tenant": {
    "id": "uuid",
    "name": "Updated Church Name",
    "subdomain": "first-baptist",
    "domain": "newdomain.org",
    "contactEmail": "newemail@church.org",
    "phone": "+1-555-0200",
    "address": "456 New St",
    "timezone": "America/New_York"
  }
}
```

---

### Authentication

#### POST /api/auth/register
Register a new user within a tenant.

**Headers:**
```
X-Tenant-Subdomain: first-baptist
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0200"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- `400`: Missing required fields or tenant context
- `409`: User already exists

---

#### POST /api/auth/login
Login with email and password.

**Headers:**
```
X-Tenant-Subdomain: first-baptist
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- `400`: Missing email or password, or tenant context
- `401`: Invalid credentials
- `403`: Account is inactive

---

#### GET /api/auth/me
Get current authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0200",
  "isActive": true,
  "isVerified": false,
  "lastLogin": "2024-01-01T12:00:00.000Z",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

**Errors:**
- `401`: Invalid or missing token
- `404`: User not found

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (missing or invalid parameters)
- `401`: Unauthorized (authentication required or invalid token)
- `403`: Forbidden (access denied)
- `404`: Not Found
- `409`: Conflict (resource already exists)
- `500`: Internal Server Error

---

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address for all `/api/*` endpoints.

If you exceed the rate limit, you'll receive a `429 Too Many Requests` response.

---

## Security Headers

The API includes the following security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (in production)

---

## CORS

Cross-Origin Resource Sharing (CORS) is configured based on the `CORS_ORIGIN` environment variable. By default, it allows requests from any origin in development.

---

## Future Endpoints

The following endpoints are planned for future implementation:

### Religious Texts
- `GET /api/religious-texts` - List texts
- `POST /api/religious-texts` - Create text
- `GET /api/religious-texts/:id` - Get specific text
- `PUT /api/religious-texts/:id` - Update text
- `DELETE /api/religious-texts/:id` - Delete text

### Calendar Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get specific event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Messages
- `GET /api/messages` - List messages
- `POST /api/messages` - Send message
- `GET /api/messages/:id` - Get specific message
- `PUT /api/messages/:id/read` - Mark as read

### Podcasts
- `GET /api/podcasts` - List podcasts
- `POST /api/podcasts` - Create podcast
- `GET /api/podcasts/:id` - Get specific podcast
- `PUT /api/podcasts/:id` - Update podcast
- `DELETE /api/podcasts/:id` - Delete podcast

### Videos
- `GET /api/videos` - List videos
- `POST /api/videos` - Create video
- `GET /api/videos/:id` - Get specific video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Staff & Layperson Posts
- `GET /api/staff-posts` - List staff posts
- `POST /api/staff-posts` - Create staff post
- `GET /api/layperson-posts` - List layperson posts
- `POST /api/layperson-posts` - Create layperson post

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments?post_id=&post_type=` - List comments for a post
