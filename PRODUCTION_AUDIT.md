# Divas Sojourn — Production Readiness Audit

**Branch:** `chore/production-readiness`  
**Started:** 2026-10-18  
**Baseline commit:** `6cfc79f` (snapshot before audit work)

---

## Phase 0 — Project understanding (do not proceed to Phase 1 until approved)

### Stack summary

| Area | Choice |
|---|---|
| App | **Next.js 16** (App Router) + **React 19** + **TypeScript/JS** mix |
| Styling | **Tailwind CSS 4** |
| Package manager | **npm** (`Frontend/package.json`) |
| Hosting | **Vercel** (`vercel.json` → `npm run vercel-build`) |
| Database | **PostgreSQL (Neon)** via **Prisma 6** |
| Auth | Custom admin cookie session (`ADMIN_EMAIL` / `ADMIN_PASSWORD` + HMAC cookie); itinerary unlock via phone OTP cookie |
| Payments | **Easebuzz** Hosted Checkout (`initiateLink`, callback, webhook, status retrieve) |
| SMS / OTP | **SMS Alert** (itinerary phone verification) |
| File storage | **Vercel Blob** (admin uploads); local `public/uploads` in dev |
| Reviews cache | **Google Places API** + cron route |
| Icons | `lucide-react` |
| Monorepo shape | Git root is `DivasSojourn2.0`; **all app code lives under `Frontend/`** |

### Folder structure (high level)

```
DivasSojourn2.0/
├── PRODUCTION_AUDIT.md          ← this file
├── Frontend/                    ← Next.js app (deploy root on Vercel)
│   ├── app/                     ← routes, API, components, lib, data
│   ├── prisma/                  ← schema + migrations + seed
│   ├── public/                  ← static assets, PDFs, uploads
│   ├── scripts/                 ← one-off maintenance / probe scripts
│   ├── middleware.ts            ← admin route/API gate
│   └── package.json
└── (repo root mostly points at Frontend for deploy)
```

### Entry points

- **Public site:** `Frontend/app/**/page.js|tsx` under App Router
- **Admin:** `/admin/*` (login at `/admin/login`)
- **Middleware:** `Frontend/middleware.ts` protects `/admin` and `/api/admin` (except login)
- **Build:** `vercel-build` = `prisma generate && prisma migrate deploy && next build --webpack`

### Public routes (pages)

| Route | Purpose |
|---|---|
| `/` | Home |
| `/upcoming-trips` | Combined upcoming trips |
| `/india-trips`, `/india-trips/[trip-slug]` | India listings + detail |
| `/international-trips`, `/international-trips/[slug]` | International listings + detail |
| `/tailored-trips`, `/personalize-trip` | Tailored / personalize |
| `/calendar` | Calendar |
| `/blogs`, `/blogs/[slug]` | Blog list + post |
| `/gallery` | Gallery |
| `/about-us` | About |
| `/faqs` | FAQs (DB-backed) |
| `/payments` | Pay Now / Easebuzz checkout |
| `/payment/success`, `/payment/failed` | Payment result |
| `/travel-saving-plan` | Travel saving plan |
| `/terms-condition`, `/privacy-policy` | Legal |
| `/admin/*` | Admin CRUD |

### API surface (groups)

| Group | Endpoints |
|---|---|
| Public content | `/api/blogs`, `/api/gallery`, `/api/trips`, `/api/reviews`, `/api/enquiries` |
| Itinerary OTP | `/api/itinerary/send-otp`, `/api/itinerary/verify` |
| Payments | `/api/payments/bookings`, `/api/payments/easebuzz/{initiate,callback,webhook}` |
| Admin | `/api/admin/{login,logout,blogs,trips,gallery,enquiries,reviews,faqs,platform-stats,payments/recheck}` |
| Cron | `/api/cron/google-reviews` |

### Environment variables in use

| Variable | Scope | Purpose |
|---|---|---|
| `DATABASE_URL` | server | Neon pooled Postgres |
| `DATABASE_URL_UNPOOLED` | server | Neon direct (migrations) |
| `SMSALERT_API_KEY` / `SMSALERT_SENDER` / `SMSALERT_OTP_TEMPLATE` | server | OTP SMS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_AUTH_SECRET` | server | Admin auth |
| `AUTH_SECRET` | server | Cookie / unlock signing |
| `MOCK_OTP` | server (dev only) | Skip SMS in development |
| `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` | server | Reviews cache |
| `CRON_SECRET` | server | Cron auth |
| `EASEBUZZ_KEY` / `EASEBUZZ_SALT` / `EASEBUZZ_ENV` | server | Payments |
| `NEXT_PUBLIC_SITE_URL` | public | Callback / webhook base URL |
| `BLOB_READ_WRITE_TOKEN` | server | Vercel Blob uploads |

Documented in `Frontend/.env.example` (names only). `.env*` is gitignored except examples.

### Third-party services

1. **Neon** — Postgres  
2. **Vercel** — hosting + Blob + Cron  
3. **Easebuzz** — payments (currently Test keys on Vercel for checkout; Live pending go-live)  
4. **SMS Alert** — OTP  
5. **Google Places** — review cache  

### Notable early observations (not fixed yet — Phase 0 only)

- App mixes `.js` / `.jsx` / `.ts` / `.tsx`; no formal test suite in `package.json`.
- Security headers already partially set in `next.config.mjs` (HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy); **CSP not yet set**.
- Admin password is env plaintext compare (not bcrypt) — flag for Phase 2.
- Probe / maintenance scripts under `Frontend/scripts/` (incl. Easebuzz probes) — candidates for Phase 1 review.
- Cursor agent files `Frontend/AGENTS.md`, `Frontend/CLAUDE.md` untracked — Phase 1.
- Local `_DELETE_ME_old_modules` / trash paths referenced in webpack ignore — Phase 1.

### Secrets check (initial)

- No matching secret patterns found in tracked source via quick scan of common key shapes.
- `.env.local` is gitignored (good). **Do not commit it.**
- If any production secret ever appeared in chat or a committed file historically, **rotate it** (Neon, SMS Alert, Easebuzz, Google, admin password, Auth secrets, Blob, Cron).

---

## Change log

### Baseline
- Created branch `chore/production-readiness`.
- Committed current working tree (FAQ admin CRUD + itinerary full-name capture) as `6cfc79f`.

### Phase 0
- Mapped stack, routes, APIs, env vars, integrations.
- **Waiting for approval to start Phase 1.**

---

## Open items needing your action
_(filled as audit progresses)_

1. Confirm Phase 0 summary is accurate, then approve Phase 1.
2. Confirm Easebuzz Test vs Live keys for public launch.
3. Confirm production `NEXT_PUBLIC_SITE_URL` (Vercel preview vs `divassojourn.com`).
