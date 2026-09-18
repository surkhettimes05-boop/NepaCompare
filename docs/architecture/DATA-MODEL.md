# Khaacho Data Model

## 1. Purpose

This document describes the operational data model for the initial motor-first Khaacho platform. The goal is to support a realistic insurance lifecycle while preserving the existing repository structure and avoiding destructive changes to production data.

The model is intentionally aligned to a modular monolith architecture and a PostgreSQL + Prisma persistence layer.

---

## 2. Core design principles

1. Preserve existing production data and add new entities without destructive resets.
2. Separate platform users from customer profiles and customer-facing records.
3. Treat partners and insurers as distinct business entities with shared operational metadata.
4. Store quote provenance and source metadata explicitly.
5. Record policy lifecycle, renewal, and claim actions in a traceable way.
6. Keep lead and sales funnel data distinct from application and policy records.
7. Support future product expansion beyond motor insurance without rewriting the base schema.

---

## 3. Key entity groups

### 3.1 Identity and access

- User: platform login and account record
- Role: CUSTOMER, AGENT, ADMIN
- UserStatus: ACTIVE, INACTIVE, PENDING_VERIFICATION, BLOCKED, DELETED
- Customer: normalized profile for buyers and insured persons
- Staff: internal operational users with assigned lead/renewal workflows

This layer provides the authorization and identity boundary. The `User` table is the login identity, while `Customer` stores profile information and KYC-related context for the insured party.

### 3.2 Product and insurer configuration

- Partner: commercial partner, insurer, broker, or agent
- Insurer: insurer-specific business profile anchored to a partner record
- InsuranceProduct: product catalog with insurer and product type
- Coverage: product coverage definitions and mandatory add-ons

This allows Khaacho to maintain provider catalogs without hardcoding insurer logic into the application layer. Product and coverage configuration can be adapted by insurer or vertical without rewriting code paths.

### 3.3 Lead and quote funnel

- Lead: inbound customer demand, source, assignment, and status
- LeadStatusHistory: timeline of status changes
- QuoteRequest: customer intent and quote search request
- Quote: quote generated from a provider, with provenance and validity metadata
- QuoteOption: option-level price and benefit breakdowns for a quote

This is the core motor-insurance acquisition funnel. Lead records preserve the original marketing lead, while `QuoteRequest` and `Quote` hold the retail comparison and provider logic.

### 3.4 Applications, docs, and payments

- Application: chosen quote converted into an application lifecycle
- Document: uploaded identity, policy, and supporting documents
- Kyc: verification status and metadata
- Payment: payment intent and status tracking

These tables support policy origination and payment reconciliation while preserving evidence and compliance metadata.

### 3.5 Policy, renewals, and claims

- Policy: issued coverage record for a customer
- Renewal: renewal workflow tied to a policy
- Claim: claim records and settlement status
- Commission: commission tracking and reconciliation data

This is the operational post-sale layer. It supports customer servicing, renewal reminders, and claim management once coverage is issued.

### 3.6 Notifications, audit, and operations

- Notification: message delivery history and metadata
- AuditLog: critical entity action history
- Invoice: partner-led invoicing and payout tracking
- RateTable, RoutingRule: routing and pricing support data
- Review: partner reputation metadata

These tables cover operational controls, agent workflows, and the evidence trail required for insurer and partner operations.

---

## 4. Relationship summary

### 4.1 Core relationships

- User 1:1 Customer
- User 1:N Lead
- User 1:N QuoteRequest
- Customer 1:N QuoteRequest
- QuoteRequest 1:N Quote
- Quote 1:N QuoteOption
- Customer 1:N Application
- Application 1:N Document
- Application 1:N Payment
- Customer 1:N Policy
- Policy 1:N Renewal
- Policy 1:N Claim
- Policy 1:N Commission
- Partner 1:N Insurer
- Insurer 1:N InsuranceProduct
- InsuranceProduct 1:N Coverage

### 4.2 Operational notes

- One `Lead` can be assigned to a `Staff` member or linked to a `Partner`.
- One `Quote` may produce several `QuoteOption` values with different coverages and premiums.
- One `Application` may lead to one or more `Document` and `Payment` records.
- `Policy` is the issued contract record, while `Quote` and `Application` are pre-issuance lifecycle objects.

---

## 5. Lifecycle view

### Lead acquisition

Lead is created from website or agent intake and captured with source metadata and consent time.

### Comparison and selection

QuoteRequest is created for customer intent; Quote records are generated from insurer/provider adapters; QuoteOption presents ranked alternatives.

### Application and underwriting

Customer chooses a quote, an `Application` is created, documents are uploaded, and verification status is tracked.

### Issuance and service

When payment succeeds and underwriting requirements are met, policy issuance is recorded in `Policy`, with follow-on `Renewal`, `Claim`, and `Commission` records.

---

## 6. Status enums and business meaning

### Quote statuses

- DRAFT
- PENDING
- VALID
- ACCEPTED
- EXPIRED
- REJECTED
- CANCELLED

### Application statuses

- DRAFT
- SUBMITTED
- UNDER_REVIEW
- PENDING_DOCS
- APPROVED
- REJECTED
- PAID
- ISSUED
- CANCELLED

### Policy statuses

- ACTIVE
- EXPIRING_SOON
- EXPIRED
- RENEWED

These statuses give the platform enough lifecycle state to drive dashboards, CRM automation, and renewal workflows without overcomplicating the schema.

---

## 7. Safety and data handling constraints

1. No fake insurer records are inserted into production as part of the application seed.
2. Seed data is restricted to development-only initialization.
3. Production data should never be deleted or replaced by schema-only recreation flows.
4. `Json` fields are used for extensible metadata, but business-critical values should remain in typed fields where possible.
5. External insurer references and raw provider payloads are retained as provenance metadata rather than as the primary source of truth.

---

## 8. Implementation note

The current Prisma schema includes the required domain entities for a production-ready insurance lifecycle. The domain model is broader than the current API surface, which is expected in a modular monolith during the early operational buildout. The next step is migrating the schema to a real database and validating the generated SQL and build/test pipeline before expanding business workflows.
