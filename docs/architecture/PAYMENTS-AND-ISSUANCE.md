# Khaacho Payments and Policy Issuance Architecture

## 1. Objectives

Khaacho must treat payment and policy issuance as controlled, auditable, server-side operations. The system must never trust frontend success indicators, must verify payment state on the server, and must not mark a policy as issued unless the insurer or manual issuance process confirms it.

The design intentionally avoids vendor-specific API assumptions. Instead, it defines a provider-neutral payment abstraction with provider implementations added later behind the same contract.

---

## 2. Payment abstraction

The core interface is intentionally generic:

- createPayment()
- verifyPayment()
- refundPayment()
- getStatus()

This allows Khaacho to integrate with any provider while keeping application logic stable.

A system-level contract should treat provider integration as a backend concern only. The public API must not expose the provider payload directly to the frontend.

### 2.1 Payment states

The canonical payment lifecycle is:

- CREATED
- PENDING
- SUCCESS
- FAILED
- EXPIRED
- REFUNDED
- PARTIALLY_REFUNDED

### 2.2 Payment persistence requirements

The database must store:

- payment reference
- application reference
- amount and currency
- provider name
- external provider reference
- verification metadata
- idempotency key
- status
- expiry and timestamps
- webhook deduplication metadata

The raw payment body is never trusted as source-of-truth. Provider responses are treated as input to server-side verification and reconciliation.

---

## 3. Server-side verification and transaction safety

### 3.1 No trust in frontend success messages

A frontend callback or success message is never enough to mark a payment as successful. The backend must verify the status again from the provider or from a server-authoritative callback.

Rules:

- Payment success is only accepted after provider verification.
- A duplicate frontend payment-success message must not affect the payment record if the internal server state already indicates a terminal status.
- Reconciliation must compare the stored external reference and local payment reference before any operational transition occurs.

### 3.2 Idempotency

Every payment creation request must be idempotent using a stable idempotency key.

Rules:

- repeating the same payment request with the same idempotency key returns the existing payment record
- the same customer/application and payment amount must not create duplicate payment records
- idempotency keys are server-generated or client-supplied but validated server-side
- payment status changes are never repeated if already terminal

This prevents double-submission when a customer clicks pay multiple times or when a network retry occurs.

### 3.3 Payment reference

Every payment record must have a Khaacho-generated payment reference that is independent of the third-party provider reference. This supports internal audit and lookup without exposing provider internals to customers.

### 3.4 Webhook and duplicate protection

All provider events must be processed through a webhook receiver that:

- validates the provider signature or equivalent authenticity control
- records each event as a deduplicated webhook record keyed by provider + eventId
- rejects duplicate events before applying state changes
- stores the raw payload for later investigation and reconciliation

If a webhook is replayed, the event is ignored after it has already been processed.

---

## 4. Reconciliation and retry behavior

### 4.1 Reconciliation

The payment process should reconcile with provider data periodically or on callback receipt:

- compare payment status from provider to stored internal status
- reconcile amount, currency, and external reference
- detect duplicate or conflicting provider responses
- produce a server-side audit record when a mismatch is discovered

### 4.2 Retry logic

Retries are safe only when they are idempotent and bound to the same payment reference.

Recommended handling:

- create request retries return the same payment record
- verification retries are safe and result in the same status if already verified
- refund retries require a unique refund intent and must never issue duplicate refunds
- webhook replay events must be ignored after first successful processing

### 4.3 Failure handling

Failure states must remain explicit:

- FAILED for a payment that cannot be completed
- EXPIRED for a payment that timed out without successful completion
- REFUNDED when a complete refund is issued
- PARTIALLY_REFUNDED when only part of the amount was returned

A failed or expired payment may still be retried only through a fresh payment creation flow, not by mutating an old record silently.

---

## 5. Policy issuance lifecycle

The policy lifecycle is a separate operational chain following payment acceptance. The canonical flow is:

PAYMENT_SUCCESS
→ APPLICATION_READY
→ SUBMIT_TO_INSURER
→ INSURER_PROCESSING
→ POLICY_ISSUED
→ POLICY_DOCUMENT_AVAILABLE

### 5.1 Transition rules

- Payment success alone does not create a policy.
- A policy record is created only after the application is ready for issuance and the server has confirmed the payment was successful.
- The system must not move to POLICY_ISSUED unless the insurer or manual approval has actually verified the issuance data.
- A policy document URL must not be made public until the document is actually available and access has been authorized.

### 5.2 Manual issuance

Manual issuance is allowed for operational use cases but must remain explicit.

Manual issuance requires:

- authorized staff action
- confirmation of valid insurer acceptance or internal approval
- a verified policy number
- an audit log entry recording who issued it and when

If a policy number is absent or unverified, the policy must remain non-issued.

### 5.3 Provider API issuance later

The architecture supports a future provider-based issuance adapter behind the same issuance contract. The provider contract should not be embedded in business logic and should not assume that a provider is always present.

The operational behaviors remain the same:

- verify before issuing
- create policy only after validation
- reject or retry if the provider response is incomplete or ambiguous
- never fabricate a policy number

---

## 6. Audit trail and transaction safety

Every payment and issuance transition should be recorded with a signed-safe audit record:

- actor or system actor
- entity type and id
- action name
- before and after state
- provider reference where relevant
- timestamp
- reason or failure message if applicable

For transaction safety, payment and policy issuance updates should be atomic at the business operation level. A state transition is not considered complete until both the database update and audit record succeed together.

---

## 7. Security requirements

- Only the backend may initiate payment creation or status verification.
- Frontend callbacks are not trusted as authoritative payment success states.
- Private document URLs must never be exposed in public responses.
- Provider signatures must be validated before processing any webhook event.
- Payment records must be protected from duplicate processing with idempotency keys and event deduplication.
- Refunds must be explicit and verified server-side before accounting is updated.
- Khaacho must not fabricate a policy number or issue a policy without a verified insurer or manual confirmation.

---

## 8. Implementation notes

The practical deployment pattern is:

1. Customer submits application and pays through a provider-backed payment session.
2. Server creates a payment record with a safe payment reference and idempotency key.
3. Provider webhook or verification endpoint confirms the payment.
4. Server verifies amount, currency, and external reference.
5. Application transitions to the next issuance-ready state only after verification succeeds.
6. Policy issuance is executed only after verified insurer/manual confirmation.
7. The policy document becomes available only after the policy is actually issued and the document is accessible.

This design keeps the system provider-agnostic while preserving strict operational safety and auditability.
