# Admin Panel Guide

This document explains everything built for the **Divas Sojourn Admin Panel**: pages, auth, APIs, data layer, database, uploads, and how content reaches the public site.

---

## What the admin panel is for

The admin panel lets a single authenticated admin manage:

1. **Blogs** — create, edit, publish/unpublish, delete
2. **Gallery** — upload photos, delete photos
3. **Trips** — create, edit, publish/unpublish, delete India & International trips

Admin routes live under `/admin`. They use a separate login from traveler phone OTP auth on `/auth`.

---

## How to open and log in

1. Start the app from `Frontend/`:

   ```bash
   npm run dev
   ```

2. Go to: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

3. Sign in with credentials from `.env` / `.env.local`:

   | Variable | Purpose |
   |----------|---------|
   | `ADMIN_EMAIL` | Admin email (default example: `admin@divassojourn.com`) |
   | `ADMIN_PASSWORD` | Admin password |
   | `ADMIN_AUTH_SECRET` | Secret used to sign the admin session cookie |

On success you are redirected to `/admin` (or to the page you were trying to open).

**Logout** is in the admin header and calls `POST /api/admin/logout`.

---

## End-to-end flow (important)

```text
Admin UI (/admin/...)
    → Admin API (/api/admin/...)
        → Data access layer (app/lib/data/blogs.ts | gallery.ts | trips.ts)
            → Prisma Client
                → SQLite (local) via DATABASE_URL
```

Public site flow:

```text
/blogs, /gallery, /upcoming-trips, /india-trips, /international-trips, /calendar, trip details
    → Same data access layer
        → Prisma
            → Same database
```

So when an admin adds or deletes a blog/photo/trip, the next load of the public page shows the change. There is no separate hardcoded list for live trip content (old JS data files remain as seed sources only).

Image/PDF files today:

```text
Admin upload
    → saved under public/uploads/blogs | gallery | trips
    → URL like /uploads/trips/... stored on the DB record
```

(Cloud storage can replace `app/lib/uploads.ts` later without changing the admin UI.)

---

## Pages (UI)

Admin UI is TypeScript/React under `app/admin/`. It does **not** use the main site Navbar/Footer (`AppShell` skips chrome for `/admin`).

### Layout / shell

| File | Role |
|------|------|
| `app/admin/layout.tsx` | Wraps all admin pages |
| `app/admin/AdminShell.tsx` | Dark header with links (Blogs, Gallery, Trips, View site) + logout; plain layout on login |
| `app/admin/AdminLogoutButton.tsx` | Calls logout API and redirects to login |

### `/admin/login`

| File | Role |
|------|------|
| `app/admin/login/page.tsx` | Email + password form |

- Posts to `/api/admin/login`
- Supports `?redirect=/admin/...` after login
- Unauthenticated visits to other `/admin/*` pages are redirected here by middleware

### `/admin` (dashboard)

| File | Role |
|------|------|
| `app/admin/page.tsx` | Cards for Manage Blogs, Manage Gallery, Manage Trips |

### `/admin/blogs`

| File | Role |
|------|------|
| `app/admin/blogs/page.tsx` | Page entry |
| `app/admin/blogs/BlogsAdminClient.tsx` | Table of all blogs (including drafts) |

Features:

- Columns: title, published/draft status, created date, Edit / Delete
- **Add New Blog** → `/admin/blogs/new`
- **Edit** → `/admin/blogs/[id]/edit`
- **Delete** → confirm dialog, then `DELETE /api/admin/blogs/:id`, then re-fetch list

### Blog form (new + edit)

| File | Role |
|------|------|
| `app/admin/blogs/BlogForm.tsx` | Shared create/edit form |
| `app/admin/blogs/new/page.tsx` | Create mode |
| `app/admin/blogs/[id]/edit/page.tsx` | Edit mode (loads blog by id via data layer) |

Form fields:

- Title* (slug auto-generated from title, editable)
- Slug*
- Cover image (file upload: jpg/png/webp, max 5MB) or keep existing URL
- Excerpt*
- Content* (full body text)
- Author*
- Category, Destination, Reading time (optional, for public card UI)
- Published toggle
- Featured toggle

Saves via:

- Create → `POST /api/admin/blogs` (multipart form)
- Update → `PUT /api/admin/blogs/:id` (multipart form)

### `/admin/gallery`

| File | Role |
|------|------|
| `app/admin/gallery/page.tsx` | Page entry |
| `app/admin/gallery/GalleryAdminClient.tsx` | Grid + upload form |

Features:

- Multi-file upload (jpg/png/webp, max 5MB each)
- Optional caption + category applied to that upload batch
- Grid of existing photos with trash button (confirm before delete)
- Upload → `POST /api/admin/gallery`
- Delete → `DELETE /api/admin/gallery/:id`, then re-fetch

### `/admin/trips`

| File | Role |
|------|------|
| `app/admin/trips/page.tsx` | Page entry |
| `app/admin/trips/TripsAdminClient.tsx` | Table of all trips |
| `app/admin/trips/TripForm.tsx` | Shared create/edit form |
| `app/admin/trips/new/page.tsx` | Create mode |
| `app/admin/trips/[id]/edit/page.tsx` | Edit mode |

List columns: title, destination, dates, upcoming/past status, published/draft, Edit / Delete.

Form sections (aligned with public trip detail pages):

- Basics: destination (`India` \| `International`), title, shortName, slug, published, soldOut
- Media: cover image, gallery uploads, optional PDF
- Schedule & logistics: start/end dates, nights/days, duration label, pickup/drop, route
- Pricing: price, early bird, supplements, currency
- Overview, highlights, inclusions, exclusions, notes
- Itinerary day rows, accommodations rows
- Payment conditions, financial details, cancellation links

Saves via multipart `FormData` with a JSON `payload` plus optional files:

- Create → `POST /api/admin/trips`
- Update → `PUT /api/admin/trips/:id`
- Delete → `DELETE /api/admin/trips/:id` (also removes local `/uploads/trips/` files when present)

**Upcoming vs past** is computed at read time from `startDate >= today` (not hardcoded). Drafts (`published: false`) stay in admin only.

---

## Auth & route protection

### Session

| File | Role |
|------|------|
| `app/lib/admin/session.ts` | Create/verify signed HttpOnly cookie `divasAdminSession` |

- Single admin user from env (not a user table yet)
- Separate from traveler OTP session (`divasAuthSession` in localStorage)

### Middleware

| File | Role |
|------|------|
| `middleware.ts` | Protects `/admin/*` and `/api/admin/*` |

Behavior:

- `/admin/*` except `/admin/login` → must be logged in, else redirect to login
- Logged-in user hitting `/admin/login` → redirect to `/admin`
- `/api/admin/*` except `/api/admin/login` → 401 JSON if no valid cookie

---

## API routes

### Auth

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/admin/login` | Public | Set admin cookie |
| POST | `/api/admin/logout` | Admin | Clear cookie |

### Blogs (admin)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/admin/blogs` | Admin | All blogs (drafts included) |
| POST | `/api/admin/blogs` | Admin | Create blog (+ optional cover upload) |
| PUT | `/api/admin/blogs/[id]` | Admin | Update blog |
| DELETE | `/api/admin/blogs/[id]` | Admin | Delete blog (+ local cover file if under `/uploads/`) |

### Gallery (admin)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/admin/gallery` | Admin | All gallery records |
| POST | `/api/admin/gallery` | Admin | Multi upload + create records |
| DELETE | `/api/admin/gallery/[id]` | Admin | Delete record (+ local file if under `/uploads/`) |

### Trips (admin)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/admin/trips` | Admin | All trips (drafts included) |
| POST | `/api/admin/trips` | Admin | Create trip (+ optional cover/gallery/PDF) |
| PUT | `/api/admin/trips/[id]` | Admin | Update trip |
| DELETE | `/api/admin/trips/[id]` | Admin | Delete trip (+ local uploads when under `/uploads/`) |

### Public (read-only, no admin auth)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/blogs` | Published blogs only |
| GET | `/api/blogs/[slug]` | One published blog |
| GET | `/api/gallery` | All gallery images |
| GET | `/api/trips` | Published trips (`?view=upcoming|nav`, `?destination=India|International`) |
| GET | `/api/trips/[slug]` | One published trip |

All of these go through `app/lib/data/*`, not through hardcoded arrays.

---

## Data layer & database

### Types

| File | Role |
|------|------|
| `app/lib/data/types.ts` | `Blog`, `GalleryImage`, `Trip`, create/update inputs, public card shapes |

### Access functions (stable API for UI)

| File | Functions |
|------|-----------|
| `app/lib/data/blogs.ts` | `getBlogs`, `getPublishedBlogs`, `getBlogBySlug`, `getBlogById`, `createBlog`, `updateBlog`, `deleteBlog` |
| `app/lib/data/gallery.ts` | `getGalleryImages`, `getGalleryImageById`, `createGalleryImage`, `deleteGalleryImage` |
| `app/lib/data/trips.ts` | `getTrips`, `getPublishedTrips`, `getUpcomingTrips`, `getUpcomingTripsByDestination`, `getTripBySlug`, `getTripById`, `getTripNavItems`, `createTrip`, `updateTrip`, `deleteTrip` |
| `app/lib/data/prisma.ts` | Shared Prisma client |
| `app/lib/data/mappers.ts` | Map DB blogs → public card shape |
| `app/lib/data/tripMappers.ts` | Map DB trips → detail / upcoming card / nav shapes; compute upcoming/past |
| `app/lib/uploads.ts` | Save files to `public/uploads/{blogs\|gallery\|trips}/`, validate type/size |

### Prisma models

Defined in `prisma/schema.prisma`:

**Blog** — `id`, `title`, `slug` (unique), `coverImageUrl`, `excerpt`, `content`, `author`, `published`, `createdAt`, `updatedAt`, plus optional `category`, `categories` (JSON array), `destination`, `readingTime`, `featured`

**GalleryImage** — `id`, `imageUrl`, `caption?`, `category?`, `createdAt`

**Trip** — identity (`title`, `shortName`, `slug`, `destination`), media, schedule, logistics, pricing, copy, nested JSON (`itinerary`, `accommodations`, `highlights`, inclusions/exclusions/notes, `financialDetails`, `cancellationLinks`, `galleryImages`), `published`, timestamps

### Local database

- Provider: **SQLite** (local testing)
- URL: `DATABASE_URL="file:./dev.db"` (file under `prisma/`)
- Migrate: `npx prisma migrate dev`
- Seed: `npx prisma db seed` (`prisma/seed.ts` uses `seedBlogs.ts` / `seedGallery.ts` / `seedTrips.ts`)

To move to production Postgres later: change provider to `postgresql`, set a real `DATABASE_URL`, run `npx prisma migrate deploy`. Application code (admin UI / APIs / data function signatures) should not need to change.

---

## How admin changes show on the public site

| Public page | Source |
|-------------|--------|
| `/blogs` | `getPublishedBlogs()` → existing blog listing UI |
| `/blogs/[slug]` | `getBlogBySlug()` → full content |
| `/gallery` | `getGalleryImages()` → `PhotoGallery` via `images` prop |
| `/upcoming-trips` | `getUpcomingTrips()` |
| `/india-trips` | `getUpcomingTripsByDestination("India")` |
| `/international-trips` | `getUpcomingTripsByDestination("International")` |
| `/india-trips/[slug]` | `getTripBySlug` + destination India |
| `/international-trips/[slug]` | `getTripBySlug` + destination International |
| `/calendar` | `getPublishedTrips()` |
| Navbar trip menus | `getTripNavItems()` from root layout |
| International / India trip pages | Published blogs passed into `BlogsSection` |

Unpublished blogs/trips appear in **admin** list only, not on public listings.

Affected listing/detail/calendar pages use `dynamic = 'force-dynamic'` so add/edit/delete shows without a rebuild.

---

## File map (quick reference)

```text
Frontend/
├── admin.md                          ← this guide
├── middleware.ts                     ← protect /admin + /api/admin
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   ├── seedTrips.ts
│   └── migrations/
├── public/uploads/
│   ├── blogs/
│   ├── gallery/
│   └── trips/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── page.tsx                  ← dashboard
│   │   ├── blogs/...
│   │   ├── gallery/...
│   │   └── trips/...
│   ├── api/
│   │   ├── admin/login|logout|blogs|gallery|trips
│   │   ├── blogs/
│   │   ├── gallery/
│   │   └── trips/
│   └── lib/
│       ├── admin/session.ts
│       ├── uploads.ts
│       └── data/
│           ├── types.ts
│           ├── blogs.ts
│           ├── gallery.ts
│           ├── trips.ts
│           ├── tripMappers.ts
│           ├── prisma.ts
│           └── mappers.ts
```

---

## What is intentionally not in admin yet

- Multi-admin user accounts / roles table
- Cloud image hosting (still local `public/uploads/`)
- Rich text / markdown editor polish (content is a textarea)
- Production Postgres (SQLite for local only)

Those can plug in using the same pattern: types → `lib/data/*` → API → `/admin/...` pages.
