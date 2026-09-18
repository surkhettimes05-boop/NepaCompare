# Khaacho Current-State Technical Audit

## 1. Current architecture

### 1.1 Monorepo structure

The repository is organized as a multi-app platform with separate surfaces:

- Backend API: [backend](../../backend)
- Website (customer acquisition): [website](../../website)
- CRM Admin (internal operations): [crm-admin](../../crm-admin)
- Worker API: [worker-api](../../worker-api)
- Supporting audit and deployment docs: [README.md](../../README.md), [PROJECT_AUDIT.md](../../PROJECT_AUDIT.md), [DEPLOYMENT_CHECKLIST.md](../../DEPLOYMENT_CHECKLIST.md), [LAUNCH_READINESS.md](../../LAUNCH_READINESS.md)

### 1.2 Runtime architecture

Current state is a hybrid of:

- NestJS backend for business logic and API endpoints
- Next.js customer website for marketing, SEO pages, quote requests, dashboard
- Vite React CRM admin for lead handling and partner routing
- Prisma/PostgreSQL-backed persistence model
- lightweight mock/adapter-based quote generation rather than real insurer integration
- static route-driven web UI, not yet a complete insurance platform workflow

### 1.3 High-level system flow

The repo currently supports a basic customer journey:

1. User browses SEO and comparison pages
2. User submits a lead through a form
3. Backend creates a lead record
4. Quote endpoint resolves insurer candidates from DB
5. Adapter layer generates mock results and rating adjustments
6. Comparison page displays quote options
7. Customer can log in and view dashboard or renewals
8. Admin can view leads and route to a partner

This is a workable MVP layer, but it is not yet a complete operational insurance platform.

### 1.4 Existing key files

- Root package: [package.json](../../package.json)
- Backend package: [backend/package.json](../../backend/package.json)
- Website package: [website/package.json](../../website/package.json)
- CRM package: [crm-admin/package.json](../../crm-admin/package.json)
- Worker API package: [worker-api/worker-api/package.json](../../worker-api/worker-api/package.json)
- App module: [backend/src/app.module.ts](../../backend/src/app.module.ts)
- Main bootstrap: [backend/src/main.ts](../../backend/src/main.ts)
- Prisma schema: [backend/prisma/schema.prisma](../../backend/prisma/schema.prisma)
- Prisma service: [backend/src/prisma.service.ts](../../backend/src/prisma.service.ts)

---

## 2. Existing features

### 2.1 Backend features

The backend currently includes:

- authentication and JWT token issuance
- role-based access control
- lead creation and retrieval
- lead routing to partners
- quote generation and comparison
- basic rating engine
- renewal listing and renewal flow
- support ticket creation
- wellness appointment booking
- SEO data endpoints
- AI chat endpoint using OpenAI-compatible provider
- seeded admin and partner data

### 2.2 Website features

The website includes:

- landing pages and educational content
- SEO-focused comparison pages
- product pages for motor/health/life/travel-related content
- customer registration and login
- customer dashboard for policies, quotes, support, wellness
- lead form capture
- chat widget
- comparison pages and quote request flows

### 2.3 CRM admin features

The admin app includes:

- login screen
- protected routes
- leads inbox
- lead detail view
- route-to-partner action
- export CSV from leads
- partners page
- rate tables page
- renewals page

### 2.4 Data and SEO features

The schema and SEO endpoints support:

- content pages
- insurer metadata
- city metadata
- vehicle model metadata
- partner metadata
- structured SEO pages and generated metadata

---

## 3. Existing database entities

The Prisma schema in [backend/prisma/schema.prisma](../../backend/prisma/schema.prisma) includes the following domain entities:

### 3.1 Core user and staff

- User
- Staff
- Role enum: CUSTOMER, AGENT, ADMIN

### 3.2 Partner and lead management

- Partner
- PartnerType: INSURER, AGENT, BROKER
- IntegrationType: MOCK_STANDARD, MOCK_LEGACY_REST
- Lead
- LeadStatus enum
- LeadStatusHistory
- RateTable
- RoutingRule
- Invoice
- InvoiceStatus

### 3.3 Content and review

- ContentPage
- Review
- ReviewStatus

### 3.4 Policy and renewals

- Policy
- PolicyStatus: ACTIVE, EXPIRING_SOON, EXPIRED, RENEWED

### 3.5 Cross-sell / financial product features

- CreditProfile
- FinancialProduct
- FinancialApplication
- ApplicationStatus
- FinancialProductType

### 3.6 Wellness and support

- Appointment
- AppointmentType
- AppointmentStatus
- SupportTicket
- TicketStatus

### 3.7 SEO and vehicle metadata

- City
- VehicleModel
- VehicleType

### 3.8 Important observation

The schema is broader than the current API implementation. It hints at a more complete platform than the code currently delivers, but it does not yet express a complete insurance lifecycle in a production-safe design.

### 3.9 Migration state

The Prisma directory currently contains:

- [backend/prisma/schema.prisma](../../backend/prisma/schema.prisma)
- local database file at [backend/prisma/dev.db](../../backend/prisma/dev.db)

There is no visible migrations directory under backend/prisma. That means the repo currently depends on the schema file and local dev DB state rather than a disciplined migration history.

---

## 4. Existing APIs

### 4.1 Backend API inventory

From controller files:

- [backend/src/auth/auth.controller.ts](../../backend/src/auth/auth.controller.ts)
  - POST /auth/login
  - POST /auth/customer-register
  - POST /auth/customer-login

- [backend/src/leads/leads.controller.ts](../../backend/src/leads/leads.controller.ts)
  - POST /leads
  - GET /leads
  - GET /leads/:id
  - PATCH /leads/:id
  - PATCH /leads/:id/route
  - DELETE /leads/:id
  - POST /leads/:id/buy

- [backend/src/quotes/quotes.controller.ts](../../backend/src/quotes/quotes.controller.ts)
  - GET /quotes

- [backend/src/users/users.controller.ts](../../backend/src/users/users.controller.ts)
  - GET /users/me/quotes

- [backend/src/renewals/renewals.controller.ts](../../backend/src/renewals/renewals.controller.ts)
  - GET /renewals/my-policies
  - GET /renewals/expiring-all
  - POST /renewals/:id/renew

- [backend/src/support/support.controller.ts](../../backend/src/support/support.controller.ts)
  - likely support ticket endpoints (not fully visible in the initial audit, but present as module/service pattern)

- [backend/src/wellness/wellness.controller.ts](../../backend/src/wellness/wellness.controller.ts)
  - appointment endpoints for users

- [backend/src/chat/chat.controller.ts](../../backend/src/chat/chat.controller.ts)
  - POST /chat/message

- [backend/src/seo/seo.controller.ts](../../backend/src/seo/seo.controller.ts)
  - GET /seo/insurers
  - GET /seo/cities
  - GET /seo/vehicles

### 4.2 API quality assessment

The API layer is functional but uneven:

- some endpoints are fully implemented
- some services are minimal or stubbed
- several routes are present but not fully aligned to the target platform lifecycle
- validation is inconsistent across modules
- many service methods do not enforce broader business rules beyond simple DB CRUD

---

## 5. Existing authentication

### 5.1 Current auth model

Authentication is implemented using NestJS JWT with Passport.

Files involved:

- [backend/src/auth/auth.controller.ts](../../backend/src/auth/auth.controller.ts)
- [backend/src/auth/auth.module.ts](../../backend/src/auth/auth.module.ts)
- [backend/src/auth/jwt.strategy.ts](../../backend/src/auth/jwt.strategy.ts)
- [backend/src/auth/jwt-auth.guard.ts](../../backend/src/auth/jwt-auth.guard.ts)
- [backend/src/auth/roles.guard.ts](../../backend/src/auth/roles.guard.ts)
- [backend/src/auth/roles.decorator.ts](../../backend/src/auth/roles.decorator.ts)
- [backend/src/auth/jwt-config.ts](../../backend/src/auth/jwt-config.ts)

### 5.2 Auth capabilities

- Admin login via phone + password
- Customer registration with email/phone/password
- Customer login via email + password
- JWT payload includes sub, role, and phone or email data
- JWT strategy validates against User or Staff records
- role guard protects routes by CUSTOMER, AGENT, ADMIN

### 5.3 Auth issues

- JWT secret falls back to a hardcoded string in [backend/src/auth/jwt.strategy.ts](../../backend/src/auth/jwt.strategy.ts), which is not acceptable for production
- customer auth is not implemented in secure cookie form; browser localStorage is used in the website client
- some auth checks rely on browser-side redirect patterns, not server-enforced security at all entry points
- no session rotation, refresh token model, MFA, or device/session tracking
- no explicit audit trail for authentication events

---

## 6. Existing admin capabilities

Admin functionality is present in the CRM app and backend but still partial.

### 6.1 Admin capability inventory

- login with staff account
- list leads
- route lead to partner
- view lead status history
- basic CSV export
- rate table management endpoints exist in service layer
- partner management skeleton exists
- renewals listing for expiring policies

### 6.2 Admin route structure

- [crm-admin/src/App.tsx](../../crm-admin/src/App.tsx)
- [crm-admin/src/pages/Dashboard.tsx](../../crm-admin/src/pages/Dashboard.tsx)
- [crm-admin/src/pages/LeadsInbox.tsx](../../crm-admin/src/pages/LeadsInbox.tsx)
- [crm-admin/src/pages/LeadDetail.tsx](../../crm-admin/src/pages/LeadDetail.tsx)
- [crm-admin/src/pages/Partners.tsx](../../crm-admin/src/pages/Partners.tsx)
- [crm-admin/src/pages/Renewals.tsx](../../crm-admin/src/pages/Renewals.tsx)

### 6.3 Admin limitations

- no full application workflow in the CRM
- no commission reconciliation 
- no underwriting review workflow
- no document review dashboard
- no payment review console
- no claim handling console
- no robust audit UI
- no feature-flag or role matrix beyond basic admin/agent

---

## 7. Existing customer capabilities

The customer frontend and backend currently support:

- registration and login
- viewing policy and quote context from dashboard
- renewing expiring policies
- creating support tickets
- booking wellness appointments
- exploring landing and comparison pages
- requesting a quote via lead form

The customer dashboard in [website/src/app/dashboard/page.tsx](../../website/src/app/dashboard/page.tsx) shows a “Unified Digital Locker” model with:

- active policies
- quote history
- document download simulation
- wellness bookings
- support requests

This is a valuable UX foundation but it is still a front-end prototype, not a secure operational account system.

---

## 8. Broken features

The repo has several concrete issues revealed by the current test run and architecture review:

### 8.1 Broken tests / dependency resolution

The recent backend test run indicates multiple controller/service specs are failing because required providers are not provided in the testing context.

Examples:

- ChatController cannot resolve ChatService
- QuotesController cannot resolve QuotesService
- UsersController cannot resolve PrismaService
- WellnessController cannot resolve WellnessService
- ChatService cannot resolve PrismaService
- WellnessService cannot resolve PrismaService

This is a direct signal that the backend unit tests are not yet valid for the current module graph and service composition.

### 8.2 Module/service mismatch

There are modules and controllers for many areas, but some service implementations are empty or incomplete.

Examples:

- [backend/src/auth/auth.service.ts](../../backend/src/auth/auth.service.ts) is empty
- [backend/src/partners/partners.service.ts](../../backend/src/partners/partners.service.ts) is stubbed
- multiple modules have controller/spec scaffolds but no robust implementation coverage

### 8.3 Quote realism issue

The quote layer in [backend/src/quotes/quotes.service.ts](../../backend/src/quotes/quotes.service.ts) uses deterministic hash-based premiums rather than actual insurer conversation or configured marketplace logic. This is a product-level issue, not just a test issue.

### 8.4 Seed data and demo data risk

The pattern in [backend/src/renewals/renewals.service.ts](../../backend/src/renewals/renewals.service.ts) creates synthetic user policy data when missing. This is not legitimate production behavior and risks masking missing business flows.

### 8.5 Environment and deploy configuration gaps

- no full production env definition file visible for backend
- no explicit Redis, object storage, or payment configuration
- no clear path for environment-specific config at deployment

---

## 9. Security issues

### 9.1 JWT and auth security

- hardcoded JWT secret fallback in [backend/src/auth/jwt.strategy.ts](../../backend/src/auth/jwt.strategy.ts)
- no refresh token model
- no secure cookie-based session handling for customer auth
- token storage in localStorage in the front end

### 9.2 Data protection

The repo has no demonstrated secure document storage policy or DLP controls. Customer documents and personal data are not yet modeled with retention, encryption, or access control patterns.

### 9.3 Input validation and abuse protection

- validation exists at controller-level with ValidationPipe
- but broader validation patterns are uneven by module
- API abuse protections are minimal beyond global throttling on app startup
- no separate validation layer for quote parameters, KYC, and payment requests

### 9.4 Critical file exposures

The repo includes local environment files and DB artifacts in the working tree, which must be treated carefully for secrets and production data hygiene.

---

## 10. Technical debt

### 10.1 Domain debt

- product domain overlaps with finance and wellness modules that are not core to the immediate motor-first product
- some features are broad and pre-architected but not yet integrated into actual workflows

### 10.2 Implementation debt

- many controllers and services exist but are only boilerplate or partial implementation
- test scaffolding is incomplete
- no migration history exists
- no consistent error-handling contract across API endpoints
- no structured logging strategy
- no consistent observability or monitoring setup

### 10.3 Frontend debt

- website has strong marketing pages but inconsistent business logic separation
- dashboard uses browser-side fetch logic and localStorage heavily
- UI appears more complete than the server-side business logic behind it

---

## 11. Duplicate implementations

### 11.1 Marketing and internal platform overlap

The repo contains multiple data models and experiences for the same domain:

- website customer journey
- CRM admin operations
- backend data model
- seed/demo data scripts

These are not yet unified under one service architecture or one domain language.

### 11.2 Similar concepts represented in multiple ways

Examples:

- lead creation and policy lifecycle are represented separately across lead, policy, and renewals domains
- “quote” concept exists partly in front-end UI, partly in backend rating engine, partly in policy conversion flow
- customer dashboard includes policies, quotes, support, and wellness in one page, but this is not yet backed by a consistent domain model

---

## 12. Missing functionality

The current repo does not yet include, to the required production level:

- real insurer integration registry and provider adapters
- quote source management (REAL_TIME, INDICATIVE, MANUAL)
- document/upload management with secure storage
- proper policy issuance lifecycle
- payment and idempotency model
- commission infrastructure
- claims management flow
- audit trail and activity log
- event-driven background jobs
- customer support escalation and SLA tracking
- business configuration layer for regulatory/commercial assumptions
- feature flags for incomplete operational features

---

## 13. Recommended target architecture

### 13.1 Recommended architecture choice

The best target is still a modular monolith with clear business domains, not a microservice split.

This is consistent with the project requirements and the current repo structure.

### 13.2 Recommended target structure

The platform should be organized into modules such as:

- auth
- users
- customers
- leads
- insurers
- insurance
- quotes
- applications
- documents
- payments
- policies
- renewals
- claims
- commissions
- partners
- notifications
- analytics
- audit
- feature-flags

### 13.3 Target runtime architecture

- Next.js website for customer acquisition and public education
- Next.js/React admin portal for internal operations or a dedicated internal dashboard layer
- NestJS modular monolith for business logic and API operations
- PostgreSQL as system of record
- Prisma as ORM and migration manager
- Redis for queues and caching where appropriate
- object storage for protected documents
- background jobs for reminders, sync, and workflow orchestration
- provider adapters for insurer systems

### 13.4 Target domain model

The target model should include explicit operational entities:

- Customer
- Lead
- QuoteRequest
- QuoteOption
- Insurer
- InsurerIntegration
- Application
- KycRecord
- Document
- Payment
- Policy
- Renewal
- Claim
- Commission
- Partner
- SalesAgent
- AuditLog
- Notification
- FeatureFlag
- AnalyticsEvent

### 13.5 Target quote architecture

Quote generation should be separated into source types:

- REAL_TIME: provider-integrated live quotes
- INDICATIVE: calculated or cached quote results from configured provider data
- MANUAL: manually reviewed or assisted quote workflow

The quote pipeline should enforce:

- provider configuration
- source verification
- normalized quote DTOs
- no fictional price generation without a live or configured provider source
- auditable quote provenance

### 13.6 Target authorization model

- customer access restricted to own records
- staff access controlled by role and permissions
- admin and agent access segmented by function
- sensitive operations require explicit authorization checks and audit entries

### 13.7 Target deployment model

- frontend: Vercel or equivalent edge deployment
- backend: managed Node hosting or container-based deployment
- database: managed PostgreSQL
- object storage: secure private document storage
- redis: queue + cache
- env vars and secrets via secure secret manager

---

## 14. Migration risks

### 14.1 Data migration risk

There is no visible migration history, so a production migration would require a careful database review and bootstrapping plan.

### 14.2 Domain drift risk

The schema and modules include concepts that are not yet fully implemented; migrating into a clean domain model may require careful backfill and mapping.

### 14.3 Business process risk

Some flows are mocked or simulated. Replacing them with true operational flows without testing could break the conversion funnel.

### 14.4 Security migration risk

If auth patterns are changed from localStorage to secure cookies or server-side sessions, the UI and API contract must be updated together.

### 14.5 Vendor integration risk

Attempting to add real insurer integrations before the provider abstraction and configuration layer is in place could create fragile and brittle code.

---

## 15. Deployment risks

### 15.1 Environment inconsistency

The repo includes multiple app packages but not a single unified deployment and environment model.

### 15.2 Frontend/backend contract mismatch

The website uses environment variables and fetch calls to the backend, but the production deployment path is not yet fully standardized across all app surfaces.

### 15.3 Missing operational readiness

No evidence of:

- health checks
- queue workers
- monitoring
- alerts
- backup restore process
- secret rotation
- object storage lifecycle
- payment failure handling
- retry-safe orchestration

### 15.4 Business-risk deployment

The current quote functionality is still heavily mock-driven. Deploying this as a “real” insurance experience without provider-backed validation would be misleading and potentially non-compliant.

---

## 16. Critical findings summary

The repo is a promising MVP foundation, but it is not yet a production insurance platform.

The strongest components are:

- modular app split
- NestJS foundation
- Prisma schema breadth
- marketing and comparison pages
- lead flow foundations
- CRM workflow starting point

The main blockers are:

- inconsistent service implementation quality
- mock quote generation disguised as live insurance pricing
- missing operational model for applications, payments, and documents
- weak authentication and secret management patterns
- no migration history
- no hardened production deployment design

---

## 17. Recommended next step after this audit

Before any feature implementation, the next step should be to lock the domain model and migration plan around the motor-first product, then build the quote-source abstraction and application lifecycle around that model.

This keeps the architecture aligned with the business goal while preserving the useful structure already present in the repo.
