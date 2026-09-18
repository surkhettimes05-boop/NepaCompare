# Khaacho API Standards

This document defines the standardized REST API contract for the Khaacho backend.

## 1. Base conventions

- Base URL: `https://api.khaacho.com` in production.
- API versioning: the platform currently exposes versionless REST endpoints at the route root, with future minor compatibility handled via versioned prefixes when needed.
- Content type: `application/json` for request and response bodies.
- Authentication: JWT bearer token unless an endpoint is intentionally public.
- Idempotency: required for payment creation and any mutation that is client retried or webhook-driven.

## 2. Common response format

### Success response

```json
{
  "data": {
    "id": "uuid",
    "status": "SUCCESS"
  },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2026-09-18T00:00:00.000Z"
  }
}
```

### Error response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "issue": "must be an email address"
      }
    ],
    "requestId": "uuid"
  }
}
```

## 3. HTTP semantics

### Standard methods

- `GET`: read-only retrieval.
- `POST`: create new resource or trigger action.
- `PATCH`: partial update.
- `PUT`: full replacement when supported.
- `DELETE`: soft-delete or permanent delete based on policy.

### Resource behavior

- Use plural resource names in the path.
- Keep the route shape stable and predictable.
- Never expose raw database identifiers if a public-facing reference is unnecessary.
- Prefer nested resources only when the relationship is clear and durable.

## 4. Authentication and authorization

### Authentication

- Use Bearer JWT tokens in the `Authorization` header.
- Example: `Authorization: Bearer <token>`.

### Authorization model

- `CUSTOMER`: access to customer-owned resources and quote submission.
- `SALES`, `OPERATIONS`, `ADMIN`, `SUPER_ADMIN`: internal operational access.
- `FINANCE`: finance and reconciliation visibility.
- `PARTNER`: partner dashboard and assigned attribution visibility.

### Access control rules

- Customers can access only their own data unless explicitly allowed.
- Staff and partner users cannot access unrelated records.
- Private endpoints should enforce both JWT and role/permission guards.

## 5. Validation conventions

- All incoming request bodies are validated server-side using DTO constraints.
- Reject unknown fields when the endpoint allows strict schema validation.
- Use meaningful validation messages and preserve request context in the error payload.

## 6. Pagination, filtering, sorting

### Pagination

Use query parameters:

- `page`: integer, defaults to 1
- `limit`: integer, defaults to 20, max 100
- `cursor`: used for cursor pagination when a stable ordering is required

Example:

```http
GET /leads?page=2&limit=25
```

Response metadata:

```json
{
  "data": [],
  "meta": {
    "page": 2,
    "limit": 25,
    "total": 320,
    "totalPages": 13
  }
}
```

### Filtering

Use exact query parameters for supported fields, for example:

- `status`
- `insurerId`
- `partnerId`
- `productType`
- `customerId`
- `fromDate`
- `toDate`

### Sorting

Use:

- `sortBy` — field to order by
- `sortOrder` — `asc` or `desc`

Example:

```http
GET /applications?status=SUBMITTED&sortBy=createdAt&sortOrder=desc
```

## 7. Rate limiting and abuse protection

- Default server-side limit: 10 requests per 60 seconds for general API traffic.
- Auth endpoints are stricter, with 5 requests per 60 seconds.
- Payment and webhook endpoints must be rate-limited and verified to prevent replay abuse.
- Webhooks require signature verification where available.

## 8. Idempotency

Idempotency keys are required for actions with client retries or payment intent creation.

Headers:

- `Idempotency-Key: <uuid>`

Suggested behavior:

- If the same key is reused with the same payload, return the original result.
- If the same key is reused with a different payload, reject with `409 CONFLICT`.

## 9. Endpoint groups

### /auth

Purpose: login, registration, token issuance and auth-related flows.

Routes:

- `POST /auth/login` — staff login
- `POST /auth/customer-register` — customer registration
- `POST /auth/customer-login` — customer login

Notes:

- Rate-limit login attempts.
- Do not return password hashes or internal auth secrets.

### /customers

Purpose: customer data and profile management.

Routes:

- `GET /customers`
- `GET /customers/:id`
- `PATCH /customers/:id`
- `DELETE /customers/:id`

### /leads

Purpose: lead submission, routing and sales lifecycle.

Routes:

- `POST /leads` — public lead creation for inbound interest
- `GET /leads`
- `GET /leads/:id`
- `PATCH /leads/:id`
- `PATCH /leads/:id/route`
- `DELETE /leads/:id`
- `POST /leads/:id/buy`

### /insurers

Purpose: insurer registry and product management.

Routes:

- `POST /insurers`
- `GET /insurers`
- `GET /insurers/:id`
- `PATCH /insurers/:id`
- `DELETE /insurers/:id`
- `POST /insurers/:id/products`
- `GET /insurers/:id/products`
- `GET /insurers/products/:productId`
- `PATCH /insurers/products/:productId`
- `DELETE /insurers/products/:productId`

### /products

Purpose: public product catalog and comparison-safe product metadata.

Routes:

- `GET /products`
- `GET /products/:id`
- `GET /products/:id/coverages`
- `GET /products/:id/add-ons`

Notes:

- Do not return internal insurer rate-table or private pricing internals unless explicitly authorized.

### /quotes

Purpose: indicative price and comparison generation.

Routes:

- `GET /quotes`
- `POST /quotes`
- `GET /quotes/:id`
- `PATCH /quotes/:id`

Notes:

- Quotes are indicative and never treated as final insurer acceptance.

### /applications

Purpose: customer applications and underwriting workflow.

Routes:

- `POST /applications`
- `GET /applications`
- `GET /applications/:id`
- `PATCH /applications/:id`
- `POST /applications/:id/review`
- `POST /applications/:id/submit`

### /documents

Purpose: document upload, metadata and signed retrieval.

Routes:

- `POST /documents/upload`
- `GET /documents`
- `GET /documents/:id`
- `DELETE /documents/:id`

Notes:

- Keep documents outside the relational core when possible.
- Return signed URLs, not raw storage internals.

### /kyc

Purpose: KYC verification workflow, separate from general document storage.

Routes:

- `POST /kyc`
- `GET /kyc`
- `GET /kyc/:id`
- `PATCH /kyc/:id/status`

Notes:

- KYC is a separate process from document storage.
- Do not bundle KYC metadata into unrelated document records.

### /payments

Purpose: payment creation, verification and provider callback processing.

Routes:

- `POST /payments/create`
- `GET /payments/:paymentReference/status`
- `PATCH /payments/:paymentReference/verify`
- `POST /payments/:paymentReference/refund`
- `POST /payments/webhooks/provider`

Notes:

- Idempotency required.
- Do not trust frontend payment success as final confirmation.

### /policies

Purpose: issued policy records and lifecycle tracking.

Routes:

- `GET /policies`
- `GET /policies/:id`
- `PATCH /policies/:id`

### /renewals

Purpose: renewal workflow, prompts and scheduling.

Routes:

- `GET /renewals`
- `GET /renewals/:id`
- `POST /renewals`
- `PATCH /renewals/:id`
- `POST /renewals/:id/remind`

### /claims

Purpose: claim assistance and insurer coordination workflow.

Routes:

- `POST /claims`
- `GET /claims`
- `GET /claims/:id`
- `PATCH /claims/:id`
- `POST /claims/:id/notes`

Notes:

- Khaacho must not pretend to approve claims.
- Claim statuses must reflect assistance and insurer process, not approval guarantees.

### /commissions

Purpose: commission and financial reconciliation records.

Routes:

- `GET /commissions`
- `GET /commissions/:id`
- `POST /commissions`
- `PATCH /commissions/:id`
- `POST /commissions/:id/adjustments`

Notes:

- Premium facilitated is not Khaacho revenue.
- Separate commission revenue from operating costs and contribution metrics.

### /partners

Purpose: partner onboarding, referrals and dashboards.

Routes:

- `POST /partners`
- `GET /partners`
- `GET /partners/:id`
- `PATCH /partners/:id`
- `GET /partners/me/dashboard`
- `GET /partners/me/leads`
- `GET /partners/me/commissions`

### /notifications

Purpose: outbound notification orchestration.

Routes:

- `POST /notifications`
- `GET /notifications`
- `GET /notifications/:id`
- `PATCH /notifications/:id`
- `POST /notifications/preferences`

Notes:

- Notifications are provider-agnostic.
- Do not mark as delivered until a provider confirmation or callback is validated.

### /analytics

Purpose: funnel, business and operational metrics.

Routes:

- `POST /analytics/events`
- `GET /analytics/funnel`
- `GET /analytics/dashboard`
- `GET /analytics/business`
- `GET /analytics/partners`
- `GET /analytics/export`

Notes:

- Keep personal data out of analytics payloads.
- Only track sanitized metadata.

### /audit

Purpose: immutable audit trails and operational review.

Routes:

- `GET /audit`
- `GET /audit/:id`

Notes:

- Audit entries should be append-only within the operational system.

## 10. Standard error codes

- `400 BAD_REQUEST`: malformed request or validation failure
- `401 UNAUTHORIZED`: missing or invalid auth token
- `403 FORBIDDEN`: authenticated but lacking permission
- `404 NOT_FOUND`: resource not found
- `409 CONFLICT`: duplicate or idempotency conflict
- `422 UNPROCESSABLE_ENTITY`: business rule validation failed
- `429 TOO_MANY_REQUESTS`: rate limit exceeded
- `500 INTERNAL_SERVER_ERROR`: unexpected server error

## 11. OpenAPI / Swagger

The backend exposes Swagger/OpenAPI docs under:

- `/api/docs`

This should be treated as the canonical generated API reference for current endpoints and request schemas.

## 12. Security notes

- Do not expose database tables or schema internals in public API responses.
- Hide raw identifiers or internal mappings where not needed.
- Use signed URLs for documents.
- Treat every webhook as untrusted until signature verification passes.
- Never rely on frontend client-side checks for financial or authorization decisions.

## 13. Future API governance

- New endpoints must follow the same naming, pagination, auth and error conventions.
- New fields must be documented in Swagger before release.
- Breaking changes should be versioned deliberately and announced.
