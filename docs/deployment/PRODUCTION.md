# Khaacho Production Deployment Guide

This document provides comprehensive instructions for deploying Khaacho to production environments.

## Architecture Overview

Khaacho consists of three applications:

1. **Backend API** - NestJS REST API (Port 8080)
2. **Website** - Next.js consumer-facing application
3. **CRM Admin Panel** - React/Vite internal dashboard

## 1. Frontend Deployment (Website & CRM)

### 1.1 Website Deployment (Next.js)

**Platform:** Vercel (recommended) or Cloudflare Pages

#### Vercel Deployment

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Configure the project:
   - **Root Directory:** `website`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (auto-detected)
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.khaacho.com
   NEXT_PUBLIC_SITE_URL=https://www.khaacho.com
   ```
5. Deploy

#### Cloudflare Pages Deployment (Alternative)

The project includes Cloudflare Workers support via vinext:

```bash
cd website
npm run build:vinext
npm run deploy:vinext
```

**Environment Variables:**
- Same as Vercel above

#### Production Build Verification

The Next.js config is set to `output: "standalone"` for optimal Node.js runtime compatibility.

**Security Headers** (already configured in `next.config.ts`):
- Content-Security-Policy
- Referrer-Policy
- X-Content-Type-Options
- X-Frame-Options
- Permissions-Policy

### 1.2 CRM Admin Panel Deployment (React/Vite)

**Platform:** Vercel (recommended)

#### Vercel Deployment

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure the project:
   - **Root Directory:** `crm-admin`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variables:
   ```
   VITE_API_URL=https://api.khaacho.com
   ```
5. Deploy

**Important:** The CRM should be deployed to a subdomain (e.g., `crm.khaacho.com`) and protected by authentication.

## 2. Backend Deployment (NestJS API)

**Platform:** Render.com (recommended), Railway, or AWS ECS

### 2.1 Render.com Deployment

1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure the service:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Instance Type:** Standard (minimum 2GB RAM for production)
4. Add Environment Variables (see Section 6)

### 2.2 Production Build Verification

The backend uses standard NestJS compilation:
- TypeScript → JavaScript via `nest build`
- Output directory: `dist/`
- Entry point: `dist/main.js`

**Build Command:**
```bash
cd backend
npm install
npx prisma generate
npm run build
```

**Start Command:**
```bash
node dist/main
```

## 3. Database

### 3.1 Database Provider

**Recommended:** Supabase (PostgreSQL) or AWS RDS PostgreSQL

The application uses PostgreSQL via Prisma ORM.

### 3.2 Connection Pooling

**Critical:** Use a connection pooler URL in production, not the direct connection string.

**Supabase Connection Modes:**
- **Transaction Mode:** Use for most operations (recommended)
- **Session Mode:** Use for operations requiring transaction consistency
- **Direct Connection:** Do NOT use in production

**Environment Variable:**
```
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?pgbouncer=true
```

### 3.3 Migrations

**Never run destructive migrations in production without backup.**

#### Applying Migrations

```bash
cd backend
npx prisma migrate deploy
```

#### Creating New Migrations (Development Only)

```bash
cd backend
npx prisma migrate dev --name [migration_name]
```

#### Migration Safety Checklist

- [ ] Review migration SQL before applying
- [ ] Ensure database backup exists
- [ ] Test migration in staging environment first
- [ ] Have rollback plan ready
- [ ] Schedule during low-traffic period

### 3.4 Database Backups

**Supabase:** Automatic daily backups included
- Retention: 7 days (free), 30 days (pro)
- Point-in-time recovery available

**Custom Backup Script (if needed):**
```bash
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
```

## 4. Redis

### 4.1 Current Status

Redis is **not currently implemented** in the codebase but is recommended for:
- Session storage
- Caching
- Rate limiting
- Queue management

### 4.2 Recommended Setup

**Platform:** Redis Cloud, Upstash, or AWS ElastiCache

**Environment Variables (when implemented):**
```
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

### 4.3 Integration Points

Future Redis integration should target:
- Session management (replace in-memory sessions)
- API response caching
- Rate limiting counters
- Job queue (BullMQ or similar)

## 5. Object Storage

### 5.1 Current Status

Object storage is **mocked** in `backend/src/documents/object-storage.service.ts`. The current implementation returns placeholder URLs.

### 5.2 Recommended Setup

**Platform:** AWS S3, Supabase Storage, or Cloudflare R2

**Environment Variables:**
```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=khaacho-uploads
```

### 5.3 Implementation Required

Replace the mock `ObjectStorageService` with a real implementation:

```typescript
// Example using AWS SDK v3
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ObjectStorageService {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async putObject(bucket: string, key: string, body: Buffer, contentType?: string) {
    // Implementation
  }

  async getSignedUrl(bucket: string, key: string) {
    // Implementation
  }
}
```

**Storage Requirements:**
- Document uploads (ID, policy documents, etc.)
- File size limits: 10MB per document
- Allowed types: PDF, JPG, PNG
- Private bucket with signed URLs for access

## 6. Environment Variables

### 6.1 Backend Environment Variables

Create `.env` in the `backend` directory:

```bash
# Database (REQUIRED - use pooler URL)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?pgbouncer=true

# JWT Authentication (REQUIRED)
JWT_SECRET=generate-a-strong-random-32+character-secret

# Payment Gateway (REQUIRED for payments)
PAYMENT_WEBHOOK_SECRET=your-payment-provider-webhook-secret

# AI/Chat Service (REQUIRED for chat features)
NVIDIA_API_KEY=your-nvidia-api-key

# Admin Account (for seeding only)
ADMIN_PHONE=977XXXXXXXXX
ADMIN_PASSWORD=use-a-very-strong-password

# Environment
NODE_ENV=production
PORT=8080

# Object Storage (when implemented)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=khaacho-uploads

# Redis (when implemented)
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Error Monitoring (optional but recommended)
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ENVIRONMENT=production

# Logging
LOG_LEVEL=info
```

### 6.2 Website Environment Variables

Create `.env.production` in the `website` directory:

```bash
NEXT_PUBLIC_API_URL=https://api.khaacho.com
NEXT_PUBLIC_SITE_URL=https://www.khaacho.com
```

**Important:** Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never include secrets here.

### 6.3 CRM Environment Variables

Create `.env.production` in the `crm-admin` directory:

```bash
VITE_API_URL=https://api.khaacho.com
```

**Important:** Only variables prefixed with `VITE_` are exposed to the browser. Never include secrets here.

### 6.4 Security Best Practices

- **Never commit `.env` files** (already in `.gitignore`)
- **Use different secrets** for each environment (dev, staging, prod)
- **Rotate secrets regularly** (every 90 days)
- **Use secret management** (Render/Vercel environment variables, AWS Secrets Manager)
- **Never expose service credentials** to frontend applications

## 7. Migrations

### 7.1 Migration Strategy

**Current Migration:** `20260917_khaacho_core_domain`

This migration creates the complete database schema for the insurance platform.

### 7.2 Running Migrations

**Production:**
```bash
cd backend
npx prisma migrate deploy
```

This applies all pending migrations without creating a new one.

### 7.3 Rollback Strategy

**Prisma does not support automatic rollbacks.** To rollback:

1. **Manual Rollback:**
   ```bash
   # Connect to database directly
   psql $DATABASE_URL

   # Identify the migration to rollback
   SELECT * FROM _prisma_migrations ORDER BY finished_at DESC;

   # Manually revert changes (create rollback SQL)
   # Delete the migration record
   DELETE FROM _prisma_migrations WHERE migration_name = 'migration_name';
   ```

2. **Better Approach:** Create a new migration that reverts changes:
   ```bash
   npx prisma migrate dev --name revert_previous_changes
   ```

### 7.4 Migration Safety

- **Always backup before migrating**
- **Test in staging first**
- **Review the generated SQL** in `prisma/migrations/[timestamp]/migration.sql`
- **Never use `prisma migrate dev` in production**

## 8. Backups

### 8.1 Database Backups

**Supabase (Recommended):**
- Automatic daily backups
- Point-in-time recovery (up to 7 days)
- No additional configuration needed

**Custom Backup Script:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
mkdir -p $BACKUP_DIR

pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

**Schedule with cron:**
```bash
0 2 * * * /path/to/backup.sh
```

### 8.2 Object Storage Backups

**S3:** Enable versioning and cross-region replication
**Supabase Storage:** Automatic backups included

### 8.3 Backup Verification

Regularly test backup restoration:
```bash
# Restore to test database
psql $TEST_DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql

# Verify data integrity
npx prisma db pull --schema=./prisma/schema.prisma
```

## 9. Rollback

### 9.1 Application Rollback

**Vercel:**
- Go to Deployments tab
- Click the three dots on a previous deployment
- Select "Promote to Production"

**Render:**
- Go to Deployments tab
- Click "Rollback" on a previous deployment

### 9.2 Database Rollback

See Section 7.3 for migration rollback procedures.

### 9.3 Rollback Procedure

1. **Identify the issue**
2. **Rollback application code** (Vercel/Render)
3. **If database changes were made, rollback migrations** (Section 7.3)
4. **Verify functionality**
5. **Investigate root cause**
6. **Fix and redeploy**

### 9.4 Rollback Testing

Test rollback procedures in staging before production deployment.

## 10. Monitoring

### 10.1 Application Monitoring

**Recommended Tools:**
- **Sentry** - Error tracking and performance monitoring
- **Datadog** - Full-stack monitoring
- **New Relic** - APM and infrastructure monitoring

**Sentry Setup (Recommended):**
```bash
cd backend
npm install @sentry/node @sentry/tracing
```

Add to `main.ts`:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 10.2 Database Monitoring

**Supabase Dashboard:**
- Database size
- Connection pool usage
- Query performance
- Slow query log

**Key Metrics:**
- Connection count
- Query latency
- Database size
- Index usage

### 10.3 Log Aggregation

**Current Status:** Basic console logging via NestJS Logger

**Recommended:** Implement structured logging

```typescript
// Install
npm install winston nest-winston

// Configure in app.module.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

WinstonModule.forRoot({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})
```

### 10.4 Uptime Monitoring

**Recommended Tools:**
- UptimeRobot (free)
- Pingdom
- StatusCake

Monitor:
- API endpoints
- Website
- CRM
- Database connectivity

### 10.5 Alerting

Set up alerts for:
- Error rate > 1%
- Response time > 2s
- Database connection failures
- Disk space < 20%
- Memory usage > 80%

## 11. Cron Jobs / Background Jobs

### 11.1 Current Status

The application has **no cron job scheduler** implemented. Background job logic exists in:
- `RenewalsService` - Renewal reminder jobs
- `NotificationsService` - Notification retry logic

### 11.2 Recommended Implementation

**Option 1: @nestjs/schedule (Simple)**
```bash
npm install @nestjs/schedule
```

```typescript
// In app.module.ts
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // ... other modules
  ],
})
export class AppModule {}
```

**Option 2: BullMQ + Redis (Production-grade)**
```bash
npm install @nestjs/bull bullmq
```

### 11.3 Required Cron Jobs

Based on the codebase, implement these jobs:

1. **Renewal Reminder Job** (daily)
   ```typescript
   @Cron('0 9 * * *') // 9 AM daily
   async processRenewalReminders() {
     const expiring = await this.renewalsService.getAllExpiringPolicies();
     for (const renewal of expiring) {
       if (renewal.nextReminderAt <= new Date()) {
         await this.renewalsService.queueReminderJob(renewal.id, 'send_reminder');
       }
     }
   }
   ```

2. **Notification Retry Job** (every 5 minutes)
   ```typescript
   @Cron('*/5 * * * *')
   async retryFailedNotifications() {
     await this.notificationsService.retryFailedNotifications();
   }
   ```

3. **Database Cleanup Job** (weekly)
   - Clean expired sessions
   - Archive old logs
   - Soft-delete old records

### 11.4 Job Monitoring

Monitor:
- Job execution time
- Failure rates
- Queue depth (if using BullMQ)
- Last successful run

## 12. Webhooks

### 12.1 Payment Webhooks

**Endpoint:** `POST /payments/webhook`

**Current Implementation:**
- Location: `PaymentsService.verifyWebhookSignature()`
- Requires: `PAYMENT_WEBHOOK_SECRET` environment variable
- Signature verification implemented

**Security:**
- Verify webhook signature
- Use idempotency keys
- Process asynchronously

**Environment Variable:**
```
PAYMENT_WEBHOOK_SECRET=your-provider-webhook-secret
```

### 12.2 Webhook Best Practices

1. **Verify signatures** before processing
2. **Use idempotency keys** to prevent duplicate processing
3. **Process asynchronously** - return 200 immediately, process later
4. **Log all webhook events** for debugging
5. **Implement retry logic** for failed webhooks
6. **Secure endpoints** with authentication if possible

### 12.3 Testing Webhooks

Use webhook testing tools:
- ngrok (local testing)
- webhook.site (testing)
- Provider-specific sandboxes

## Security Checklist

### HTTPS
- [ ] SSL/TLS certificate configured
- [ ] HTTP redirects to HTTPS
- [ ] HSTS header enabled

### CORS
- [ ] CORS configured in `main.ts`
- [ ] Production origins whitelisted
- [ ] Credentials allowed for trusted origins

### CSP
- [ ] Content-Security-Policy header configured
- [ ] Script-src restricted
- [ ] Object-src set to 'none'
- [ ] Frame-ancestors set to 'none'

### Rate Limiting
- [ ] @nestjs/throttler configured (10 requests/60s)
- [ ] Consider per-IP rate limiting
- [ ] Consider per-endpoint rate limiting

### Security Headers
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy configured

### Authentication
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] JWT expiration configured
- [ ] CSRF protection implemented
- [ ] Password hashing with bcrypt

### Secrets Management
- [ ] No secrets in code
- [ ] No secrets in frontend (NEXT_PUBLIC_, VITE_)
- [ ] Environment variables used for all secrets
- [ ] .env files in .gitignore

### Database
- [ ] Connection pooling enabled
- [ ] Read-only user for queries
- [ ] Regular backups configured
- [ ] Migration safety procedures

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations tested in staging
- [ ] Backup strategy verified
- [ ] SSL/TLS certificates configured
- [ ] CORS origins updated
- [ ] Rate limiting tested
- [ ] Error monitoring configured
- [ ] Logging configured
- [ ] Webhook endpoints secured
- [ ] Admin account created via seed script
- [ ] Production build verified
- [ ] Rollback procedure tested
- [ ] Monitoring dashboards set up
- [ ] Alerting configured
- [ ] Documentation updated

## Post-Deployment Steps

1. **Create admin account:**
   ```bash
   cd backend
   ADMIN_PHONE=977XXXXXXXXX ADMIN_PASSWORD=strong-password npm run seed:admin
   ```

2. **Verify API health:**
   ```bash
   curl https://api.khaacho.com/health
   ```

3. **Test authentication flow**
4. **Test lead submission from website**
5. **Verify lead appears in CRM**
6. **Test payment flow (if applicable)**
7. **Monitor error logs for 24 hours**
8. **Check database performance metrics**

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check connection pooler status
- Verify network connectivity
- Check database logs

### Build Failures
- Verify Node.js version (18+ recommended)
- Clear node_modules and reinstall
- Check for missing dependencies
- Verify environment variables

### CORS Errors
- Check allowed origins in main.ts
- Verify frontend API URL
- Check browser console for specific error

### Webhook Failures
- Verify PAYMENT_WEBHOOK_SECRET
- Check signature verification logic
- Review webhook provider logs
- Test with webhook testing tools

## Support

For deployment issues:
1. Check logs: `Render Dashboard > Logs` or `Vercel Dashboard > Logs`
2. Review error monitoring (Sentry/Datadog)
3. Check database status in Supabase dashboard
4. Review this documentation

## Additional Resources

- [NestJS Deployment](https://docs.nestjs.com/faq/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production](https://www.prisma.io/docs/guides/database/production-databases)
- [Supabase Production](https://supabase.com/docs/guides/platform/going-to-prod)
