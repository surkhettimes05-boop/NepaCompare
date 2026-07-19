# NepaCompare Project Audit

## 1. Repo map

- **`backend`**: NestJS application acting as the core API. Provides endpoints for auth, lead capture, local rate table querying (mock quotes), and CRM admin functions.
  - **Structure**: `src/` contains modules for `auth`, `chat`, `leads`, `partners`, `quotes`, `rate-tables`, `renewals`, and `users`. It also contains a `prisma/` directory for DB schema.
  - **Key Dependencies**: `@nestjs/core`, `@prisma/client`, `passport`, `bcrypt`.
- **`website`**: Next.js 16 application for the customer-facing portal. It provides landing pages, dynamic vertical comparison pages, and lead capture forms.
  - **Structure**: `src/app/` contains routing for `[vertical]`, `compare`, `dashboard`, `get-quote`, `login`, and `register`.
  - **Key Dependencies**: `next` (v16), `react` (v19), `react-dom`.
- **`crm-admin`**: Vite + React Single Page Application (SPA) for internal staff to manage leads and view metrics.
  - **Structure**: `src/pages/` contains `Dashboard`, `LeadDetail`, `LeadsInbox`, `Login`, `Partners`, and `Renewals`.
  - **Key Dependencies**: `react` (v19), `react-router-dom`, `vite`.
- **`.agents/skills`**: Custom AI agent instructions specifically for integrating and optimizing Supabase usage.
  - **Structure**: Contains `supabase/` and `supabase-postgres-best-practices/`.

## 2. Data model

### Prisma Schema Verbatim
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         String   @id @default(uuid())
  phone      String   @unique
  name       String?
  email      String?  @unique
  password   String?
  createdAt  DateTime @default(now())
  
  leads      Lead[]
  reviews    Review[]
  policies   Policy[]
  creditProfile CreditProfile?
  financialApps FinancialApplication[]
}

model Staff {
  id         String   @id @default(uuid())
  name       String
  phone      String   @unique
  password   String?
  role       Role     @default(AGENT)
  active     Boolean  @default(true)
  
  assignedLeads Lead[]
  statusUpdates LeadStatusHistory[]
}

enum Role {
  CUSTOMER
  AGENT
  ADMIN
}

model Partner {
  id           String   @id @default(uuid())
  name         String
  type         PartnerType
  contactName  String?
  contactPhone String?
  verticals    Json?    // Array of verticals they cover
  regions      Json?    // Array of regions they cover
  agreedCpl    Float?
  active       Boolean  @default(true)
  
  leads        Lead[]
  rateTables   RateTable[]
  routingRules RoutingRule[]
  invoices     Invoice[]
  reviews      Review[]
  financialProducts FinancialProduct[]
}

enum PartnerType {
  INSURER
  AGENT
  BROKER
}

model Lead {
  id              String   @id @default(uuid())
  userId          String?
  vertical        String
  source          String   // web or app
  formData        Json
  consentTs       DateTime @default(now())
  status          LeadStatus @default(NEW)
  assignedStaffId String?
  partnerId       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User?    @relation(fields: [userId], references: [id])
  staff           Staff?   @relation(fields: [assignedStaffId], references: [id])
  partner         Partner? @relation(fields: [partnerId], references: [id])
  
  statusHistory   LeadStatusHistory[]
}

enum LeadStatus {
  NEW
  QUALIFIED
  DISQUALIFIED
  SENT_TO_PARTNER
  CONVERTED
  LOST
  NO_RESPONSE
  INVOICED
  PAID
}

model LeadStatusHistory {
  id         String   @id @default(uuid())
  leadId     String
  oldStatus  LeadStatus
  newStatus  LeadStatus
  changedById String?
  changedAt  DateTime @default(now())
  
  lead       Lead     @relation(fields: [leadId], references: [id])
  changedBy  Staff?   @relation(fields: [changedById], references: [id])
}

model RateTable {
  id         String   @id @default(uuid())
  vertical   String
  partnerId  String
  planName   String
  criteria   Json     // e.g. age band, sum assured band
  premiumMin Float
  premiumMax Float
  updatedAt  DateTime @updatedAt
  
  partner    Partner  @relation(fields: [partnerId], references: [id])
}

model RoutingRule {
  id         String   @id @default(uuid())
  vertical   String
  region     String
  partnerId  String
  priority   Int      @default(1)
  
  partner    Partner  @relation(fields: [partnerId], references: [id])
}

model Invoice {
  id          String   @id @default(uuid())
  partnerId   String
  periodStart DateTime
  periodEnd   DateTime
  leadCount   Int
  amount      Float
  status      InvoiceStatus @default(DRAFT)
  
  partner     Partner  @relation(fields: [partnerId], references: [id])
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
}

model ContentPage {
  id         String   @id @default(uuid())
  slug       String   @unique
  title      String
  body       String   @db.Text
  vertical   String?
  published  Boolean  @default(false)
  updatedAt  DateTime @updatedAt
}

model Review {
  id         String   @id @default(uuid())
  partnerId  String
  userId     String
  rating     Int
  body       String   @db.Text
  status     ReviewStatus @default(PENDING)
  
  partner    Partner  @relation(fields: [partnerId], references: [id])
  user       User     @relation(fields: [userId], references: [id])
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

model Policy {
  id        String       @id @default(uuid())
  userId    String
  insurer   String
  planName  String
  vertical  String
  premium   Float
  startDate DateTime
  endDate   DateTime
  status    PolicyStatus @default(ACTIVE)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  user      User         @relation(fields: [userId], references: [id])
}

enum PolicyStatus {
  ACTIVE
  EXPIRING_SOON
  EXPIRED
  RENEWED
}

// ============================================
// PAISACOMPARE (Cross-sell: Credit & Loans)
// ============================================

model CreditProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  score       Int
  provider    String   // e.g., 'Equifax', 'CIBIL'
  lastUpdated DateTime @default(now())
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id])
}

model FinancialProduct {
  id             String   @id @default(uuid())
  partnerId      String
  name           String
  type           FinancialProductType
  minCreditScore Int
  interestRate   Float?
  features       Json?    // e.g., ["No annual fee", "5% cashback"]
  active         Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  partner        Partner  @relation(fields: [partnerId], references: [id])
  applications   FinancialApplication[]
}

enum FinancialProductType {
  CREDIT_CARD
  PERSONAL_LOAN
  HOME_LOAN
}

model FinancialApplication {
  id           String   @id @default(uuid())
  userId       String
  productId    String
  status       ApplicationStatus @default(PENDING)
  appliedAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user         User     @relation(fields: [userId], references: [id])
  product      FinancialProduct @relation(fields: [productId], references: [id])
}

enum ApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### Entities
- **User**: Represents a real-world customer. Multi-line capable.
- **Staff**: Represents an internal employee (Agent or Admin). Multi-line capable.
- **Partner**: Represents an insurer, agent, or broker. Multi-line capable.
- **Lead**: Represents a customer's inquiry for insurance. Multi-line (relies on a `vertical` string column to differentiate).
- **LeadStatusHistory**: Audit log representing status transitions for a Lead. Multi-line.
- **RateTable**: Static pricing configurations for quotes. Multi-line (via `vertical` column).
- **RoutingRule**: Rules dictating how to assign leads to Partners. Multi-line.
- **Invoice**: Represents a billing period for a Partner. Multi-line.
- **ContentPage**: Represents a CMS page. Multi-line.
- **Review**: Represents a user review for a Partner. Multi-line.
- **Policy**: Represents a finalized insurance policy bound to a User. Multi-line.
- **CreditProfile**: Represents a user's cross-sell credit score. Single-line (credit/loans specific).
- **FinancialProduct**: Represents cross-sell products like loans/cards. Single-line (credit/loans specific).
- **FinancialApplication**: Represents a user's application for a cross-sell product. Single-line (credit/loans specific).

## 3. Backend capability inventory

**Auth**
- `POST /auth/login`: Authenticates staff and issues a JWT.
- `POST /auth/customer-register`: Registers a new customer user and issues a JWT.
- `POST /auth/customer-login`: Authenticates a customer user and issues a JWT.

**Leads**
- `POST /leads`: Creates a new lead (publicly accessible).
- `GET /leads`: Fetches all leads (guarded for staff).
- `GET /leads/:id`: Fetches a single lead by ID (guarded).
- `PATCH /leads/:id`: Updates lead status/details (guarded).
- `DELETE /leads/:id`: Removes a lead (guarded).

**Quotes**
- `GET /quotes`: Fetches dynamic "mock" quotes by filtering local `RateTable` DB entries based on query parameters.

**Partners**
- `POST /partners`: Creates a partner (guarded).
- `GET /partners`: Fetches all partners (guarded).
- `GET /partners/:id`: Fetches a single partner (guarded).
- `PATCH /partners/:id`: Updates a partner (guarded).
- `DELETE /partners/:id`: Removes a partner (guarded).

**Rate Tables**
- `POST /rate-tables`: Creates a new static rate table entry.
- `GET /rate-tables`: Fetches all rate tables.
- `GET /rate-tables/:id`: Fetches a single rate table.
- `PATCH /rate-tables/:id`: Updates a rate table.
- `DELETE /rate-tables/:id`: Removes a rate table.

**Renewals**
- `GET /renewals/my-policies`: Fetches policies bound to the logged-in customer.
- `GET /renewals/expiring-all`: Fetches all expiring policies (guarded for staff).

**Users**
- `GET /users/me/quotes`: Fetches the currently logged-in customer's lead history.

**Chat**
- `POST /chat/message`: Simulated AI chat endpoint with an artificial 800ms delay.

## 4. What's NOT built yet

- **An insurer adapter layer**: **No.** There is absolutely no abstraction, interface, or mechanism for connecting to external insurer APIs.
- **A quote engine that fans out to multiple sources**: **No.** The quote engine just performs an in-memory `.filter()` over the local `RateTable` rows in the database.
- **A rating/rules engine**: **No.** It performs rudimentary `if/else` checks for age and engine cc against a raw JSON column in the database.
- **Real or mocked insurer data of any kind**: **Partial.** Insurers are referenced by name (e.g. "Shikhar Insurance", "Neco Insurance") in the UI and mock responses, but all data backing it is randomized or completely simulated.
- **Support for more than one insurance line**: **Partial.** The DB schema allows for it via generic `vertical` columns and generic `formData` JSON blobs, but there is no line-specific business logic or validations implemented.
- **Payment or policy-binding logic**: **No.** Lead statuses can transition to `PAID`, but there are no payment gateways or actual binding operations.
- **Any compliance/KYC-related code**: **No.** None exists.

## 5. Website & CRM reality check

- **Website**: Today, a real user can browse static marketing pages, click a vertical (Motor, Health, Life), and view locally generated mock quotes. If they click to buy, they hit a form that creates a `Lead` in the database. The user cannot actually purchase a policy, enter KYC details, pay online, or see real-time insurer pricing. It is exclusively a lead-capture frontend.
- **CRM admin**: An internal user sees a completely hardcoded dashboard metrics view. They can list the captured leads, view raw JSON form data, and manually change a lead's status in a dropdown. The UI explicitly states "*Partner routing is disabled in this MVP view."

## 6. Known issues / shortcuts

- **Extreme Mocking in Core Services**: `backend/src/quotes/quotes.service.ts` heavily simulates data. Claim Settlement Ratios (CSR) are hardcoded with `Math.random()`, and coverage details/exclusions are hardcoded arrays based on the vertical name.
- **No Input Validation**: Endpoints blindly accept `@Body() body: any` without `@IsString()`, `@IsNumber()`, or DTO validation, creating a major security/data-integrity risk.
- **Hardcoded Secrets & URLs**: `website/src/app/compare/[vertical]/page.tsx` and `crm-admin/src/pages/LeadsInbox.tsx` fall back to `http://localhost:8080`.
- **Dummy Buttons**: The "Export CSV" button in the CRM admin is cosmetic and does nothing. 
- **Missing Error Handling**: Backend controller logic fails silently or relies strictly on NestJS's default exceptions. The frontend just logs `console.error` and leaves the UI in a loading or broken state.

## 7. Gap vs. target architecture

Given the target architecture (*client layer → aggregator platform → insurer integration layer*), the current codebase is extremely far from the target. The current code is essentially a monolithic lead-capture CRUD app dressed up as an aggregator. It entirely lacks the aggregator platform's routing/fan-out capabilities and the insurer integration layer. 

**Next 3 concrete build tasks (in priority order):**

1. **Define common normalized schema & insurer adapter interfaces**: Create abstract TypeScript classes/interfaces for the `InsurerAdapter`, alongside standardized `QuoteRequest` and `QuoteResponse` models so the aggregator has a common language.
2. **Build the Quote Engine Fan-out Architecture**: Refactor `quotes.service.ts` to implement a Promise.all() based fan-out pattern that queries the adapter interfaces concurrently, deprecating the local `RateTable` lookup.
3. **Implement the first Insurer Adapter**: Build a concrete implementation of the adapter interface that successfully mocks an HTTP request/response to a fake external insurer to prove the fan-out and normalization architecture works end-to-end.
