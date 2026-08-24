# Divas Sojourn Frontend

## Run locally

```bash
cd Frontend
cp .env.example .env
# Also copy to .env.local if you use Next-only env loading for auth vars
cp .env.local.example .env.local
# Edit credentials as needed
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open http://localhost:3000

## Admin panel

1. Go to http://localhost:3000/admin/login
2. Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` / `.env.local`
3. Manage **Blogs**, **Gallery**, and **Trips** from the dashboard

Public pages (`/blogs`, `/gallery`, `/upcoming-trips`, `/india-trips`, `/international-trips`, `/calendar`, and trip detail pages) read from the same data-access layer (`app/lib/data/*`), so admin changes appear on the next page load.

See [admin.md](./admin.md) for the full admin guide.

## Database (Prisma)

This project currently uses SQLite for local development via Prisma. To switch to production Postgres, update the provider in `schema.prisma` to `postgresql`, set `DATABASE_URL` to the real connection string, and run `npx prisma migrate deploy`. No application code changes are required.

Uploaded images still save under `public/uploads/` for now; cloud storage (Cloudinary/S3) can be swapped later inside `app/lib/uploads.ts` only.
