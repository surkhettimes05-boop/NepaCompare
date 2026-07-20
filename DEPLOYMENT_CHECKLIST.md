# Production Deployment Checklist

This document contains the exact configuration values and security checks you need to complete in your Render and Vercel dashboards before the application is genuinely production-ready.

---

## 1. Environment Variables Inventory & Analysis

### Backend (NestJS / Render)
| Variable | Secret? | Purpose | Status in Repo |
|----------|---------|---------|----------------|
| `DATABASE_URL` | **YES** | Connects Prisma to the Supabase Postgres instance. | Present in `.env` |
| `JWT_SECRET` | **YES** | Used to sign and verify auth tokens. | Present in `.env` |
| `PORT` | NO | Defines the port the app listens on (defaults to 8080). | Read in code, usually auto-injected by Render |

### Website (Next.js / Vercel)
| Variable | Secret? | Purpose | Status in Repo |
|----------|---------|---------|----------------|
| `NEXT_PUBLIC_API_URL` | NO (Safe) | Tells the frontend where to make API calls. | Present in `.env.local` |

### CRM Admin (Vite / Vercel)
| Variable | Secret? | Purpose | Status in Repo |
|----------|---------|---------|----------------|
| `VITE_API_URL` | NO (Safe) | Tells the CRM where to make API calls. | **Missing** from any `.env` file in repo (falls back to localhost) |

### ⚠️ Audit Findings & Flags
1. **JWT Secret Security: PASSED**. I have confirmed that `JWT_SECRET` is read *strictly* by the backend. It is never referenced in `website` or `crm-admin`, so there is no risk of it leaking to the client bundles.
2. **Missing Env File: FLAGGED**. The `crm-admin` app uses `import.meta.env.VITE_API_URL` extensively in the code, but there is no `.env.example` or `.env` file in the `crm-admin` directory. You will need to explicitly set this in Vercel.
3. **CORS Configuration: FLAGGED (CRITICAL)**. In `backend/src/main.ts`, CORS is currently configured with `origin: true`. This effectively echoes back *any* origin request, acting as a wildcard. **This is insecure for production.** You must update `main.ts` to only allow the specific Vercel production domains (e.g., `['https://nepacompare.com', 'https://crm.nepacompare.com']`) before going live.

---

## 2. Render Dashboard Setup (Backend)

Go to your Render Web Service settings and add the following Environment Variables:

- [ ] **`DATABASE_URL`**: Set this to your production Supabase connection string.
- [ ] **`JWT_SECRET`**: Generate a long, random string (e.g., via `openssl rand -base64 32`). **Do not use the local value.** 
  > *Note: Changing this will instantly invalidate any existing sessions. This is expected.*
- [ ] **`PORT`**: (Optional) Render automatically sets this, but if it fails to bind, explicitly set it to `8080`.

---

## 3. Vercel Dashboard Setup (Website)

Go to your Vercel Project settings for the **Website** -> Environment Variables:

- [ ] **`NEXT_PUBLIC_API_URL`**: Set this to your live Render backend URL (e.g., `https://nepacompare-backend.onrender.com`). Do not leave this empty or it will fall back to `http://localhost:8080` and fail for real users.

---

## 4. Vercel Dashboard Setup (CRM Admin)

Go to your Vercel Project settings for the **CRM Admin** -> Environment Variables:

- [ ] **`VITE_API_URL`**: Set this to your live Render backend URL (e.g., `https://nepacompare-backend.onrender.com`). Just like the website, this is required so the CRM can talk to the deployed backend.
