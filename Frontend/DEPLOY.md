# Deploy Divas Sojourn to Vercel (temporary client preview only)

**Purpose:** Vercel is only for showing the client a working URL. The **final live site** will run on a **different hosting platform** later.

Keep the app portable:

- Use standard Next.js + Prisma + Postgres (Neon) — not Vercel-only APIs
- Prefer HTTPS image URLs for the preview (local disk uploads won’t transfer cleanly)
- When you go live elsewhere: point the same env vars at the new host; you can keep this Neon DB or migrate to another Postgres

---

## 1. Security checklist (do this before `git push`)

| Check | Status |
|-------|--------|
| `.env` / `.env.local` are **gitignored** (never commit them) | Required |
| Only `.env.example` / `.env.local.example` are in git (placeholders only) | Required |
| No real `CLERK_SECRET_KEY`, `SMSALERT_API_KEY`, or admin passwords in any tracked file | Required |
| `prisma/dev.db` and `public/uploads/*` (except `.gitkeep`) are ignored | Required |
| Strong unique `ADMIN_PASSWORD` + `ADMIN_AUTH_SECRET` set **only** in Vercel env vars | Required |
| `MOCK_OTP` left **unset** on Vercel | Required |

If an API key was ever pasted into `.env.example` and pushed, **rotate that key** in the provider dashboard and treat the old one as compromised.

---

## 2. Create Neon on Vercel (database)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your project (create the project first if you have not).
2. Go to the **Storage** tab → **Create Database** / **Browse Storage**.
3. Choose **Neon** → **Continue**.
4. Pick a region close to you / your users (e.g. Singapore / Mumbai if listed).
5. Name it something like `divas-sojourn` → **Create**.
6. When asked, **connect** the database to this Vercel project for **Production** and **Preview**. Leave **Custom Prefix** blank.
7. Confirm env vars were added. Neon on Vercel usually creates:
   - `DATABASE_URL` (pooled — app runtime)
   - `DATABASE_URL_UNPOOLED` (direct — Prisma `db push` / migrations)
8. Open **Settings → Environment Variables** and confirm both exist for **Production** and **Preview**.

### If you opened Neon’s “Getting started” guide on Vercel

That guide builds a tiny demo (form → `comments` table) with `@neondatabase/serverless`. **Do not follow steps 3–5 of that guide for Divas Sojourn.** This app already uses **Prisma** and has Blog / Trip / Gallery tables.

| Their guide step | What you do instead |
|------------------|---------------------|
| 1. Connect to a project | Done when Neon is linked to this Vercel project |
| 2. `vercel env pull .env.development.local` | **Do this** (see below) so local `npm run dev` can reach Neon |
| 3. Install `@neondatabase/serverless` | **Skip** — Prisma uses `DATABASE_URL` |
| 4. `CREATE TABLE comments` in SQL Editor | **Skip** — `prisma db push` creates real app tables |
| 5. Sample comment form / Server Action | **Skip** — use `/admin` for content |
| 6. `npm run dev` | Yes, after env pull + admin/Clerk vars |

### Pull Neon env vars to your machine

From `Frontend/` (requires [Vercel CLI](https://vercel.com/docs/cli) logged in):

```bash
cd Frontend
npx vercel link          # once: pick the Vercel project
npx vercel env pull .env.development.local
```

That downloads `DATABASE_URL` and `DATABASE_URL_UNPOOLED` (and any other Vercel envs). The file is gitignored.

Then create/update `.env.local` with admin + Clerk secrets (or merge them into `.env.development.local`). Next.js loads both.

### Apply tables (first time)

```bash
cd Frontend
npx prisma db push
npx prisma db seed
```

On Vercel deploy, `npm run vercel-build` also runs `prisma db push` so tables exist in production even if you skip local push.

---

## 3. Vercel project setup

1. Push this repo to GitHub (do **not** include `.env.local`).
2. In [Vercel](https://vercel.com) → **Add New Project** → import the repo.
3. **Root Directory:** set to `Frontend` (important — the Next app is not at the repo root).
4. Framework: Next.js (auto-detected).
5. Install / Build: leave defaults, or use:
   - Install: `npm install`
   - Build: `npm run vercel-build`
6. Add **Environment Variables** (Production + Preview):

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Neon **pooled** connection string (auto from Storage) |
| `DATABASE_URL_UNPOOLED` | Neon **direct** connection string (auto from Storage) |
| `ADMIN_EMAIL` | Email the client will type on `/admin/login` |
| `ADMIN_PASSWORD` | Strong password — share privately with client |
| `ADMIN_AUTH_SECRET` | Long random string (e.g. 32+ chars) |
| `AUTH_SECRET` | Optional; can match `ADMIN_AUTH_SECRET` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From Clerk dashboard |
| `CLERK_SECRET_KEY` | From Clerk dashboard (server only) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/` |
| `SMSALERT_API_KEY` | Optional until OTP is re-enabled |
| `SMSALERT_SENDER` | Optional |
| `SMSALERT_OTP_TEMPLATE` | Optional |

7. Deploy.

In Clerk, add your Vercel URL to **Allowed origins / redirect URLs** (e.g. `https://your-app.vercel.app` and `https://*.vercel.app` for previews).

---

## 4. How the client accesses the admin page

Admin is **not** a separate Vercel project. It is part of the same deployment.

1. Public site: `https://YOUR-APP.vercel.app`
2. Admin login: `https://YOUR-APP.vercel.app/admin/login`
3. Client signs in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in Vercel.
4. After login they land on `/admin` (blogs, gallery, trips).
5. Middleware blocks `/admin/*` and `/api/admin/*` (except login) unless the signed session cookie is valid.

**Share with the client (privately — not in GitHub / Slack public channels):**

- Site URL  
- Admin URL: `…/admin/login`  
- Admin email + password  

Anyone with the URL can *see* the login form; only people with the password can manage content. Use a strong password and rotate it after the preview period if needed.

There is no default production password. If `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_AUTH_SECRET` are missing on Vercel, admin login is refused (fail-closed).

---

## 5. Known limits on this preview deploy

| Topic | Behaviour on Vercel |
|-------|---------------------|
| Trip/blog/gallery **data** | Works if Postgres is configured |
| **Image uploads** to `public/uploads/` | Do **not** persist on serverless; prefer Unsplash/HTTPS image URLs in admin forms for the client demo |
| Profile SMS OTP | Needs approved SMS Alert sender; safe to leave unset for UI preview |

Cloud uploads (Vercel Blob / S3 / Cloudinary) can replace `app/lib/uploads.ts` later without changing the admin UI.

---

## 6. After deploy — quick smoke test

- [ ] Homepage loads  
- [ ] India / International / Upcoming trips load from DB  
- [ ] `/admin/login` accepts Vercel credentials  
- [ ] `/admin` redirects to login when logged out  
- [ ] Clerk sign-in / sign-up open (if keys set)  
- [ ] Confirm `.env.local` was never pushed (`git status` / GitHub file search)

---

## 7. Local vs preview vs final host

```text
Local:           Neon URLs in .env.local / .env.development.local  +  npm run dev
Vercel preview:  same Neon + Vercel env vars  +  npm run vercel-build  (client demo only)
Final live host: same codebase + same (or new) Postgres URLs + same ADMIN_*/Clerk env vars
Admin (preview): https://YOUR-APP.vercel.app/admin/login
```

When you pick the real host later, you mainly re-set env vars and deploy `Frontend/` — no need to rebuild the app around Vercel.
