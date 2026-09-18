# Khaacho Renewal Management

## 1. Renewal model

Every issued policy must have a renewal record with:

- policy start date
- policy expiry date
- renewal status
- reminder schedule
- notification history
- idempotent job tracking

The renewal process is driven from the issued policy lifecycle rather than from mock or stale policy objects.

---

## 2. Renewal states

The renewal lifecycle is:

- UPCOMING
- CONTACT_PENDING
- CONTACTED
- QUOTE_REQUESTED
- QUOTE_RECEIVED
- CUSTOMER_DECIDING
- RENEWED
- LOST
- EXPIRED
- CANCELLED

These states are explicit and are used for operational reporting and customer journey tracking.

---

## 3. Configurable reminder schedule

The reminder schedule is stored as configuration so it can be updated without code changes.

Default reminder windows:

- 90 days
- 60 days
- 30 days
- 15 days
- 7 days
- 3 days
- 1 day
- expiry day
- post-expiry follow-up

The reminder values are not hardcoded in the workflow logic; they are part of the configuration model and can be updated through the admin or configuration tooling.

---

## 4. Generated renewal tasks and background jobs

Khaacho creates automated renewal tasks from issued policies.

Each task must:

- be idempotent
- have a stable idempotency key
- be retryable with bounded attempts
- record the last error when a retry fails
- be safe to re-run without creating duplicate renewal work

This prevents duplicate reminder or renewal jobs when a background worker retries a queue event.

---

## 5. Customer notifications

Notification channels include:

- SMS
- Email
- WhatsApp only when a legitimate provider is configured
- In-app notification when available

The system must never claim a notification was delivered unless the provider confirms delivery. If the provider does not confirm delivery, the status remains queued or failed, and the system records the lack of confirmation explicitly.

---

## 6. Admin dashboard

The admin dashboard tracks:

- renewals due
- renewals today
- renewals this week
- overdue
- renewed
- lost

These are derived from the renewal records and timestamps rather than from static mock data.

---

## 7. Renewal analytics

The analytics include:

- renewal rate
- contacted rate
- quote rate
- renewal conversion
- renewal premium
- renewal commission

These values are calculated from historical renewal records and should be used for operational decision-making and reporting.

---

## 8. Security and operational safety

- Do not expose private customer notification payloads publicly.
- Never mark a renewal as renewed without verified business confirmation.
- Treat provider delivery confirmations as the only authoritative signal of delivery success.
- Store provider payloads as metadata only when needed for auditability.
- Retry only idempotent operations to avoid duplicate renewal actions.

---

## 9. Implementation pattern

The renewal workflow should behave like this:

1. A policy is issued with a start date and expiry date.
2. The system creates a renewal record.
3. A configurable reminder schedule is attached to the renewal.
4. Reminder jobs are queued with idempotency keys.
5. Notifications are sent only through configured, verified providers.
6. Status transitions are recorded in audit logs.
7. Analytics are aggregated from the renewal records.
8. A renewal is only counted as renewed after valid business confirmation.

This keeps renewal management operationally safe, auditable, and ready for future provider integrations.
