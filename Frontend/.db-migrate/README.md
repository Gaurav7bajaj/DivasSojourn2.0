# Neon → Railway Postgres migration notes

## Status (2026-11-23)

- Railway Postgres is live in project `calm-renewal` (service `Postgres`).
- App service `DivasSojourn2.0` `DATABASE_URL` / `DATABASE_URL_UNPOOLED` point at the Railway public TCP proxy.
- Local `Frontend/.env.local` uses the same proxy URL.
- Neon remains as rollback backup — **do not delete** until the live site has been healthy for 3–7 days.

## Neon → Railway data restore (completed 2026-11-23)

Neon was unlocked via Vercel → Neon integration → **Launch**. Data was copied with `.db-migrate/copy-neon-to-railway.ps1` (binary `COPY` in Railway column order) because Windows lacked a Postgres 18 `pg_dump` (UAC canceled the installer).

Verified Neon source counts before copy: 42 trips, 14 enquiries, 33 bookings, 45 blogs.

Neon remains as rollback backup — keep 3–7 days, then pause/delete.
