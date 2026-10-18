# Frontend scripts

Offline / one-off tooling. **Not used by the Next.js runtime.** Production trip seeding lives in `prisma/seed.ts` and `prisma/seedTrips.ts`.

All commands below assume **cwd = `Frontend/`**.

## Layout

| Path | Role |
|---|---|
| `scripts/data/` | Archived trip content pipeline (PDF → text → JSON → Prisma upsert) |
| `scripts/phase3-connectivity.mjs` | Phase 3 connectivity + Easebuzz callback hash checks (no secret logging) |
| `scripts/README.md` | This file |

### Phase 3 connectivity

With the Next dev server running and `EASEBUZZ_ENV=test`:

```bash
node scripts/phase3-connectivity.mjs
```

Requires `DATABASE_URL`, `EASEBUZZ_KEY`, `EASEBUZZ_SALT`, `NEXT_PUBLIC_SITE_URL`. Never commit real keys.

## Trip content pipeline (`scripts/data/`)

### Purpose of each file

| Script / data | Purpose |
|---|---|
| `extract-pdfs.mjs` | Reads PDFs from `Frontend/new trips details/` and writes plain text into `data/pdf-text/` |
| `parse_all_trips.py` | Hand-curated trip objects → writes `new-trips-parsed.json` |
| `generate-trips.js` | Partial / sample JS generator → writes `new-trips-parsed.json` |
| `build-rich-trips.mjs` | Parses `pdf-text/` + metadata → writes `new-trips-rich.json` (itinerary, inclusions, etc.) |
| `upsert-new-trips.mjs` | Upserts `new-trips-rich.json` into the Prisma `Trip` table |
| `update-2026-prices.mjs` | One-shot price / early-bird updates for known slugs |
| `new-trips-parsed.json` | Intermediate parsed trip JSON |
| `new-trips-rich.json` | Rich trip JSON consumed by upsert |
| `pdf-text/*.txt` | Extracted PDF text used by `build-rich-trips.mjs` |

### Recommended run order

1. Place source PDFs in `Frontend/new trips details/` (local folder; often gitignored).
2. `node scripts/data/extract-pdfs.mjs` → fills `scripts/data/pdf-text/`.
3. Optionally refresh structured JSON:
   - `python scripts/data/parse_all_trips.py`, **or**
   - `node scripts/data/generate-trips.js` (sample / partial).
4. `node scripts/data/build-rich-trips.mjs` → regenerates `new-trips-rich.json` from `pdf-text/`.
5. `node scripts/data/upsert-new-trips.mjs` → writes trips to the database.
6. (Optional) `node scripts/data/update-2026-prices.mjs` → apply known price patches.

### Required environment variables

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | `upsert-new-trips.mjs`, `update-2026-prices.mjs` | Prisma connection string (from `.env` / `.env.local`; never hardcode) |

Scripts load Prisma’s default env resolution. Ensure `.env` or `.env.local` in `Frontend/` defines `DATABASE_URL` before running DB scripts.

No Easebuzz / SMS / admin / Blob keys are required for this pipeline.

### Python requirements (`parse_all_trips.py`)

- **Python 3.9+** recommended.
- **Stdlib only** (`json`, `pathlib`) — no `pip install` needed for this script.

### Node requirements (`extract-pdfs.mjs`)

- Requires the `pdf-parse` package (`npm install pdf-parse` in `Frontend/` if not already present). Not needed for the Next.js production build.

## Secrets policy

- Never commit API keys, salts, tokens, passwords, or `DATABASE_URL` values.
- DB scripts must read credentials from environment variables only.
- Company bank / UPI strings that appear inside trip content JSON mirror public trip PDFs; treat as business content, not API secrets.
