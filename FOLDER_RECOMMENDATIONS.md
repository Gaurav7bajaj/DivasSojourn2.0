# Folder Recommendations

The current project is workable, but trip detail functionality has outgrown the `india-trip-detail` folder name and the mixed `mockData.js` file. This document recommends a cleaner structure.

## Current Strengths

- App Router route folders are clear.
- Listing pages and detail pages are separated.
- Data modules are centralized under `app/data`.
- Trip detail components are modular and reusable.
- PDF downloads are stored in `public` with clean slug filenames.

## Current Problems

- Shared trip detail components live in `components/india-trip-detail`, even though International trip pages also use them.
- `mockData.js` mixes navigation config with fake reviews and sample cards.
- Upcoming Trips only uses India trips.
- International trip data still needs exact full extraction for several trip itineraries.
- Placeholder pages exist for blogs and curated escape categories.

## Recommended Structure

Keep Next.js App Router. Do not switch to `src/pages`; this project already uses `app/`.

```text
Frontend/
|-- app/
|   |-- (marketing)/
|   |   |-- about-us/
|   |   |-- faqs/
|   |   |-- luxury-experiences/
|   |   `-- personalize-trip/
|   |-- blogs/
|   |-- curated-escapes/
|   |-- india-trips/
|   |-- international-trips/
|   |-- payments/
|   |-- upcoming-trips/
|   |-- components/
|   |   |-- blogs/
|   |   |-- curated-escapes/
|   |   |-- forms/
|   |   |-- home/
|   |   |-- layout/
|   |   |-- payments/
|   |   |-- trip-detail/
|   |   |-- trip-listing/
|   |   `-- upcoming/
|   |-- data/
|   |   |-- blogs.js
|   |   |-- curatedEscapes.js
|   |   |-- navigation.js
|   |   |-- payments.js
|   |   |-- reviews.js
|   |   `-- trips/
|   |       |-- indiaTrips.js
|   |       |-- internationalTrips.js
|   |       |-- tripIndex.js
|   |       `-- upcomingTrips.js
|   |-- utils/
|   |   |-- formatters.js
|   |   `-- tripHelpers.js
|   `-- globals.css
`-- public/
    |-- brand/
    |-- trip-pdfs/
    |   |-- india/
    |   `-- international/
    `-- videos/
```

## Recommended Component Moves

### Move layout components

```text
FROM: app/components/Navbar.jsx
TO:   app/components/layout/Navbar.jsx

FROM: app/components/Footer.jsx
TO:   app/components/layout/Footer.jsx

FROM: app/components/WhatsAppButton.jsx
TO:   app/components/layout/WhatsAppButton.jsx
```

Reason:

- These are global layout components, not feature-specific components.

### Rename shared trip detail folder

```text
FROM: app/components/india-trip-detail/
TO:   app/components/trip-detail/
```

Reason:

- The components now serve both `/india-trips/[trip-slug]` and `/international-trips/[slug]`.

Suggested files:

```text
components/trip-detail/
|-- TripDetailPage.jsx
|-- TripHero.jsx
|-- TripTabs.jsx
|-- TripOverview.jsx
|-- TripItinerary.jsx
|-- TripInclusions.jsx
|-- TripExclusions.jsx
|-- TripGallery.jsx
|-- TripOtherInfo.jsx
|-- EnquiryCard.jsx
|-- ShareButton.jsx
|-- JourneyFrames.jsx
|-- SimilarTrips.jsx
`-- index.js
```

Optional improvement:

- Split `TripTabs.jsx` into smaller tab files when it becomes harder to maintain.

### Create trip-listing components

```text
components/trip-listing/
|-- TripListingCard.jsx
|-- TripListingGrid.jsx
|-- ListingHero.jsx
`-- index.js
```

Reason:

- India and International listing cards are similar but duplicated.

## Recommended Data Structure

### Current

```text
app/data/
|-- indiaTripDetails.js
|-- indiaTrips.js
|-- internationalTripDetails.js
|-- internationalTrips.js
|-- upcomingTrips.js
|-- mockData.js
`-- ...
```

### Recommended

```text
app/data/
|-- navigation.js
|-- reviews.js
|-- blogs.js
|-- curatedEscapes.js
|-- paymentData.js
`-- trips/
    |-- indiaTrips.js
    |-- internationalTrips.js
    |-- tripIndex.js
    `-- upcomingTrips.js
```

### `trips/indiaTrips.js`

Should export:

```javascript
export const indiaTripDetails = [...];
export const indiaTripList = indiaTripDetails.map(toListingTrip);
export const upcomingIndiaTrips = indiaTripDetails.filter(isUpcoming).map(toUpcomingTrip);
```

### `trips/internationalTrips.js`

Should export:

```javascript
export const internationalTripDetails = [...];
export const internationalTripList = internationalTripDetails.map(toListingTrip);
export const upcomingInternationalTrips = internationalTripDetails.filter(isUpcoming).map(toUpcomingTrip);
```

### `trips/tripIndex.js`

Should export:

```javascript
export const allTrips = [...indiaTripDetails, ...internationalTripDetails];
export const allUpcomingTrips = [...upcomingIndiaTrips, ...upcomingInternationalTrips];
export function getTripBySlug(slug) {}
export function getTripsByDestination(destination) {}
```

Reason:

- Upcoming Trips can use one combined source.
- Search can eventually use one combined index.
- Similar Trips can be calculated consistently.

## Recommended Public Asset Structure

Current:

```text
public/
|-- divas-sojourn-logo.png
|-- home-hero-video.mp4
|-- india-trip-pdfs/
`-- international-trip-pdfs/
```

Recommended:

```text
public/
|-- brand/
|   `-- divas-sojourn-logo.png
|-- videos/
|   `-- home-hero-video.mp4
`-- trip-pdfs/
    |-- india/
    `-- international/
```

This is optional. The current paths work and changing them requires updating `pdfPath` values.

## Recommended Route Additions

Build or remove these nav-only pages:

```text
app/luxury-experiences/page.js
app/about-us/page.js
app/faqs/page.js
app/personalize-trip/page.js
```

## Recommended Trip Page Structure

The route structure should stay as-is:

```text
app/india-trips/[trip-slug]/page.js
app/international-trips/[slug]/page.js
```

Reason:

- SEO-friendly.
- Clear destination grouping.
- Already implemented and generating static routes.

Do not create one generic `/trips/[slug]` route unless the business wants one universal trip URL.

## Recommended Utility Files

Create:

```text
app/utils/formatters.js
app/utils/tripHelpers.js
```

Possible helpers:

```javascript
formatCurrency(value)
formatDuration(nights, days)
isUpcomingTrip(trip, now = new Date())
toListingTrip(trip)
toUpcomingTrip(trip)
getSimilarTrips(trip, allTrips)
```

Benefits:

- Removes repeated `Intl.NumberFormat`.
- Avoids duplicated mapping logic.
- Makes date/status logic testable.

## Recommended Form Architecture

Current:

```text
EnquiryCard -> localStorage
ContactForm -> localStorage
```

Recommended:

```text
components/forms/
|-- LeadForm.jsx
|-- fields/
`-- validation.js

app/api/leads/route.js
```

Future flow:

```text
LeadForm
  -> validate
  -> POST /api/leads
  -> email/CRM/database
```

## Recommended Cleanup Order

1. Move navigation arrays from `mockData.js` to `navigation.js`.
2. Update imports in `Navbar.jsx` and `Footer.jsx`.
3. Update homepage India and Curated sections to real data files.
4. Rename `components/india-trip-detail` to `components/trip-detail`.
5. Combine upcoming India and International trips.
6. Add full International PDF detail extraction for all 13 trips.
7. Replace or hide fake review sections.
8. Add missing nav pages or remove nav links.
9. Delete unused components and unused data exports.

## Best Practice Notes

- Keep trip content data-driven; avoid JSX hardcoding for trip pages.
- Keep PDFs in `public` only for downloadable assets; source PDFs can stay outside `Frontend`.
- Keep metadata generated from the same trip objects used for UI.
- Avoid fake ratings/review counts unless verified.
- Prefer one trip data shape for India and International trips.
