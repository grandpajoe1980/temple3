# Testing Guide for Temple3

This guide demonstrates how to test the Temple3 API using curl or any REST client (Postman, Insomnia, etc.).

## Prerequisites

1. PostgreSQL database running
2. Database schema applied (run `npm run setup-db`)
3. Optionally seed data (run `npm run seed-db`)
4. Server running (run `npm start` or `npm run dev`)

## Testing Flow

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Create a Tenant

```bash
curl -X POST http://localhost:3000/api/tenant \
  -H "Content-Type: application/json" \
  -d '{
    "name": "First Community Church",
    "subdomain": "first-community",
    "contactEmail": "admin@firstcommunity.org",
    "phone": "+1-555-0100",
    "address": "123 Main St"
  }'
```

Expected response:
```json
{
  "message": "Tenant created successfully",
  "tenant": {
    "id": "uuid",
    "name": "First Community Church",
    "subdomain": "first-community",
    "contactEmail": "admin@firstcommunity.org"
  }
}
```

### 3. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0200"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

Save the token for subsequent requests!

### 4. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### 5. Get Current User

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Create a Religious Text

```bash
curl -X POST http://localhost:3000/api/religious-texts \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Daily Meditation",
    "content": "Today we reflect on...",
    "author": "Pastor John",
    "category": "Meditation",
    "tags": ["daily", "meditation"],
    "isPublic": true
  }'
```

### 7. List Religious Texts

```bash
curl http://localhost:3000/api/religious-texts \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8. Create a Calendar Event

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Sunday Service",
    "description": "Weekly worship service",
    "startTime": "2024-01-07T10:00:00Z",
    "endTime": "2024-01-07T11:30:00Z",
    "location": "Main Sanctuary",
    "eventType": "Service"
  }'
```

### 9. List Events

```bash
curl "http://localhost:3000/api/events?startDate=2024-01-01&endDate=2024-12-31" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 10. Send a Message

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "recipientId": "RECIPIENT_USER_UUID",
    "subject": "Welcome!",
    "content": "Welcome to our community"
  }'
```

### 11. Get Inbox

```bash
curl http://localhost:3000/api/messages/inbox \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 12. Create a Podcast

```bash
curl -X POST http://localhost:3000/api/podcasts \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Weekly Sermon",
    "description": "This weeks message about...",
    "audioUrl": "https://example.com/podcast.mp3",
    "duration": 1800,
    "episodeNumber": 1,
    "seasonNumber": 1
  }'
```

### 13. Create a Video

```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Sunday Service Recording",
    "description": "Recording of our service",
    "videoUrl": "https://example.com/video.mp4",
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "duration": 3600
  }'
```

### 14. Create a Staff Post

```bash
curl -X POST http://localhost:3000/api/staff-posts \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Staff meeting notes...",
    "isPublished": true
  }'
```

### 15. Create a Layperson Post

```bash
curl -X POST http://localhost:3000/api/layperson-posts \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Looking forward to this Sundays service!",
    "isPublished": true
  }'
```

### 16. Add Comment to Post

```bash
curl -X POST http://localhost:3000/api/layperson-posts/POST_ID/comments \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Great post!"
  }'
```

### 17. Create a Reminder Bell

```bash
curl -X POST http://localhost:3000/api/reminder-bells \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Morning Prayer",
    "reminderTime": "07:00:00",
    "daysOfWeek": [1, 2, 3, 4, 5],
    "isActive": true
  }'
```

### 18. List Reminder Bells

```bash
curl http://localhost:3000/api/reminder-bells \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Multi-Tenant Testing

To test tenant isolation, create a second tenant and user, then try to access resources from the first tenant using the second tenant's credentials. You should get a 403 or 404 error.

### Create Second Tenant

```bash
curl -X POST http://localhost:3000/api/tenant \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Second Temple",
    "subdomain": "second-temple",
    "contactEmail": "admin@secondtemple.org"
  }'
```

### Register User for Second Tenant

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: second-temple" \
  -d '{
    "email": "user@secondtemple.org",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### Try to Access First Tenant's Resources (Should Fail)

```bash
# This should return 403 or empty results
curl http://localhost:3000/api/religious-texts \
  -H "X-Tenant-Subdomain: first-community" \
  -H "Authorization: Bearer SECOND_TENANT_TOKEN"
```

## Automated Testing Script

Save this as `test.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
TENANT_SUBDOMAIN="test-church"

echo "1. Creating tenant..."
TENANT_RESPONSE=$(curl -s -X POST $BASE_URL/api/tenant \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Church\",
    \"subdomain\": \"$TENANT_SUBDOMAIN\",
    \"contactEmail\": \"admin@testchurch.org\"
  }")
echo "$TENANT_RESPONSE"

echo -e "\n2. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: $TENANT_SUBDOMAIN" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }')
echo "$REGISTER_RESPONSE"

TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

echo -e "\n3. Getting current user..."
curl -s $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n4. Creating religious text..."
curl -s -X POST $BASE_URL/api/religious-texts \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: $TENANT_SUBDOMAIN" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Text",
    "content": "This is a test",
    "isPublic": true
  }'

echo -e "\n\nTests completed!"
```

Make it executable:
```bash
chmod +x test.sh
./test.sh
```

## Notes

- Replace `YOUR_TOKEN_HERE` with actual JWT token from login/register
- Replace `POST_ID`, `RECIPIENT_USER_UUID` with actual UUIDs
- The server must be running on port 3000 (default)
- Make sure PostgreSQL is running and configured
- All tenant-specific endpoints require the `X-Tenant-Subdomain` header
- All protected endpoints require the `Authorization: Bearer <token>` header

## Common Issues

1. **401 Unauthorized**: Token is missing or invalid
2. **403 Forbidden**: User doesn't have access to the tenant
3. **404 Not Found**: Tenant or resource doesn't exist
4. **400 Bad Request**: Missing required fields
5. **409 Conflict**: Resource already exists (e.g., subdomain taken)
