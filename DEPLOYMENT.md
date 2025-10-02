# Deployment Guide for Temple3

This guide covers deploying Temple3 to production environments.

## Prerequisites

- Node.js 14+ installed
- PostgreSQL 12+ database
- Domain name (optional, but recommended)
- SSL certificate (for HTTPS in production)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/grandpajoe1980/temple3.git
cd temple3
```

### 2. Install Dependencies

```bash
npm install --production
```

### 3. Configure Environment Variables

Create `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with production values:

```env
# Database Configuration
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=temple3_production
DB_USER=temple3_user
DB_PASSWORD=your-secure-database-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com
```

**Important Security Notes:**
- Use a strong, unique JWT_SECRET (minimum 32 characters)
- Use strong database password
- Never commit `.env` to version control
- Set NODE_ENV to "production"

### 4. Set Up PostgreSQL Database

```bash
# Create database
createdb temple3_production

# Run schema
psql -d temple3_production -f database/schema.sql

# Optionally seed with initial data
npm run seed-db
```

Or use the setup script:

```bash
npm run setup-db
```

### 5. Test the Application

```bash
npm start
```

Visit `http://localhost:3000` to verify it's working.

## Production Deployment Options

### Option 1: Traditional Server (Ubuntu/Debian)

#### Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Install PostgreSQL

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

#### Set up the application

```bash
cd /var/www/temple3
npm install --production
```

#### Use PM2 for Process Management

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start src/server.js --name temple3

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

#### Configure Nginx as Reverse Proxy

Create `/etc/nginx/sites-available/temple3`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/temple3 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Set up SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=temple3
      - DB_USER=postgres
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=temple3
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy:

```bash
docker-compose up -d
```

### Option 3: Cloud Platform Deployment

#### Heroku

1. Create `Procfile`:
```
web: node src/server.js
```

2. Deploy:
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku config:set JWT_SECRET=your-secret-key
```

#### DigitalOcean App Platform

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Add PostgreSQL database addon
4. Deploy

#### AWS Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize:
```bash
eb init
eb create temple3-env
```

3. Set environment variables:
```bash
eb setenv JWT_SECRET=your-secret NODE_ENV=production
```

## Database Backup Strategy

### Automated Backups with Cron

Create backup script `/usr/local/bin/backup-temple3.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/temple3"
DB_NAME="temple3_production"

mkdir -p $BACKUP_DIR
pg_dump $DB_NAME | gzip > $BACKUP_DIR/temple3_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "temple3_*.sql.gz" -mtime +30 -delete
```

Make executable and add to crontab:

```bash
chmod +x /usr/local/bin/backup-temple3.sh
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-temple3.sh
```

## Monitoring

### Application Monitoring with PM2

```bash
# View logs
pm2 logs temple3

# Monitor performance
pm2 monit

# Restart if needed
pm2 restart temple3
```

### Database Monitoring

Monitor PostgreSQL performance:

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds';

-- Check database size
SELECT pg_size_pretty(pg_database_size('temple3_production'));
```

## Security Checklist

- [ ] Set strong JWT_SECRET (min 32 chars)
- [ ] Use HTTPS/SSL in production
- [ ] Set NODE_ENV=production
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords
- [ ] Keep system and packages updated
- [ ] Set up regular backups
- [ ] Configure rate limiting (already included)
- [ ] Use strong database passwords
- [ ] Restrict database access to localhost
- [ ] Monitor application logs
- [ ] Set up intrusion detection (fail2ban)

## Performance Optimization

### Database Indexes

Already included in schema, but verify:

```sql
-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public' AND tablename IN (
    'users', 'religious_texts', 'calendar_events', 'messages'
);
```

### Connection Pooling

Already configured in `src/config/database.js` with:
- Max 20 connections
- 30 second idle timeout
- 2 second connection timeout

Adjust based on your needs.

### Caching (Future Enhancement)

Consider adding Redis:

```bash
npm install redis
```

Cache tenant data, user sessions, and frequently accessed content.

## Scaling

### Horizontal Scaling

1. Run multiple Node.js instances with PM2:
```bash
pm2 start src/server.js -i max
```

2. Use a load balancer (Nginx, HAProxy, AWS ALB)

3. Shared session storage (Redis)

### Database Scaling

1. Set up read replicas for read-heavy operations
2. Use connection pooling (already implemented)
3. Consider database partitioning for large datasets

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs temple3

# Check if port is in use
sudo netstat -tulpn | grep :3000

# Test database connection
psql -h localhost -U temple3_user -d temple3_production
```

### High memory usage

```bash
# Monitor memory
pm2 monit

# Restart application
pm2 restart temple3

# Check for memory leaks
node --max-old-space-size=4096 src/server.js
```

### Database connection errors

- Verify database is running: `sudo systemctl status postgresql`
- Check credentials in `.env`
- Verify network connectivity
- Check PostgreSQL logs: `/var/log/postgresql/`

## Maintenance

### Update Application

```bash
git pull origin main
npm install --production
pm2 restart temple3
```

### Database Migrations

When schema changes:

1. Backup database first
2. Apply changes with caution
3. Test in staging first

### Monitor Disk Space

```bash
df -h
du -sh /var/lib/postgresql/
```

Set up alerts for low disk space.

## Support

For issues or questions:
- Check logs: `pm2 logs temple3`
- Review documentation: README.md, API.md, ARCHITECTURE.md
- GitHub issues: https://github.com/grandpajoe1980/temple3/issues

## Rollback Procedure

If deployment fails:

```bash
# Restore previous version
git checkout previous-version
npm install --production
pm2 restart temple3

# Restore database if needed
gunzip < backup.sql.gz | psql temple3_production
```

Always test in staging before production deployment!
