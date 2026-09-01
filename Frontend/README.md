# Divas Sojourn Frontend

## Run locally

```bash
cd Frontend
cp .env.local.example .env.local
# Prefer pulling DB URLs from Vercel after Neon is connected:
#   npx vercel link
#   npx vercel env pull .env.development.local
# Then keep ADMIN_* and Clerk keys in .env.local
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (temporary client preview only)

Vercel is **only** for showing the client a demo URL. Final production will use a **different host**.

See **[DEPLOY.md](./DEPLOY.md)** for the preview checklist (Neon, env vars, admin access).

Quick facts:

- Set Vercel **Root Directory** to `Frontend`
- Preview admin: `https://YOUR-APP.vercel.app/admin/login`
- Secrets go in Vercel env vars (not GitHub)
- App stays portable: Next.js + Prisma + Postgres — easy to move later

## Admin panel

1. Local: http://localhost:3000/admin/login  
2. Vercel preview: `https://YOUR-APP.vercel.app/admin/login`  
3. Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local` (local) or Vercel env vars (preview)  
4. Manage **Blogs**, **Gallery**, and **Trips** from the dashboard  

Full preview + admin steps: [DEPLOY.md](./DEPLOY.md).

## Database (Prisma + Neon)

- **Provider:** PostgreSQL (Neon) — usable on Vercel preview **and** later on another host
- Set `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) in local env and on Vercel
- Preview/deploy build runs `prisma db push` via `npm run vercel-build`

Uploaded images save under `public/uploads/` locally. On Vercel that disk is ephemeral — use HTTPS image URLs for the client preview until cloud storage is added in `app/lib/uploads.ts`.
