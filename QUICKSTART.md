# Quick Start Guide

Get Temple3 up and running in 5 minutes!

## Prerequisites

- Node.js 14+ installed
- PostgreSQL 12+ installed and running

## Step 1: Clone and Install

```bash
git clone https://github.com/grandpajoe1980/temple3.git
cd temple3
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your database password:
```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=change_this_to_a_random_secret_min_32_chars
```

## Step 3: Set Up Database

```bash
# Create database
createdb temple3

# Set up schema
npm run setup-db

# Optional: Add sample data
npm run seed-db
```

## Step 4: Start Server

```bash
npm run dev
```

Server starts at: http://localhost:3000

## Step 5: Test the API

### Create a Tenant

```bash
curl -X POST http://localhost:3000/api/tenant \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Church",
    "subdomain": "my-church",
    "contactEmail": "admin@mychurch.org"
  }'
```

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: my-church" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Save the token from the response!

### Access Protected Endpoint

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## What's Next?

- Read the [README.md](README.md) for full documentation
- Check [API.md](API.md) for complete API reference
- See [TESTING.md](TESTING.md) for testing examples
- Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
- Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

## Common Issues

**Database connection error:**
- Make sure PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Verify database exists: `psql -l | grep temple3`

**Port already in use:**
- Change PORT in `.env` to something else (e.g., 3001)
- Or stop the process using port 3000

**JWT token errors:**
- Make sure JWT_SECRET is set in `.env`
- Token expires after 7 days by default

## Available Scripts

- `npm start` - Start server in production mode
- `npm run dev` - Start server with auto-reload
- `npm run setup-db` - Create database tables
- `npm run seed-db` - Add sample data

## Features Available

✅ Multi-tenant architecture with complete isolation  
✅ User authentication & authorization  
✅ Religious texts management  
✅ Calendar events  
✅ Internal messaging  
✅ Podcasts library  
✅ Videos library  
✅ Staff posts (private social feed)  
✅ Layperson posts (community social feed)  
✅ Comments on posts  
✅ Reminder bells for prayers/meditation  

## Example Workflow

1. **Admin creates tenant** (church/temple)
2. **Admin registers** with tenant subdomain
3. **Admin creates content** (texts, events, media)
4. **Members register** and join
5. **Members interact** (posts, comments, messages)
6. **Everyone stays connected** with reminders and calendar

## Architecture Highlights

- **Multi-tenant**: Each church/temple is completely isolated
- **Secure**: JWT tokens, password hashing, rate limiting
- **Scalable**: Stateless API, connection pooling
- **RESTful**: Standard HTTP methods and status codes
- **Documented**: Comprehensive API and architecture docs

## Need Help?

- Documentation: Check the `*.md` files
- Issues: https://github.com/grandpajoe1980/temple3/issues
- Testing: Run `npm run seed-db` to get sample data

Enjoy building your spiritual community platform! 🙏
