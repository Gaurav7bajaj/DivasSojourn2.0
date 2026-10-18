# Divas Sojourn Frontend

Next.js 16 App Router + Prisma + Neon Postgres. Deploy root on Vercel: **`Frontend/`**.

## Run locally

```bash
cd Frontend
cp .env.local.example .env.local
# Fill secrets (or: npx vercel link && npx vercel env pull .env.development.local)
npm install
npx prisma migrate deploy
npx prisma db seed   # optional
npm run dev
```

Open http://localhost:3000

See **[DEPLOY.md](./DEPLOY.md)** for Vercel env vars, domain, Easebuzz callbacks, and the go-live smoke test.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local Next (webpack) |
| `npm run build` | `prisma generate` + `next build` |
| `npm run vercel-build` | `prisma generate` + `migrate deploy` + `next build` (Vercel) |
| `npm run db:migrate` | `prisma migrate deploy` |
| `npm run db:seed` | Seed content |

Offline trip import tooling: [`scripts/README.md`](./scripts/README.md).

## Admin

- Local: http://localhost:3000/admin/login  
- Deployed: `https://YOUR-DOMAIN/admin/login`  
- Credentials: `ADMIN_EMAIL` / `ADMIN_PASSWORD` from env (never commit)

## Notes

- Uploads: local `public/uploads/`; on Vercel use **Blob** (`BLOB_READ_WRITE_TOKEN`).
- Payments: Easebuzz (`EASEBUZZ_*` + `NEXT_PUBLIC_SITE_URL`).
- Production readiness notes for this repo: [`../PRODUCTION_AUDIT.md`](../PRODUCTION_AUDIT.md).
