# Deploy Divas Sojourn (Vercel + Neon)

Portable stack: **Next.js + Prisma + Postgres**. Vercel is the current host; the same env vars work on another host later.

**Root Directory on Vercel must be `Frontend`.**

Build command (already in `vercel.json`): `npm run vercel-build`  
→ `prisma generate && prisma migrate deploy && next build --webpack`

---

## 1. Security before push / go-live

| Check | Required |
|-------|----------|
| `.env` / `.env.local` gitignored — never commit real secrets | Yes |
| Only `.env.example` / `.env.local.example` in git (placeholders) | Yes |
| `MOCK_OTP` **unset** on Production | Yes |
| Strong unique `ADMIN_PASSWORD` + `ADMIN_AUTH_SECRET` + `AUTH_SECRET` | Yes |
| Production `EASEBUZZ_ENV` intentional (`test` vs `prod`) | Yes |
| Production `NEXT_PUBLIC_SITE_URL` = real public origin (no trailing slash) | Yes |

If a secret was ever committed or pasted into chat, **rotate it** in the provider dashboard.

---

## 2. Environment variables (Production + Preview)

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Neon pooled |
| `DATABASE_URL_UNPOOLED` | Yes | Neon direct (migrations) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Yes | Admin login |
| `ADMIN_AUTH_SECRET` | Yes | Admin session HMAC |
| `AUTH_SECRET` | Yes | Itinerary unlock (+ fallback signing) |
| `NEXT_PUBLIC_SITE_URL` | Yes | e.g. `https://divassojourn.com` — used for Easebuzz surl/furl |
| `EASEBUZZ_KEY` / `EASEBUZZ_SALT` | Yes | Payments |
| `EASEBUZZ_ENV` | Yes | `test` or `prod` |
| `SMSALERT_API_KEY` / `SMSALERT_SENDER` / `SMSALERT_OTP_TEMPLATE` | Yes for OTP | Template must include `[otp]` |
| `BLOB_READ_WRITE_TOKEN` | Yes for admin uploads | Vercel Blob store |
| `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` | Optional | Reviews cache (currently static path OK) |
| `CRON_SECRET` | Optional | `/api/cron/google-reviews` auth |
| `MOCK_OTP` | **Never** on prod | Dev-only |
| `RESEND_API_KEY` | Yes for enquiry emails | Resend — emails team on form submit |
| `ENQUIRY_NOTIFY_EMAIL` | Optional | Defaults to `pooja.divassojourn@gmail.com` |
| `ENQUIRY_FROM_EMAIL` | Optional | Verified Resend from address |

Templates: `.env.example` / `.env.local.example` (names only).

---

## 3. First-time / database

Local (after env is set):

```bash
cd Frontend
npm install
npx prisma migrate deploy
npx prisma db seed   # optional content seed
npm run dev
```

On every Vercel deploy, `vercel-build` runs **`prisma migrate deploy`** (not `db push`).

---

## 4. Domain & payments

1. Attach custom domain in Vercel (or final host DNS → that host).
2. Set `NEXT_PUBLIC_SITE_URL` to that HTTPS origin and **redeploy**.
3. In Easebuzz dashboard, ensure webhook / callback URLs match:
   - Callback: `{NEXT_PUBLIC_SITE_URL}/api/payments/easebuzz/callback`
   - Webhook (if used): `{NEXT_PUBLIC_SITE_URL}/api/payments/easebuzz/webhook`
4. Switch `EASEBUZZ_ENV=prod` and live keys only when ready to take real money.

---

## 5. Admin access

- Login: `{SITE}/admin/login`
- Middleware gates `/admin/*` and `/api/admin/*` (except login).
- Missing admin env in production → login fails closed.

---

## 6. Post-deploy smoke test

- [ ] `/` loads
- [ ] `/india-trips`, `/international-trips`, `/upcoming-trips` show DB trips
- [ ] `/blogs`, `/faqs`, `/gallery`, `/calendar` load
- [ ] `/robots.txt` and `/sitemap.xml` return 200
- [ ] `/admin/login` works; logged-out `/admin` redirects
- [ ] Admin upload (image) works if Blob token set
- [ ] Itinerary OTP send/verify (if SMS Alert configured)
- [ ] Payments checkout on the **deployed** URL (Easebuzz working on Vercel already confirmed)
- [ ] `/payment/success` and `/payment/failed` reachable after a test payment

---

## 7. Local vs deploy

```text
Local:     .env.local  →  npm run dev
Vercel:    Project env vars  →  npm run vercel-build
Admin:     {SITE}/admin/login
```
