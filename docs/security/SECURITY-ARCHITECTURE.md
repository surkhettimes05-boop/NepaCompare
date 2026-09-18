# Khaacho Security Architecture

## 1. Security objectives

Khaacho is designed for a Nepal-focused insurance platform with operational staff, partner integrations, customer accounts, and sensitive documents. The backend security model must enforce trust at the server boundary and never rely on frontend role checks.

Core principles:

- Enforce every protected action on the backend.
- Never trust client-supplied role values or permission flags.
- Use JWTs for authenticated access and verify session presence server-side.
- Apply role and permission checks on every guarded route.
- Keep audit logs for privileged events without recording secrets.
- Treat documents and payment data as high-risk assets and restrict access by ownership and role.

---

## 2. Identity model

### 2.1 Roles

The system supports these roles:

- SUPER_ADMIN
- ADMIN
- OPERATIONS
- SALES
- CUSTOMER_SUPPORT
- FINANCE
- PARTNER
- CUSTOMER

Role-specific access is mapped centrally through the permission matrix defined in the auth layer. Client code may render roles for UX, but it is never authoritative for authorization.

### 2.2 Granular permissions

Permission examples include:

- LEADS_VIEW
- LEADS_CREATE
- LEADS_ASSIGN
- QUOTES_VIEW
- QUOTES_CREATE
- APPLICATIONS_VIEW
- APPLICATIONS_UPDATE
- DOCUMENTS_VIEW
- DOCUMENTS_UPLOAD
- PAYMENTS_VIEW
- POLICIES_VIEW
- POLICIES_ISSUE
- COMMISSIONS_VIEW
- COMMISSIONS_RECONCILE
- INSURERS_MANAGE
- PRODUCTS_MANAGE
- USERS_MANAGE
- AUDIT_VIEW

These permissions are checked with server-side guards before route execution. A user must satisfy both the route role requirement and the permission requirement when configured.

---

## 3. Authentication and session handling

### 3.1 Authentication flow

- Users authenticate through API endpoints.
- Passwords are never stored in plaintext.
- Passwords are hashed using bcrypt with a strong cost factor.
- JWTs are issued only after successful authentication.
- JWT validation occurs in the Passport strategy and checks the user or staff record before allowing access.

### 3.2 Session handling

The backend should maintain a session record with:

- userId or staffId
- token hash
- user agent
- IP address
- expiration timestamp
- lastSeenAt
- status: ACTIVE, REVOKED, EXPIRED

Session records are used to support logout, revocation, and auditability. Only a token hash is stored; the raw JWT is never logged.

### 3.3 Secure cookies

When browser-based auth is used, the backend should:

- set secure cookies only over HTTPS
- set HttpOnly to prevent client script access
- set SameSite=Lax or Strict depending on the flow
- set a short-lived access token and a refresh token for rotation
- rotate refresh tokens on use and revoke old ones

For API-first clients, bearer auth is still acceptable, but server-side session records remain required for revocation and security monitoring.

---

## 4. Authorization architecture

### 4.1 Route protection

Protected endpoints must be guarded by:

- JwtAuthGuard
- RolesGuard
- permission-based guards when granularity is required

The backend must reject unauthenticated and unauthorized access before business logic executes.

### 4.2 Server-side enforcement

Authorization is enforced in the backend and not in frontend components, routing, or client-only logic. This includes:

- admin-only routes
- customer-only data access
- partner-only portals
- operations and finance specific workflows
- document retrieval and policy access

### 4.3 Customer isolation

Customer endpoints must verify that the requested data belongs to the authenticated customer before returning it. Example rules:

- customer sees only their own applications and policies
- customer cannot access another customer’s documents or KYC records
- customer cannot issue policies or reconcile commissions

### 4.4 Partner isolation

Partner endpoints must ensure a partner can only access:

- their own leads
- their own assigned applications
- their own commission data
- their own documents and activity metadata

### 4.5 Admin protection

Admin and privileged routes are protected by role and permission checks. Even a valid user with a high-level role must also satisfy the required permission set for the specific action.

---

## 5. Password and account security

### 5.1 Password requirements

For staff and customer accounts, enforce:

- minimum length of 12 characters for strong accounts
- prevention of weak or common passwords
- password confirmation on registration or reset flows
- hashing with bcrypt before persistence

### 5.2 Brute force protection

- apply rate limiting on login routes
- increment failed login counters
- lock accounts after repeated failures
- enable temporary lockouts with a cooldown period
- require manual reset or admin unlock for severe lockouts

### 5.3 Account lock / rate limiting strategy

Recommended strategy:

- 5 failed attempts in 15 minutes triggers a temporary lock for 30 minutes
- 10 failed attempts triggers an extended lock or manual verification
- successful login clears fail counters
- lockout events are audit logged without exposing the exact remaining count to attackers

---

## 6. Input validation and hardening

### 6.1 Validation

All request payloads should be validated with NestJS ValidationPipe and DTO constraints. This includes:

- type validation
- required fields
- email validation
- length and format enforcement
- string trimming and sanitization where needed

### 6.2 Secure headers

The application should enable security headers such as:

- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security in production

### 6.3 CSRF protection

CSRF protection is required for cookie-based browser sessions. Use:

- SameSite cookies
- CSRF tokens for state-changing requests
- double-submit token validation for browser-driven mutations

For bearer-token APIs, CSRF risk is lower but not nonexistent when cookies are used alongside tokens.

### 6.4 Rate limiting

Apply throttling to:

- login and registration endpoints
- password-reset endpoints
- document upload endpoints
- high-cost quote and underwriting operations
- public forms and search surfaces with abusive traffic risk

---

## 7. Error handling and safe responses

- Return generic authentication failure messages such as “Invalid credentials”.
- Do not reveal whether an account exists or a password is wrong.
- Do not leak internals via stack traces to API clients.
- Log implementation details server-side only.
- Redact sensitive values from logs.

The backend must never log:

- passwords
- tokens
- payment secrets
- KYC secrets
- document contents
- raw customer identity documents

---

## 8. Audit logging

Every sensitive action should be recorded in an audit log with a safe payload.

Examples of auditable events:

- login success or failure
- logout or session revocation
- role changes
- policy issuance
- commission reconciliation
- document upload or access
- insurer or product management actions
- payment view or reconcile action
- customer profile changes

Audit log payload must include:

- actor identifier
- action name
- entity type and id
- timestamp
- request metadata such as IP and user agent
- safe before/after summary without secrets

---

## 9. Secure document access

Document access must be restricted at the backend layer.

Rules:

- documents are stored with private object references
- access is granted using signed URLs or authenticated server-side retrieval
- only authorized users can view a document
- customer can access only their own documents
- staff roles must be permission-checked before retrieval
- document upload paths must validate content type and size

Documents are treated as sensitive assets and are never exposed via trivial file URLs or direct database binary contents.

---

## 10. Security testing

The backend should include negative tests for:

- unauthorized access to admin routes
- customer attempting to access another customer record
- partner attempting to view other partner data
- inactive or revoked session tokens
- invalid JWTs and expired tokens
- rate-limited login failures
- permission mismatch for privileged actions

These tests must exercise the actual guard behavior on real routes and must not rely on frontend-only checks.

---

## 11. Recommended implementation next steps

1. Add a real session model and secure cookie strategy.
2. Add role-permission seeding for the database.
3. Add permission-aware guards and policy checks to high-risk routes.
4. Add audit logging middleware and centralized event logging.
5. Add document authorization service with object ownership checks.
6. Add comprehensive negative security tests for all guarded routes.
