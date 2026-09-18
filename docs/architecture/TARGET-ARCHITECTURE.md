# Khaacho Target Architecture

## 1. Target business objective

Khaacho is a Nepal-focused digital insurance distribution and comparison platform designed to support the full customer journey:

Customer acquisition
→ insurance requirement
→ quote collection
→ multi-provider comparison
→ assisted purchase
→ application
→ payment
→ policy issuance
→ customer servicing
→ claims assistance
→ renewal
→ cross-selling

The first operational product is motor insurance, with a modular architecture that can later support health, travel, life, property, and SME/business insurance.

---

## 2. Target architecture principles

1. Keep a modular monolith initially.
2. Avoid microservices unless requirements are demonstrated.
3. Preserve useful existing code, routes, and domain concepts.
4. Separate real production data from demo/seed data.
5. Treat insurer pricing and commission logic as configurable, not hardcoded.
6. Make every important business action auditable.
7. Build around real provider integrations, not simulated success paths.
8. Design for Nepal-specific compliance and operations.
9. Maintain strong typing and validation across the stack.
10. Keep the system deployable throughout development.

---

## 3. Target system overview

### 3.1 Product layers

- Public website: customer acquisition, education, comparison, forms, SEO
- Internal admin portal: underwriting, lead management, routing, policy operations
- Core backend: business rules, data orchestration, provider adapters, workflows
- Data layer: PostgreSQL + Prisma with migration discipline
- External integrations: insurer APIs, payment, document storage, notifications, analytics

### 3.2 Runtime topology

- Frontend: Next.js (customer site), React admin app
- Backend: NestJS modular monolith
- Database: PostgreSQL
- Cache/queue: Redis where needed
- Object storage: private S3-compatible storage for documents
- Background jobs: renewal reminders, provider syncs, notifications
- Observability: structured logs, tracing, metrics

---

## 4. Target domain model

### 4.1 Core entities

- Customer
- UserAccount
- StaffMember
- Role
- Partner
- Insurer
- Broker
- SalesAgent
- Lead
- LeadStatusHistory
- QuoteRequest
- QuoteSource
- QuoteOption
- ProviderIntegration
- Application
- Document
- KycRecord
- Payment
- PaymentAttempt
- Policy
- Renewal
- Claim
- Commission
- Invoice
- Notification
- AuditLog
- FeatureFlag
- AnalyticsEvent

### 4.2 Required operational workflow

Lead
→ quote request
→ eligible providers
→ quote options
→ customer selection
→ application submission
→ KYC/documents
→ payment
→ policy issuance
→ renewal/reminder
→ claims/service

---

## 5. Target module architecture

### 5.1 Core modules

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

### 5.2 Responsibilities

#### Auth
- sign-in/sign-out
- JWT/session management
- role and permission checks
- MFA or strong auth where required

#### Customers
- profile management
- saved policies and documents
- customer journey dashboard
- customer-specific preferences

#### Leads
- quote start and lead capture
- sanitization and validation
- assignment to agents or partners
- lifecycle state transitions

#### Quotes
- provider fan-out
- quote normalization
- ranking and comparison
- source metadata and verification

#### Applications
- application creation
- underwriting review
- document requirements
- status tracking

#### Documents
- upload
- secure storage
- signed URL / retrieval
- retention and access control

#### Payments
- payment initiation
- gateway abstraction
- idempotency keys
- reconciliation

#### Policies
- issuance
- policy lifecycle
- renewal triggers
- document generation

#### Claims
- claims intake and triage
- service workflow
- claim status tracking

#### Commissions
- provider commission tracking
- partner payout reconciliation
- reporting

#### Audit
- all critical action logging
- policy change history
- access events

---

## 6. Target quote architecture

### 6.1 Quote source types

- REAL_TIME: connected to configured provider API
- INDICATIVE: internally derived or provider-sourced approximate quote
- MANUAL: submitted or assisted by agent or team

### 6.2 Required quote pipeline

1. Normalize input
2. Validate against product/business rules
3. Determine eligible insurers/providers
4. Query source adapter(s)
5. Normalize provider response to internal quote DTO
6. Apply configured commercial logic only
7. Rank and present comparison
8. Store quote provenance and verification metadata
9. Mark source type and provider name explicitly

### 6.3 Strict rules

- no hardcoded insurer prices in application logic
- no business logic for commission hardcoded in premium pipeline
- no fake “successful” provider responses
- no invented insurance rules
- no insurance quote without source provenance

---

## 7. Target authentication and authorization

### 7.1 Authentication

- secure JWT/session strategy for backend APIs
- no fallback secret in production
- prefer secure cookie/session model for customer flows where feasible
- strong secret management via environment vaults

### 7.2 Authorization

- role and permission-based access control
- resource ownership checks for customer records
- separate agent/admin permissions for operational actions
- all sensitive actions logged to audit trails

### 7.3 Policy model

A central permission matrix should include:

- customer can access own records only
- agent can manage assigned leads and supported applications
- admin can access broader operational views
- insurer/partner access is isolated to relevant domains

---

## 8. Target database design

### 8.1 Data persistence model

The database should model the operational platform, not just marketing data.

Recommended key tables:

- customers
- users
- staff_members
- partners
- insurers
- provider_integrations
- leads
- quote_requests
- quote_options
- applications
- documents
- kyc_records
- payments
- policies
- renewals
- claims
- commissions
- notifications
- audit_logs
- feature_flags

### 8.2 Required design principles

- use UUIDs for external identity
- add explicit status enum tables or values
- add indexes on key lead, quote, and policy queries
- use transactions for financial/business consistency
- use idempotency keys on sensitive operations
- capture provenance fields for quotes and provider operations

### 8.3 Migration discipline

- use Prisma migrations as source of truth
- no schema drift from ad hoc DB changes
- separate seed data from production data
- keep regulatory-pending fields clearly marked and isolated

---

## 9. Target frontend architecture

### 9.1 Public website

The public website remains a customer acquisition site with:

- SEO pages
- comparison pages
- product/vertical pages
- lead capture forms
- education and trust content

Important: it remains a marketing and acquisition surface, not the full business system.

### 9.2 Customer portal

Customer features include:

- login/account management
- saved quotes and applications
- policies and renewals
- document storage and retrieval
- support and claims dashboards
- notifications

### 9.3 Admin portal

The admin portal includes:

- leads inbox and assignment
- underwriting review
- quote comparison workspace
- application status board
- document verification queue
- payment/reconciliation board
- policy lifecycle dashboard
- claims servicing views
- agent and partner performance metrics

---

## 10. Target external integrations

### 10.1 Insurer/provider adapters

Implement a standard adapter abstraction with:

- provider config
- health checks
- request normalization
- error classification
- response mapping
- retry strategy
- auditing and source metadata

### 10.2 Other integrations

- payment gateway(s)
- object storage provider
- notification service
- analytics service
- support CRM if needed

---

## 11. Target observability and reliability

### 11.1 Logging

- structured logs across API and background jobs
- correlation IDs per request or workflow
- no raw sensitive data in logs

### 11.2 Error handling

- shared API error contract
- validation errors distinct from business logic errors
- provider errors separated from operational errors
- retry-safe patterns for payment and issuance flows

### 11.3 Health checks

- readiness probes for database, queue, storage, and provider connectivity
- configuration validation on startup

---

## 12. Target deployment model

### 12.1 Recommended deployment split

- Website: Vercel / Next.js deployment
- Admin app: Vercel or internal hosting
- Backend: managed service or containerized Node runtime
- Database: managed PostgreSQL
- Object storage: secure S3-compatible or equivalent
- Redis: managed cache/queue service
- Secrets: environment secrets manager

### 12.2 Production readiness checklist

- env variable validation on startup
- feature flags for incomplete functionality
- not using localStorage for sensitive auth tokens
- secure document storage
- enabled audit logging
- payment and issuance idempotency
- explicit outage/error handling
- scheduled backups

---

## 13. Target implementation sequence

### Phase 1: Foundation
- fix module/test setup and dependency injection integrity
- add migration discipline and database schema baseline
- define env config and secret strategy
- implement audit log skeleton and feature flags

### Phase 2: Motor-first workflow
- lead model and lifecycle
- quote source abstraction
- insurer provider configuration
- application and document states
- payment abstraction and idempotency

### Phase 3: Operations
- admin workflows
- partner routing and commission model
- policy issuance and renewal reminders
- support and claims operations

### Phase 4: Expansion
- health, travel, life, property, SME
- provider-specific rule configuration
- broader analytics and reporting

---

## 14. Key design choices to preserve

The target architecture should preserve the useful pieces already working in the repo, including:

- modular app split
- NestJS backend foundation
- Prisma schema breadth
- marketing-first website architecture
- lead-management mindset
- CRM concept and routing behavior
- motor-first product direction

The target should not discard those foundations simply because a different framework preference exists.

---

## 15. Final target state

The future Khaacho platform should be a secure, auditable, Nepal-focused insurance distribution system centered on motor insurance first, but built with a reusable modular monolith that can expand safely into additional insurance categories without rearchitecting the whole platform.
