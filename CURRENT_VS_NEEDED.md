# Current vs Needed

This file compares the current state against the target state for a clean, real-data travel site.

## Current Features

### Pages Built

- [x] Homepage: `/`
- [x] India Trips Listing: `/india-trips`
- [x] India Trip Details: `/india-trips/[trip-slug]`
- [x] International Trips Listing: `/international-trips`
- [x] International Trip Details: `/international-trips/[slug]`
- [x] Upcoming Trips: `/upcoming-trips`
- [x] Blogs Listing: `/blogs`
- [x] Blog Details: `/blogs/[slug]`
- [x] Payments: `/payments`
- [x] Curated Escapes Listing: `/curated-escapes`
- [x] Curated Escape Category Details: `/curated-escapes/[category-slug]`

### Pages Missing

- [ ] `/luxury-experiences`
- [ ] `/about-us`
- [ ] `/faqs`
- [ ] `/personalize-trip`

### Detail Page Counts

- India detail pages: 6 built.
- International detail pages: 13 built.
- Total trip detail pages: 19 built.

### Components Built

- [x] Navigation/header.
- [x] Footer.
- [x] Floating WhatsApp button.
- [x] Homepage hero.
- [x] Homepage trip sections.
- [x] Review stat cards.
- [x] India listing cards.
- [x] International listing cards.
- [x] International hero carousel.
- [x] Upcoming trip filters.
- [x] Upcoming trip cards.
- [x] Blog listing and filters.
- [x] Curated escape hero and cards.
- [x] Payment method cards and policy tables.
- [x] Shared trip detail hero.
- [x] Trip tabs.
- [x] Itinerary accordion.
- [x] Inclusions/exclusions lists.
- [x] Gallery.
- [x] Other info/pricing/accommodation tab.
- [x] Enquiry form.
- [x] Share button.
- [x] Similar trips carousel.
- [x] Journey in Frames carousel.

### Functionality Built

- [x] Static route generation for India trips.
- [x] Static route generation for International trips.
- [x] SEO metadata for major pages.
- [x] JSON-LD for listings and trip details.
- [x] Download itinerary PDF links.
- [x] Share trip via Web Share API/clipboard fallback.
- [x] Client-side enquiry validation.
- [x] LocalStorage lead capture.
- [x] Upcoming trip filtering by destination, duration, budget, and month.
- [x] Blog listing filtering.
- [x] Responsive navbar with mobile menu.
- [x] Desktop dropdowns for India and International trips.

## Needed Improvements

### Data

- [ ] Remove remaining fake data from `mockData.js`.
- [ ] Replace fake platform review counts with verified review data.
- [ ] Replace sample traveler reviews with real testimonials.
- [ ] Include International trips in Upcoming Trips.
- [ ] Complete exact International PDF extraction for all 13 trips.
- [ ] Add full blog article content.
- [ ] Add real curated escape category detail content.

### Routes

- [ ] Build `/luxury-experiences`.
- [ ] Build `/about-us`.
- [ ] Build `/faqs`.
- [ ] Build `/personalize-trip`.

### Components

- [ ] Rename `india-trip-detail` folder to `trip-detail`.
- [ ] Remove unused `ExperiencesSection.jsx`.
- [ ] Remove unused `PaymentsHeader.jsx` if no longer needed.
- [ ] Split large `TripTabs.jsx` if it becomes difficult to maintain.
- [ ] Add shared utilities for formatting and trip mapping.

### Backend and Forms

- [ ] Add backend/API endpoint for leads.
- [ ] Replace localStorage form persistence.
- [ ] Add server-side validation.
- [ ] Add CRM/email integration.

### QA

- [ ] Fix any broken external image URLs.
- [ ] Fix Next image aspect ratio warnings.
- [ ] Run full build after stopping dev server to avoid `.next` file locks.
- [ ] Test all generated pages and dropdown links.

## Before: Current State

- Pages built: 11 route files, including static and dynamic route groups.
- Generated trip detail pages: 19 total.
- India trips: 6 real PDF-derived trips.
- International trips: 13 represented from PDFs.
- API endpoints: 0.
- Data storage: local JS modules.
- Forms: client-side localStorage only.
- Remaining hardcoded/sample trip groups:
  - Homepage India cards from `mockData.js`.
  - Homepage curated cards from `mockData.js`.
  - Review stats from `mockData.js`.
  - Traveler reviews from `travelerReviews.js`.
- Placeholder pages:
  - Blog details.
  - Curated escape category details.
- Missing nav routes:
  - `/luxury-experiences`
  - `/about-us`
  - `/faqs`
  - `/personalize-trip`

## After: Target Clean State

- 19 real trip detail pages with full PDF-specific itinerary/inclusion/exclusion content.
- Homepage cards fully powered by real data modules.
- Upcoming Trips includes both India and International departures.
- No `mockData.js`.
- No fake reviews or unverified rating counts.
- Navigation points only to implemented routes.
- Blog detail pages render full content.
- Curated escape detail pages render full package/category content.
- Lead forms post to backend or CRM instead of localStorage.
- Shared trip detail components live under a neutral `trip-detail` folder.

## Roadmap Estimate

These are rough estimates for a single developer familiar with the current codebase.

```text
1. Clean up fake data and navigation config:       2-4 hours
2. Include International trips in Upcoming Trips:  2-3 hours
3. Complete International PDF extraction:          6-10 hours
4. Rename/refactor shared trip detail components:  1-2 hours
5. Build missing nav pages:                        4-8 hours
6. Replace blog placeholders with real content:    4-8 hours
7. Replace curated placeholders with real content: 3-6 hours
8. Add backend/form integration:                   4-8 hours
9. QA, responsive testing, SEO pass:               4-6 hours
```

Estimated total cleanup and hardening time:

```text
30-55 hours
```

## Priority Recommendation

Do this first:

1. Clean `mockData.js` dependencies.
2. Add International trips to Upcoming Trips.
3. Complete exact International trip details.
4. Fix nav-only routes or remove links.
5. Replace placeholder content in blogs and curated categories.
