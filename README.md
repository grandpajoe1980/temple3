# Temple3 - Multi-Tenant Spiritual Community Platform

App for the soul - A comprehensive multi-tenant application that allows different churches and temples to set up and manage their individual webpages.

## Overview

Temple3 is a secure, multi-tenant platform designed for religious organizations to manage their online presence. Each tenant (church/temple) operates in a completely isolated environment with shared common features.

## Features

### Core Features
- **Multi-Tenant Architecture**: Complete isolation between different organizations
- **User Authentication**: Secure login system with JWT tokens
- **Role-Based Access Control**: Manage permissions for different user types
- **Security**: Password hashing, rate limiting, CORS, and helmet security

### Tenant-Specific Features
Each tenant gets access to:
- **Religious Texts**: Store and share sacred texts, teachings, and readings
- **Calendar Events**: Manage and display community events, services, and celebrations
- **Messaging System**: Internal messaging between community members
- **Podcasts**: Host and share audio content (sermons, teachings, discussions)
- **Videos**: Share video content with the community
- **Reminder Bells**: Set up prayer/meditation reminders for users
- **Staff Area**: Private social feed for staff members
- **Layperson Area**: Community social feed for all members
- **Comments**: Engage in discussions on posts and content

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with UUID primary keys
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, helmet, rate limiting, CORS
- **API**: RESTful API architecture

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/grandpajoe1980/temple3.git
cd temple3
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database:
```bash
# Create a PostgreSQL database
createdb temple3

# Run the schema
psql -d temple3 -f database/schema.sql
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: Database name (default: temple3)
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
- `PORT`: Server port (default: 3000)
- `CORS_ORIGIN`: Allowed CORS origin

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Documentation

### Health Check
```
GET /health
```
Returns server status.

### Tenant Management

#### Create a New Tenant
```
POST /api/tenant
Content-Type: application/json

{
  "name": "First Baptist Church",
  "subdomain": "first-baptist",
  "domain": "firstbaptist.org",
  "contactEmail": "admin@firstbaptist.org",
  "phone": "+1-555-0100",
  "address": "123 Main St, City, State 12345"
}
```

#### Get Tenant Information
```
GET /api/tenant
Headers:
  X-Tenant-Subdomain: first-baptist
  Authorization: Bearer <token>
```

#### Update Tenant
```
PUT /api/tenant
Headers:
  X-Tenant-Subdomain: first-baptist
  Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Church Name",
  "phone": "+1-555-0101"
}
```

### Authentication

#### Register a New User
```
POST /api/auth/register
Headers:
  X-Tenant-Subdomain: first-baptist
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0200"
}
```

#### Login
```
POST /api/auth/login
Headers:
  X-Tenant-Subdomain: first-baptist
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```
GET /api/auth/me
Headers:
  Authorization: Bearer <token>
```

## Multi-Tenant Architecture

The application uses several strategies to ensure complete tenant isolation:

1. **Tenant Identification**: Tenants are identified via:
   - `X-Tenant-Subdomain` header
   - `X-Tenant-Id` header
   - Query parameter `?tenant=subdomain`

2. **Data Isolation**: All tenant-specific tables include a `tenant_id` foreign key with CASCADE DELETE to ensure data integrity.

3. **Access Control**: Middleware validates that users can only access resources within their tenant.

4. **Database Indexes**: Optimized queries with indexes on `tenant_id` columns for performance.

## Database Schema

The database includes the following main tables:
- `tenants`: Organization information
- `users`: User accounts (scoped to tenants)
- `roles`: Role definitions (scoped to tenants)
- `user_roles`: Role assignments
- `religious_texts`: Sacred texts and teachings
- `calendar_events`: Events and services
- `messages`: Internal messaging
- `podcasts`: Audio content
- `videos`: Video content
- `reminder_bells`: Prayer/meditation reminders
- `staff_posts`: Staff-only social posts
- `layperson_posts`: Community social posts
- `comments`: Comments on posts

All tables use UUID primary keys and include appropriate timestamps and indexes.

## Security Features

1. **Password Security**: Bcrypt hashing with salt rounds
2. **JWT Authentication**: Secure token-based authentication
3. **Rate Limiting**: Prevents abuse (100 requests per 15 minutes)
4. **Helmet.js**: Sets security headers
5. **CORS**: Configurable cross-origin resource sharing
6. **Input Validation**: Validates all user inputs
7. **Tenant Isolation**: Complete data separation between tenants

## Development

### Project Structure
```
temple3/
├── database/
│   └── schema.sql          # Database schema
├── src/
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   └── tenantController.js
│   ├── middleware/
│   │   ├── auth.js         # Authentication middleware
│   │   └── tenant.js       # Tenant isolation middleware
│   ├── models/
│   │   ├── User.js
│   │   └── Tenant.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tenant.js
│   ├── utils/
│   │   └── auth.js         # Authentication utilities
│   ├── app.js              # Express application
│   └── server.js           # Server entry point
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Future Enhancements

- Additional controllers and routes for all features (religious texts, calendar, messages, etc.)
- Real-time messaging with WebSockets
- File upload for media content
- Email notifications
- Mobile app (React Native)
- Analytics and reporting
- Payment integration for donations
- Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[API.md](API.md)** - Complete API reference
- **[TESTING.md](TESTING.md)** - Testing guide with examples
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

## Support

For support, please contact the repository maintainer or open an issue on GitHub.
