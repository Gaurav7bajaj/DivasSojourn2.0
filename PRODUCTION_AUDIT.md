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
- Approved to continue.

### Phase 1 — Dead code audit (awaiting deletion approval)
- Ran `knip` + manual import verification (Next.js false positives filtered).
- No `console.log` / `debugger` in `app/` (only `console.error` for server logging — leave for Phase 4 logger).
- TODOs found are content notes (hero images, newsletter) — not blocking; leave for now.
- **Unused npm deps:** `dotenv` appears unused by app/scripts imports (candidate remove in Phase 1 after approval).
- **Do not delete yet** — full proposed deletion list below pending your OK.

#### Proposed deletions (need your approval)

**A. Unused React components (verified: no imports from live pages)**

| Path | Reason |
|---|---|
| `Frontend/app/components/india-trip-detail/TripTabs.jsx` | Replaced by `TripContentSections` / `TripDetailPage` |
| `Frontend/app/components/india-trip-detail/TripHero.jsx` | Replaced by `TripDetailHero` |
| `Frontend/app/components/india-trip-detail/JourneyFrames.jsx` | Replaced by `TripMomentsGallery` |
| `Frontend/app/components/india-trip-detail/EnquiryCard.jsx` | Unused; enquiry uses `ShortContactForm` |
| `Frontend/app/components/india-trip-detail/useCarouselScroll.js` | Only used by unused `JourneyFrames` |
| `Frontend/app/components/blogs/BlogFilters.jsx` | Superseded by `BlogsListingClient` |
| `Frontend/app/components/blogs/BlogGrid.jsx` | Superseded by `BlogsListingClient` |
| `Frontend/app/components/blogs/BlogListingCard.jsx` | Superseded by `BlogsListingClient` |
| `Frontend/app/components/blogs/BlogPageHeader.jsx` | Superseded by `BlogsListingClient` |
| `Frontend/app/components/blogs/FeaturedBlog.jsx` | Superseded by `BlogsListingClient` |
| `Frontend/app/components/home/TripCard.jsx` | Not used by current home sections |
| `Frontend/app/components/home/TripSection.jsx` | Not used by current home sections |
| `Frontend/app/components/india/IndiaHeroSection.jsx` | Page uses `IndiaTripsHeader` |
| `Frontend/app/components/india/IndiaTripsCard.jsx` | Only used by unused grid |
| `Frontend/app/components/india/IndiaTripsGrid.jsx` | Page uses `IndiaTripsClient` |
| `Frontend/app/components/india/index.js` | Barrel only re-exports unused india components |
| `Frontend/app/components/international/InternationalTripsHeader.jsx` | Not imported by live pages |
| `Frontend/app/components/international/ContactForm.jsx` | Unused; `ShortContactForm` is used |
| `Frontend/app/components/international/DestinationsGrid.jsx` | Unused |
| `Frontend/app/components/international/InternationalHeroCarousel.jsx` | Unused |
| `Frontend/app/components/HeroImageCarousel.jsx` | Only used by unused `InternationalTripsHeader` |
| `Frontend/app/components/shared/VideoTestimonials.jsx` | Unused |
| `Frontend/app/components/upcoming/FilterSidebar.jsx` | Superseded by `TripListingClient` / `TripFilters` |
| `Frontend/app/components/upcoming/UpcomingFilterSidebar.jsx` | Superseded |
| `Frontend/app/components/upcoming/MonthFilterButtons.jsx` | Superseded |
| `Frontend/app/components/upcoming/UpcomingTripsGrid.jsx` | Superseded |
| `Frontend/app/components/faqs/index.js` | Barrel unused (pages import `FaqsClient` directly) |
| `Frontend/app/components/gallery/index.js` | Barrel unused |
| `Frontend/app/components/shared/index.js` | Barrel unused |
| `Frontend/app/components/travel-saving-plan/index.js` | Barrel unused |
| `Frontend/app/components/payments/index.js` | Barrel unused (direct imports) |

**B. Dead data / legacy store**

| Path | Reason |
|---|---|
| `Frontend/app/lib/data/store.ts` | Old JSON file store; nothing imports it (Prisma replaced it) |
| `Frontend/app/data/blogs.js` | Deprecated empty stub; blogs come from Prisma |
| `Frontend/app/data/upcomingTrips.js` | Not imported; listings use Prisma `getUpcomingTrips` |
| `Frontend/data/store/.gitkeep` | Leftover store dir marker |

**C. One-off scripts & seed artifacts tracked in git (not used at runtime)**

| Path | Reason |
|---|---|
| `Frontend/scripts/fix-*.mjs` (all cover fix scripts) | One-off maintenance, not runtime |
| `Frontend/scripts/check-*.mjs` | One-off diagnostics |
| `Frontend/scripts/list-*.mjs` | One-off listings |
| `Frontend/scripts/build-rich-trips.mjs` | One-off trip builder |
| `Frontend/scripts/generate-trips.js` | One-off |
| `Frontend/scripts/extract-pdfs.mjs` | One-off |
| `Frontend/scripts/parse_all_trips.py` | One-off |
| `Frontend/scripts/update-2026-prices.mjs` | One-off |
| `Frontend/scripts/upsert-new-trips.mjs` | One-off |
| `Frontend/scripts/ping-db.mjs` | Dev utility, not needed in prod repo |
| `Frontend/scripts/probe-easebuzz.mjs` | Debug probe |
| `Frontend/scripts/probe-hash-variants.mjs` | Untracked debug probe |
| `Frontend/scripts/probe-validation.mjs` | Untracked debug probe |
| `Frontend/scripts/new-trips-parsed.json` | Historical import data (~tracked) |
| `Frontend/scripts/new-trips-rich.json` | Historical import data (~148KB) |
| `Frontend/scripts/pdf-text/` (15 `.txt` files) | Extracted PDF text for one-off import |

**D. Disk-only trash (gitignored — delete from disk only)**

| Path | Reason |
|---|---|
| `Frontend/_DELETE_ME_old_modules/` | Explicit trash; already gitignored |
| `Frontend/node_modules_old_trash/` (if present) | Explicit trash |

**E. Optional / ask first**

| Path | Reason |
|---|---|
| `Frontend/AGENTS.md`, `Frontend/CLAUDE.md` | Cursor agent helpers; not needed for production (currently untracked) |
| `Frontend/jsconfig.json` | Redundant if `tsconfig.json` paths cover `@/*` (verify before delete) |
| npm `dotenv` | Unused dependency candidate |

#### Keep (do not delete)

- `Frontend/app/data/faqs.js` — seed source for FAQ DB
- `Frontend/app/data/googleReviews.ts`, trip detail data files — still seed / fallback / content
- `Frontend/app/data/mockData.js` — still used by Navbar/Footer/reviews fallback
- Active payment, trip detail, home, admin components
- Prisma migrations / seed

---

## Open items needing your action
_(filled as audit progresses)_

1. ~~Approve Phase 1 group C keep/delete split~~ — **approved and applied 2026-10-18**.
2. ~~Easebuzz local initiate / key mismatch~~ — **skipped per owner (2026-10-18):** payment gateway confirmed working on Vercel; do not further debug local Easebuzz keys.
3. Confirm Easebuzz Test vs Live keys for public launch (when ready).
4. Confirm production `NEXT_PUBLIC_SITE_URL` (Vercel preview vs `divassojourn.com`).

### Keys to rotate

_(Filled after Phase 1C secret scan of scripts being deleted/kept + `git log --all -- <file>`.)_

| Item | Finding | Action |
|---|---|---|
| Easebuzz merchant key / salt | **Not hardcoded** in any deleted or kept script (current or historical). Probes read `EASEBUZZ_KEY` / `EASEBUZZ_SALT` from `.env.local` only. `probe-hash-variants.mjs` / `probe-validation.mjs` were **never committed** (disk-only). | No rotation required from scripts. |
| `DATABASE_URL` | **Not hardcoded.** DB scripts use `PrismaClient()` (env only). | No rotation required from scripts. |
| API keys / tokens / passwords | **None found** in scripts (current tree or committed history of those paths). | No rotation required from scripts. |
| Company bank account / IFSC / UPI | **Present as trip content** in kept pipeline files (`build-rich-trips.mjs`, `upsert-new-trips.mjs`, `generate-trips.js`, `parse_all_trips.py`, JSON). Same details appear on public trip PDFs. **Not** API secrets. | Optional: change UPI/account at the bank if you want them out of future content; **no provider API key rotation**. Values not printed here. |

### Phase 1 progress (2026-10-18)

**Verified before deleting A:** no `dynamic()` / `lazy()` / string component maps referencing those files.

**Verified before deleting B:** no API/server/scripts imports of `store.ts`, `app/data/blogs.js`, or `upcomingTrips.js` (Prisma `lib/data/blogs.ts` is different and kept).

**Deleted (approved A + B + D + partial E):**
- All Group A unused components/barrels listed above
- Group B: `store.ts`, `app/data/blogs.js`, `upcomingTrips.js`, `data/store/`
- Group D: `_DELETE_ME_old_modules/`
- E: removed redundant `jsconfig.json` (`tsconfig.json` already has `@/*`)
- E: kept `AGENTS.md` / `CLAUDE.md`; kept `dotenv` (`prisma/seed.ts` imports `dotenv/config`)
- Updated `international/index.js` to only export live exports (`BlogsSection`, `ShortContactForm`, `TravelerReviews`)

#### Group C — applied (approved)

**Secret scan before delete/move:** scanned all keep + delete scripts (esp. probes, `ping-db.mjs`, `fix-*`). No Easebuzz key/salt, `DATABASE_URL`, API keys, tokens, or passwords hardcoded. Kept DB scripts remain env-only. Absolute Windows output paths in `generate-trips.js` / `parse_all_trips.py` replaced with script-relative paths.

**KEEP → moved to `Frontend/scripts/data/` + `scripts/README.md` added:**

| File | Why keep |
|---|---|
| `build-rich-trips.mjs` | Generates `new-trips-rich.json` from PDF text |
| `generate-trips.js` | Trip generation helper |
| `extract-pdfs.mjs` | Extracts PDF → text for import pipeline |
| `parse_all_trips.py` | Parses trip content |
| `upsert-new-trips.mjs` | Upserts trips into Prisma DB |
| `update-2026-prices.mjs` | Content price updates in DB |
| `new-trips-parsed.json` | Source trip JSON |
| `new-trips-rich.json` | Source trip JSON used by upsert |
| `pdf-text/` (15 files) | Source text for trip content pipeline |

**DELETE (throwaway fix/check/list/probe):**

| File | Why delete |
|---|---|
| `fix-*.mjs` (all cover fix scripts) | One-off image fixes |
| `check-georgia.mjs`, `check-trip-covers.mjs`, `check-trip-images.mjs` | Diagnostics |
| `list-all-trips.mjs`, `list-blogs.mjs`, `list-broken-trip-images.mjs` | Listing utilities |
| `probe-easebuzz.mjs`, `probe-hash-variants.mjs`, `probe-validation.mjs` | Payment debug probes |
| `ping-db.mjs` | Connectivity smoke test only |

**Note:** Runtime seeding for production is `prisma/seed.ts` + `prisma/seedTrips.ts` (not under `scripts/`) — those stay put.

### Phase 2 — Security (2026-10-18)

**Findings fixed in code:**
- Timing-safe admin password/email compare (`safeCompare` + `timingSafeEqual`)
- Generic login error messages (no config disclosure)
- Admin session token now enforces `iat` expiry; lifetime **7d → 24h**
- Itinerary unlock cookie lifetime **30d → 7d** (already had `iat` check)
- CSRF defense: middleware rejects mutating `/api/admin/*` without same-origin `Origin`/`Referer`
- Rate limiter wrapped in Prisma `$transaction`
- Content-Security-Policy header added in `next.config.mjs`

**Already OK (verified, no change):** Easebuzz response hash uses `timingSafeEqual`; amount checked vs DB; admin routes gated; cron uses `CRON_SECRET`; Prisma parameterized; uploads type/size limited; `.env*` gitignored.

**Deferred / accepted:**
- Admin password remains env plaintext (not bcrypt hash) — rotate via env; bcrypt would need a hashed env workflow.
- Admin cookie `path=/` required so `/api/admin` receives it; no `domain=` (would break Vercel previews).
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` for Next.js; tighten with nonces later if needed.

### Phase 3 — Connectivity & integrations (2026-10-18)

**Runner:** `Frontend/scripts/phase3-connectivity.mjs` (safe logs — lengths/status only, no secrets).

| Check | Result |
|---|---|
| Env present (DB, Easebuzz, site URL, SMS, Google, cron, admin) | PASS |
| Neon DB ping (`trip.count`) | PASS |
| Easebuzz request/response hash shapes + tamper reject | PASS |
| `initiateLink` against **test** gateway | **FAIL — Invalid merchant key** |
| Same keys against **prod** gateway | Also not usable (`Request Invalid for the merchant`) |
| Local `/api/payments/bookings` | PASS |
| Local `/api/payments/easebuzz/initiate` | **FAIL** (same merchant key) |
| Callback rejects bad hash → `/payment/failed` | PASS |
| Callback valid **success** hash → `/payment/success` + `booking.paid` | PASS |
| Callback valid **failure** hash → `/payment/failed` + `Payment.status=FAILED` | PASS |

**Server-side hash verification and success/failure callback handling are verified** with synthetic signed payloads. **Hosted checkout:** accepted as working on Vercel (owner confirmed); local `initiateLink` key mismatch not pursued further.

**Webhook:** same `processEasebuzzNotification` path as callback (hash + amount + idempotency).
