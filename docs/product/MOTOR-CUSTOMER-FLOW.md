# Khaacho Motor Customer Flow

## Goal

The first operational product is motor insurance. The customer journey is designed to convert qualified vehicle owners into a tracked lead and quote request without exposing fake pricing or pretending the product is fully live in every insurer integration.

## Product Positioning

- Khaacho is the acquisition and comparison surface.
- Khaacho may request and coordinate quotes, but it does not issue a policy or confirm final pricing unless an insurer is actively integrated.
- While no real insurer provider is connected, the user sees a clear confirmation message:
  - "Your request has been received. Khaacho will obtain available quotes."
- When a real quote provider is connected, normalized quote data may be returned and displayed according to the same funnel state model.

## Funnel Overview

1. Vehicle type
2. Vehicle details
3. Existing insurance
4. Coverage
5. Customer
6. Submit request

## State Model

### State 1: VEHICLE_TYPE

Purpose: capture the customer’s vehicle classification before collecting sensitive vehicle details.

Fields:
- vehicleType: car | motorcycle | commercial vehicle | other

Allowed transitions:
- VEHICLE_TYPE -> VEHICLE_DETAILS
- VEHICLE_TYPE -> CLOSED (if abandoned)

Validation rules:
- Required selection

### State 2: VEHICLE_DETAILS

Purpose: collect details needed for quotation and underwriting.

Fields:
- registrationNumber
- make
- model
- manufacturingYear
- registrationYear
- engineCc (where applicable)
- fuelType (where applicable)

Allowed transitions:
- VEHICLE_DETAILS -> EXISTING_INSURANCE
- VEHICLE_DETAILS -> VEHICLE_TYPE (back)

Validation rules:
- registrationNumber required
- make required
- model required
- manufacturingYear required
- registrationYear required
- engineCc optional for many categories but recommended for motorcycles and passenger vehicles when known
- fuelType required for commercial or configured vehicle classes where relevant

### State 3: EXISTING_INSURANCE

Purpose: determine whether the request is a new policy or renewal and collect insurer history.

Fields:
- insuranceStatus: new | renewal
- previousInsurer (if renewal)
- previousPolicyNumber (if renewal)
- expiryDate (if renewal)

Allowed transitions:
- EXISTING_INSURANCE -> COVERAGE
- EXISTING_INSURANCE -> VEHICLE_DETAILS (back)

Validation rules:
- insuranceStatus required
- renewal requires previousInsurer, previousPolicyNumber, expiryDate

### State 4: COVERAGE

Purpose: capture the type of cover requested and relevant add-ons.

Fields:
- coverageType: third-party | comprehensive | custom
- addOns: zero dep, personal accident, roadside assistance, theft, accessories cover

Allowed transitions:
- COVERAGE -> CUSTOMER
- COVERAGE -> EXISTING_INSURANCE (back)

Validation rules:
- coverageType required
- add-ons optional but stored if selected

### State 5: CUSTOMER

Purpose: collect customer identity and contact information to create a lead and enable outreach.

Fields:
- fullName
- phone
- email
- address
- consent

Allowed transitions:
- CUSTOMER -> SUBMIT_REQUEST
- CUSTOMER -> COVERAGE (back)

Validation rules:
- fullName required
- phone required and must fit a valid Nepal telephone pattern
- email required and valid
- address required
- consent required

### State 6: SUBMIT_REQUEST

Purpose: finalize and submit the Khaacho lead and quote request to the backend.

Payload generated on submission:
- vertical: motor
- source: website_motor_funnel
- formData: full funnel payload
- consentTs: timestamp

Allowed transitions:
- SUBMIT_REQUEST -> REQUEST_RECEIVED
- SUBMIT_REQUEST -> CUSTOMER (back)

Validation rules:
- Full step validation runs before submission
- If a real quote provider is not connected, the system does not generate fake premiums
- The backend creates a lead and quote request record and returns a Khaacho reference number

## Request Received State

After successful submission:

- Create or reuse customer and user if the phone/email maps to an existing person
- Create a Lead record with vertical = motor and captured formData
- Create a QuoteRequest record with product type = MOTOR and the same input data
- Set initial status values appropriately for the workflow
- Send confirmation to the customer via the configured channel
- Display the reference number
- Show the message: "Your request has been received. Khaacho will obtain available quotes."

## Operational Rules

### No fake prices

The funnel never displays a fake premium or implied insurer pricing if the system does not have a live quote source.

### Real quotes when providers exist

When insurer adapters are connected and return valid normalized results, the funnel can surface real quotes after the request is created and the backend has processed them.

### Save and resume

The browser stores a draft in localStorage so the user can continue later without losing the form.

### Privacy and consent

Consent is captured in the final step and stored with the request. The customer can only proceed with a valid consent tick.

## State Transition Table

| From | To | Trigger | Result |
|---|---|---|---|
| VEHICLE_TYPE | VEHICLE_DETAILS | Next | Validate vehicle type |
| VEHICLE_DETAILS | EXISTING_INSURANCE | Next | Validate vehicle details |
| EXISTING_INSURANCE | COVERAGE | Next | Validate renewal/new status |
| COVERAGE | CUSTOMER | Next | Validate coverage selection |
| CUSTOMER | SUBMIT_REQUEST | Next | Validate customer fields |
| SUBMIT_REQUEST | REQUEST_RECEIVED | Submit | Create lead + quote request + confirmation |
| any step | previous step | Back | Preserve local draft |
| any active step | CLOSED | Exit/abandon | Keep draft in browser storage |

## Analytics and Tracking

The funnel should emit events such as:
- khaacho:lead_submitted
- motor_funnel_step_view
- motor_funnel_step_completed
- motor_funnel_error
- motor_funnel_resume

This allows measurement of conversion and drop-off performance without exposing customer data outside the required workflow.

## Acceptance Criteria

- Homepage clearly positions Khaacho as a motor-first acquisition product.
- Non-operational categories display as Coming soon / request assistance.
- Motor funnel covers the six required steps.
- Validation is enforced at each step.
- Customer consent is required.
- No fake premium is displayed.
- Requests create backend lead + quote request records.
- Confirmation state shows reference number.
- Funnel works on mobile-first layouts and remains accessible.
