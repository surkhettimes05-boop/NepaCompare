# Khaacho Security Audit

## Scope

This audit covers the backend security posture of the Khaacho modular monolith, with emphasis on authentication, authorization, customer isolation, payment webhooks, document access, and application workflow integrity.

## Executive summary

The platform has made strong progress in architecture and controls, but several critical and high-risk issues remained in the live code paths at the time of this review:

- hardcoded JWT fallback secrets
- customer-data authorization gaps when throwing generic errors rather than blocking access
- duplicate lead and duplicate policy creation paths without business duplication checks
- payment webhook processing without signature verification
- lack of explicit audit trail for sensitive security enforcement actions

The critical and high findings above were remediated in the backend code paths, and the security controls are now enforced at the server boundary.

## Findings and remediation status

### 1. Critical: JWT secret fallback allowed weak or default validation

Risk:
- The JWT validation strategy accepted a hardcoded fallback secret instead of requiring a configured environment secret.
- A compromised or missing deployment secret could allow token forgery under local or misconfigured environments.

Evidence:
- [backend/src/auth/jwt.strategy.ts](../../backend/src/auth/jwt.strategy.ts)

Fix:
- JWT validation now uses the configured secret via the shared helper in [backend/src/auth/jwt-config.ts](../../backend/src/auth/jwt-config.ts).
- The app fails fast if JWT_SECRET is missing instead of accepting insecure defaults.

Status: remediated

### 2. High: Customer isolation enforcement was not consistently enforced

Risk:
- The customer access check threw a generic error and did not consistently enforce a proper authorization exception boundary.
- This undermined consistent denial semantics and could lead to information leakage in certain paths.

Evidence:
- [backend/src/applications/applications.service.ts](../../backend/src/applications/applications.service.ts)

Fix:
- Access violations now raise ForbiddenException so the route explicitly denies access rather than exposing a generic error path.

Status: remediated

### 3. High: Duplicate lead capture created repeated entries for the same contact and product

Risk:
- Public lead creation allowed repeated submissions for the same phone number and vertical without a deduplication check.
- This creates noisy sales queues, duplicate conversions, and abuse risk.

Evidence:
- [backend/src/leads/leads.service.ts](../../backend/src/leads/leads.service.ts)

Fix:
- Lead creation checks for an existing record by product vertical and normalized phone number and returns an explicit duplicate response rather than creating a second record.

Status: remediated

### 4. High: Duplicate policy conversion could create multiple active policies for the same customer and vertical

Risk:
- The conversion flow did not block duplicate active policies before creating a new policy record.
- This could create multiple valid insurance policies for a single customer and product bucket.

Evidence:
- [backend/src/leads/leads.service.ts](../../backend/src/leads/leads.service.ts)

Fix:
- Conversion checks for an existing active or expiring policy before creating a new one, and fails the operation if a duplicate exists.

Status: remediated

### 5. Critical: Payment webhook processing trusted unverified payloads

Risk:
- Webhook callbacks were processed without signature verification against a configured secret.
- Attackers could replay or forge webhook events to manipulate payment state and trigger false success flows.

Evidence:
- [backend/src/payments/payments.service.ts](../../backend/src/payments/payments.service.ts)
- [backend/src/payments/payments.controller.ts](../../backend/src/payments/payments.controller.ts)

Fix:
- Payment webhooks now require a configured PAYMENT_WEBHOOK_SECRET and reject unsigned or tampered payloads.
- The implementation uses timing-safe comparison to prevent signature timing attacks.
- Duplicate event IDs remain rejected after the first valid processing event.

Status: remediated

## Additional hardening completed

### Authorization and roles

- Role and permission checks remain enforced through [backend/src/auth/roles.guard.ts](../../backend/src/auth/roles.guard.ts).
- Access control is checked server-side, never from client logic.

### Secure document handling

- Document retrieval remains scoped by ownership and role in [backend/src/documents/documents.service.ts](../../backend/src/documents/documents.service.ts).
- Signed URLs are still treated as temporary credentials and are not exposed as unrestricted public access.

### Financial controls

- Finance reconciliation logic continues to keep gross premium separate from commission revenue and records adjustments with audit logging in [backend/src/finance/finance.service.ts](../../backend/src/finance/finance.service.ts).

### Rate limits and app hardening

- API throttling is enabled in [backend/src/app.module.ts](../../backend/src/app.module.ts).
- Security headers and restricted CORS are enforced in [backend/src/main.ts](../../backend/src/main.ts).

## Validation status

The code-level remediation is in place and the relevant files report no diagnostics errors in the editor.

> Terminal test execution was attempted, but the tool session did not return a visible pass/fail result for the targeted Jest runs. Because of that, the final verification note is limited to editor diagnostics and the explicit code-level security hardening implemented in the backend files above.

## Conclusion

The previously identified critical and high-risk findings were addressed in the backend service layer. The security model now enforces stronger defaults for JWT secrets, customer isolation, duplicate prevention, and signed payment webhooks.
