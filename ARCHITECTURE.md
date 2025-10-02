# Temple3 Architecture Documentation

## Overview

Temple3 is a multi-tenant SaaS application built with a focus on security, scalability, and tenant isolation. This document describes the architectural decisions and patterns used in the application.

## Architecture Pattern

### Multi-Tenant Strategy: Shared Database, Shared Schema

Temple3 uses a **shared database, shared schema** multi-tenancy pattern with row-level tenant isolation:

- **Single Database**: All tenants share the same PostgreSQL database
- **Tenant Isolation**: Every tenant-specific table includes a `tenant_id` column
- **Foreign Key Constraints**: All data cascades on tenant deletion
- **Indexed Queries**: All tenant-specific queries are indexed for performance

#### Advantages:
- Cost-effective: Single database to maintain
- Easy to backup and restore
- Simpler deployment and scaling
- Cross-tenant analytics possible (if needed)

#### Security Measures:
- Middleware enforces tenant context on every request
- All queries filter by `tenant_id`
- User tokens include `tenantId` to prevent cross-tenant access
- Database indexes optimize tenant-specific queries

## Technology Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js 5
- **Language**: JavaScript (ES6+)

### Database
- **DBMS**: PostgreSQL (v12+)
- **ORM**: Raw SQL queries via `pg` driver
- **Schema Management**: SQL migration files

### Security
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt with salt rounds
- **Security Headers**: Helmet.js
- **Rate Limiting**: express-rate-limit
- **CORS**: Configurable CORS middleware

## Database Schema

### Core Tables

#### tenants
Stores organization information:
- UUID primary key
- Unique subdomain and domain
- Contact information
- Settings (JSONB)
- Active status flag

#### users
User accounts scoped to tenants:
- UUID primary key
- Foreign key to tenant (CASCADE DELETE)
- Email (unique within tenant)
- Hashed password
- Profile information
- Verification and active status

#### roles
Permission definitions per tenant:
- UUID primary key
- Foreign key to tenant (CASCADE DELETE)
- Name (unique within tenant)
- Permissions (JSONB array)

#### user_roles
Many-to-many relationship between users and roles

### Feature Tables

All feature tables follow the same pattern:
- UUID primary key
- `tenant_id` foreign key (CASCADE DELETE)
- `created_by` foreign key to users (for audit trail)
- Timestamps (`created_at`, `updated_at`)
- Indexed on `tenant_id`

Feature tables include:
- `religious_texts`: Sacred texts and teachings
- `calendar_events`: Events and services
- `messages`: Internal messaging
- `podcasts`: Audio content
- `videos`: Video content
- `reminder_bells`: User reminders
- `staff_posts`: Staff-only social posts
- `layperson_posts`: Community social posts
- `comments`: Comments on posts

## Request Flow

### 1. Tenant Identification

```
Client Request
    ↓
Tenant Middleware
    ↓ (extracts tenant identifier)
Database Query (find tenant)
    ↓
Request.tenant populated
    ↓
Next Middleware
```

Tenant identification methods (priority order):
1. `X-Tenant-Id` header (UUID)
2. `X-Tenant-Subdomain` header
3. `tenant` query parameter
4. (Future) Subdomain from hostname

### 2. Authentication

```
Client Request with JWT
    ↓
Auth Middleware
    ↓ (verify token)
JWT Decoded
    ↓ (extract userId, tenantId)
Request.user populated
    ↓
Next Middleware
```

### 3. Authorization

```
Authenticated Request
    ↓
Tenant Access Validation
    ↓ (compare user.tenantId with request.tenant.id)
Access Granted/Denied
    ↓
Controller Logic
```

## Security Architecture

### Defense in Depth

1. **Network Layer**
   - HTTPS only (enforced in production)
   - CORS restrictions
   - Rate limiting

2. **Application Layer**
   - Input validation
   - SQL injection prevention (parameterized queries)
   - XSS protection (helmet.js)
   - CSRF protection (future: CSRF tokens for forms)

3. **Authentication Layer**
   - Secure password hashing (bcrypt)
   - JWT with expiration
   - Token refresh (future enhancement)

4. **Authorization Layer**
   - Role-based access control
   - Tenant-level isolation
   - Resource-level permissions (future)

5. **Data Layer**
   - Foreign key constraints
   - CASCADE DELETE for data integrity
   - Unique constraints on critical fields

### Tenant Isolation

Three levels of isolation:

1. **Middleware Level**: Tenant context required for all operations
2. **Controller Level**: All queries include tenant_id filter
3. **Database Level**: Foreign key constraints ensure data integrity

### Password Security

- Bcrypt algorithm with 10 salt rounds
- Passwords never stored in plain text
- Passwords never returned in API responses
- Password complexity requirements (future enhancement)

## Scalability Considerations

### Current Architecture
- Stateless API (horizontal scaling ready)
- Connection pooling (20 connections)
- Database indexes on high-traffic queries

### Future Enhancements

1. **Caching Layer**
   - Redis for session management
   - Cache tenant data
   - Cache frequent queries

2. **Load Balancing**
   - Multiple API server instances
   - Round-robin or least-connections

3. **Database Scaling**
   - Read replicas for analytics
   - Connection pooling optimization
   - Query optimization

4. **CDN Integration**
   - Static asset delivery
   - Media file hosting
   - Global content distribution

5. **Message Queue**
   - Background job processing
   - Email notifications
   - Reminder bell notifications

## Data Flow Examples

### User Registration Flow

```
1. POST /api/auth/register
   Headers: X-Tenant-Subdomain: first-baptist
   Body: { email, password, firstName, lastName }

2. Tenant Middleware
   - Lookup tenant by subdomain
   - Populate request.tenant

3. Auth Controller
   - Validate input
   - Check if user exists (within tenant)
   - Hash password
   - Create user record (with tenant_id)
   - Generate JWT (include tenantId)
   - Return user data + token

4. Response
   { user: {...}, token: "..." }
```

### Protected Resource Access Flow

```
1. GET /api/religious-texts
   Headers: 
     X-Tenant-Subdomain: first-baptist
     Authorization: Bearer <token>

2. Tenant Middleware
   - Lookup tenant by subdomain
   - Populate request.tenant

3. Auth Middleware
   - Verify JWT
   - Populate request.user (includes userId, tenantId)

4. Tenant Access Validation
   - Ensure user.tenantId === tenant.id
   - Deny if mismatch

5. Controller
   - Query: SELECT * FROM religious_texts WHERE tenant_id = $1
   - Return results

6. Response
   { texts: [...] }
```

## Error Handling

### Error Types

1. **Validation Errors** (400)
   - Missing required fields
   - Invalid format

2. **Authentication Errors** (401)
   - Missing token
   - Invalid token
   - Expired token

3. **Authorization Errors** (403)
   - Access denied
   - Tenant mismatch
   - Insufficient permissions

4. **Not Found Errors** (404)
   - Resource not found
   - Tenant not found

5. **Conflict Errors** (409)
   - Resource already exists
   - Unique constraint violation

6. **Server Errors** (500)
   - Database errors
   - Unexpected errors

### Error Response Format

```json
{
  "error": "Human-readable error message"
}
```

## Monitoring and Logging

### Current Implementation
- Console logging for errors
- Database connection monitoring

### Recommended Additions
1. **Structured Logging**
   - Winston or Bunyan
   - JSON log format
   - Log levels (debug, info, warn, error)

2. **Application Monitoring**
   - New Relic / DataDog
   - Performance metrics
   - Error tracking

3. **Database Monitoring**
   - Query performance
   - Slow query log
   - Connection pool metrics

4. **Security Monitoring**
   - Failed login attempts
   - Rate limit violations
   - Suspicious activity

## Deployment Strategy

### Environment Configuration

Three environments:
1. **Development**: Local machine
2. **Staging**: Pre-production testing
3. **Production**: Live environment

Each environment requires:
- Separate database
- Environment-specific `.env` file
- SSL certificates (staging, production)

### Deployment Checklist

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Seed initial data (optional)
5. Start application server
6. Configure reverse proxy (nginx)
7. Set up SSL certificates
8. Configure firewall rules
9. Set up monitoring
10. Create backup strategy

### Recommended Infrastructure

```
Internet
    ↓
Load Balancer / Reverse Proxy (nginx)
    ↓
Application Servers (Node.js) [multiple instances]
    ↓
Database (PostgreSQL) [primary + read replicas]
    ↓
Backup Storage
```

## Future Architecture Enhancements

1. **Microservices**: Split features into separate services
2. **Event-Driven**: Event bus for inter-service communication
3. **Real-time**: WebSocket server for live updates
4. **Mobile API**: GraphQL layer for mobile apps
5. **Analytics**: Separate analytics database
6. **Media Storage**: S3-compatible object storage
7. **Search**: Elasticsearch for full-text search
8. **Notifications**: Push notification service

## Conclusion

Temple3's architecture prioritizes:
- **Security**: Multi-layered security approach
- **Isolation**: Complete tenant data separation
- **Scalability**: Designed for horizontal scaling
- **Maintainability**: Clear code organization
- **Performance**: Indexed queries and connection pooling

The architecture supports the current feature set while remaining flexible for future enhancements.
