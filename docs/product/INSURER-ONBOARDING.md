# Insurer Onboarding and Product Configuration

## Objective

Khaacho must manage insurers and product catalog configuration in a database-driven way. The platform must not hard-code products into the frontend or rely on static product definitions in UI code.

## Scope

Admin users with the appropriate permissions may manage:

- insurers
- products
- coverages
- add-ons
- provider capabilities
- integration status
- operational contacts
- product availability
- effective dates

## Insurer status model

The insurer lifecycle is represented as follows:

- PROSPECT
- ONBOARDING
- ACTIVE
- PAUSED
- SUSPENDED
- OFFBOARDING
- OFFBOARDED

## Integration state model

Provider integration states must be explicit and auditable:

- NOT_CONNECTED
- MANUAL
- SANDBOX
- CONNECTED
- ERROR
- DISABLED

## Product configuration model

Product configuration is stored in the database and is not hard-coded in the frontend. Admins can manage:

- insurer
- product name
- product code
- product type
- active/inactive state
- effective dates
- supported quote source
- capabilities
- coverage metadata
- exclusion metadata

## Provider capability model

Providers must declare what they can and cannot do. Khaacho must never assume a provider supports actions it has not explicitly declared.

Example capability set:

- getProducts
- validateQuoteRequest
- getQuote
- createApplication
- uploadDocument
- initiatePayment
- issuePolicy
- getPolicy
- renewPolicy
- getClaimStatus

If a capability is unsupported, it must be recorded with a reason so the operational team can act on it.

## Operational requirements

The admin module should allow visibility into:

- insurer
- products
- number of quotes
- quote conversion
- policies issued
- premium
- commission
- failures

## Integration and configuration guardrails

- No fake insurer API integrations should be created.
- Adapter configuration is stored as metadata for future real-world integrations.
- A provider can be configured for manual, sandbox, or future real-time connection without exposing fake data.
- Frontend code should read product definitions from the API rather than embedding static product lists.

## Admin permissions

The insurer and product management endpoints are protected by server-side authorization and require the proper permissions and roles.

Minimum operational permissions:

- INSURERS_MANAGE
- PRODUCTS_MANAGE

## Recommended onboarding flow

1. Add insurer record with legal and operational metadata.
2. Set insurer status and integration status.
3. Configure operational contacts and adapter metadata.
4. Create product catalog entries.
5. Add coverage and exclusions metadata.
6. Define supported quote sources and capabilities.
7. Set effective dates and availability.
8. Review quote volume, conversion, premium, and failure data.

## Future integration architecture

The adapter configuration is intentionally neutral and can later support:

- REST APIs
- SOAP integrations
- queued provider connectors
- sandbox and staging environments
- manual underwriting flow

The system must treat adapter configuration as a deployment detail, not a hard-coded UI assumption.
