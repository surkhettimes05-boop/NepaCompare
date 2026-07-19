# Launch Readiness Audit

## Part 1 — Auth & Security
- **Password handling**: `GAP - LOW RISK` 
  - Bcrypt is used with a static cost factor of `10`. This functions properly, but standard modern recommendations are `12-14` to resist brute forcing.
- **JWT handling**: `GAP - HIGH RISK`
  - Tokens are signed with a hardcoded fallback secret (`'super-secret-jwt-key'`).
  - Tokens have a massive 12-hour expiry with no refresh rotation strategy in place, meaning stolen tokens remain valid for a very long time.
- **Authorization boundaries**: `GAP - HIGH RISK`
  - The customer `GET /users/me/quotes` endpoint safely scopes to `req.user.userId`. However, the core `GET /leads` and `GET /leads/:id` endpoints (used by the CRM) only check for a valid JWT via `@UseGuards(JwtAuthGuard)`. They completely lack role-based verification. A customer with a valid JWT could query anyone else's leads!
- **Staff vs. customer role separation**: `GAP - HIGH RISK`
  - `roles.guard.ts` exists but is completely unutilized in the controllers. "Staff-only" operations are currently accessible to anyone holding a valid JWT.
- **Secrets**: `GAP - HIGH RISK`
  - The `JWT_SECRET` has a hardcoded string fallback. The Supabase `DATABASE_URL` exists in cleartext within the local `.env` file (this is fine for local dev since there's no `.gitignore` allowing it to be committed, but requires secure rotation in production).
- **Rate limiting**: `GAP - HIGH RISK`
  - There is zero rate limiting implemented on the auth endpoints (`ThrottlerModule` is entirely missing), leaving the login and registration endpoints fully exposed to credential stuffing attacks.

## Part 2 — CRM Completeness Check
- **Partner Routing**: `GAP - HIGH RISK`
  - Partner routing is purely cosmetic in the CRM admin view. The UI disables the select dropdown with a message that routing is disabled.
  - **To fix**: The backend requires an update endpoint (`PATCH /leads/:id/partner`) and the frontend needs to fetch active partners (`GET /partners`), enable the dropdown, and attach a save handler.
- **Export CSV**: `OK`
  - *Status update*: I have just implemented the real CSV export feature in `LeadsInbox.tsx`. It maps leads to a CSV string, creates a Blob, and triggers a download natively in the browser.

## Part 3 — Basic Operational Readiness
- **Error monitoring**: `GAP - HIGH RISK`
  - There is absolutely no external error monitoring configured (e.g., Sentry, Datadog). Console errors will be silently lost to users' browsers and raw server logs.
- **Database backup strategy**: `GAP - HIGH RISK`
  - The Supabase database relies on the platform's default (which may offer basic daily backups on Pro tiers), but there is zero configuration, IaC, or manual scripting inside this repository to enforce Point-In-Time-Recovery (PITR) or test backup restorations.
