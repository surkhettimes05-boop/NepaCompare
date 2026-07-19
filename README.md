# NepaCompare Deployment Guide

This repository contains three separate applications. Follow this guide to deploy them to production.

## 1. Backend API (NestJS) -> Render.com
The backend handles the business logic, JWT authentication, and database connections.

1. Go to [Render.com](https://render.com) and create a **Web Service**.
2. Connect your GitHub account and select this `NepaCompare` repository.
3. Configure the service:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
4. Add the following **Environment Variables**:
   - `DATABASE_URL`: Your Supabase **Transaction or Session Pooler URL** (e.g., `postgresql://postgres...pooler.supabase.com...`)
   - `JWT_SECRET`: A long, random string of text (e.g., `nepa_compare_super_secret_jwt_key_2026`)

## 2. Website (Next.js) -> Vercel
The consumer-facing website where users request quotes.

1. Go to [Vercel.com](https://vercel.com) and create a **New Project**.
2. Select this `NepaCompare` repository.
3. Vercel will automatically detect that this is a Monorepo. Configure it:
   - **Root Directory:** `website`
   - **Framework Preset:** Next.js
4. Add the following **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: The public URL Render gave your backend in Step 1 (e.g., `https://nepacompare-backend.onrender.com`).
5. Click **Deploy**.

## 3. CRM Admin Panel (React/Vite) -> Vercel
The internal dashboard for your team to manage leads and partners.

1. Go to [Vercel.com](https://vercel.com) and create another **New Project**.
2. Select this `NepaCompare` repository again.
3. Configure it:
   - **Root Directory:** `crm-admin`
   - **Framework Preset:** Vite
4. Add the following **Environment Variable**:
   - `VITE_API_URL`: The public URL Render gave your backend in Step 1 (e.g., `https://nepacompare-backend.onrender.com`).
5. Click **Deploy**.

## Post-Deployment
- Log into your production CRM using `9800000000` and `admin_password`.
- Test submitting a lead on the live Website and verify it appears in the live CRM!
