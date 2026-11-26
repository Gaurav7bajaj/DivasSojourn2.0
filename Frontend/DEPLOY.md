# Deploy Divas Sojourn (Railway + Railway Postgres)

Portable stack: **Next.js + Prisma + Postgres**. Production runs on **Railway** with **Railway Postgres** in the same project (`calm-renewal`). Neon is retained only as a temporary backup until you confirm the live site is healthy.

**Root Directory on Railway / Vercel must be `Frontend`.**

Build command (already in `vercel.json` / Railway): `npm run vercel-build`  
→ `prisma generate && prisma migrate deploy && next build --webpack`

> Build-time note: `prisma migrate deploy` needs a reachable DB host. Use the Railway **public TCP proxy** URL for `DATABASE_URL` / `DATABASE_URL_UNPOOLED` on the web service (not `*.railway.internal`, which is unavailable during image build).

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
| `DATABASE_URL` | Yes | Railway Postgres (public TCP proxy URL for build + runtime) |
| `DATABASE_URL_UNPOOLED` | Yes | Same Railway URL (Prisma `directUrl`; no pooler split needed) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Yes | Admin login |
| `ADMIN_AUTH_SECRET` | Yes | Admin session HMAC |
| `AUTH_SECRET` | Yes | Itinerary unlock (+ fallback signing) |
| `NEXT_PUBLIC_SITE_URL` | Yes | e.g. `https://divassojourn.com` — used for Easebuzz surl/furl |
| `EASEBUZZ_KEY` / `EASEBUZZ_SALT` | Yes | Payments |
| `EASEBUZZ_ENV` | Yes | `test` or `prod` |
| `SMSALERT_API_KEY` / `SMSALERT_SENDER` / `SMSALERT_OTP_TEMPLATE` | Yes for OTP | Template must include `[otp]` |
| Railway **Volume** | Yes for admin uploads on Railway | Mount at `/app/public/uploads` (Railway sets `RAILWAY_VOLUME_MOUNT_PATH`) |
| `BLOB_READ_WRITE_TOKEN` | Optional fallback | Only if not using a Railway volume |
| `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` | Optional | Reviews cache (currently static path OK) |
| `CRON_SECRET` | Optional | `/api/cron/google-reviews` auth |
| `MOCK_OTP` | **Never** on prod | Dev-only |
| `RESEND_API_KEY` | Yes for enquiry emails | Resend — emails team on form submit |
| `ENQUIRY_NOTIFY_EMAIL` | Optional | Defaults to `pooja.divassojourn@gmail.com` |
| `ENQUIRY_FROM_EMAIL` | Optional | Verified Resend from address |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | GA4 Measurement ID (`G-XXXXXXXX`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console HTML-tag content value |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | Meta (Facebook) Pixel ID |

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

On every Railway deploy, `vercel-build` runs **`prisma migrate deploy`** (not `db push`).

### Neon → Railway cutover (done)

- Production `DATABASE_URL` / `DATABASE_URL_UNPOOLED` point at Railway Postgres (TCP proxy `maglev.proxy.rlwy.net`).
- Neon project is **not deleted** — keep it 3–7 days as rollback. If you must roll back: restore the old Neon URLs on the Railway web service and redeploy.
- Neon was quota-locked during migration, so live Neon row data could not be `pg_dump`’d. Railway was schema-pushed + `prisma db seed`’d (trips/reviews/blogs/gallery). After Neon quota is unlocked (upgrade Launch temporarily or wait for monthly reset), dump Neon and restore into Railway if you need historical enquiries/bookings.

---

## 4. Domain & payments

1. Custom domain is on Railway (`divassojourn.com`); Railway public URL is also active.
2. Set `NEXT_PUBLIC_SITE_URL` to the HTTPS origin clients use and **redeploy**.
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
Local:     .env.local (Railway TCP proxy)  →  npm run dev
Railway:   service env vars  →  npm run vercel-build
Admin:     {SITE}/admin/login
```
