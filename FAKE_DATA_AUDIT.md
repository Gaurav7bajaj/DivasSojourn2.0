# Fake Data Audit

This document lists current mock, fake, placeholder, duplicated, or temporary data locations.

## Summary

Trip detail pages are now present for:

- 6 India trips.
- 13 International trips.

However, there are still fake/sample/placeholder data areas outside the core trip detail routes.

## Fake Data Locations

### Location: `Frontend/app/data/mockData.js`

CONTENT:

- `reviews`: Google, TripAdvisor, and Facebook review stats.
- `indiaTrips`: 4 sample homepage India cards.
- `internationalTrips`: 4 sample homepage International cards.
- `curatedEscapes`: 3 sample homepage curated cards.
- `navLinks`: navigation links.
- `tripMenus`: trip dropdown/menu labels.

STATUS:

- Mixed file: some data is navigation config, but the review/trip/curated cards are sample data.
- India homepage cards are still using `indiaTrips`.
- Curated homepage cards are still using `curatedEscapes`.
- Navbar and Footer still use `navLinks` and `tripMenus`.

RECOMMENDED ACTION:

- Create `Frontend/app/data/navigation.js` for `navLinks` and `tripMenus`.
- Update `IndiaTripsSection.jsx` to use `indiaTripsData`.
- Update `CuratedEscapesSection.jsx` to use `app/data/curatedEscapes.js`.
- Replace review stats with real platform data or relabel as brand highlights.
- Delete or deprecate `mockData.js` after all imports are moved.

## Sample Homepage Trip Data

### Location: `Frontend/app/components/home/IndiaTripsSection.jsx`

CONTENT:

- Imports `indiaTrips` from `mockData.js`.

STATUS:

- Needs replacement.

RECOMMENDED ACTION:

- Import `indiaTripsData` from `app/data/indiaTrips.js`.
- Map fields to `TripCard` shape or update `TripCard` to accept detail page URLs.

### Location: `Frontend/app/components/home/CuratedEscapesSection.jsx`

CONTENT:

- Imports `curatedEscapes` from `mockData.js`.

STATUS:

- Duplicates better category data in `app/data/curatedEscapes.js`.

RECOMMENDED ACTION:

- Import from `app/data/curatedEscapes.js`.
- Map `priceLabel` to the card display format.

### Location: `Frontend/app/components/home/InternationalTripsSection.jsx`

CONTENT:

- Previously used mock data; currently uses `internationalDestinations`.

STATUS:

- Updated to real International data source.

RECOMMENDED ACTION:

- Optional: link cards directly to detail pages rather than only `/international-trips`.

## Fake Review Data

### Location: `Frontend/app/data/travelerReviews.js`

CONTENT:

- 3 hardcoded traveler review examples.

STATUS:

- Sample review data.

USED BY:

- `TravelerReviews.jsx`, which is rendered on `/international-trips`.

RECOMMENDED ACTION:

- Replace with real customer reviews.
- Or hide the section when real reviews are unavailable.

### Location: `Frontend/app/components/home/ReviewsSection.jsx`

CONTENT:

- Uses `reviews` from `mockData.js` with high platform counts.

STATUS:

- Should be verified against real platform data.

RECOMMENDED ACTION:

- Replace with verified review stats.
- Add source/date comments if static.

### Location: `Frontend/app/components/india-trip-detail/TripDetailPage.jsx`

CONTENT:

- `ReviewsNotice` renders generic placeholder cards:
  - Trip-specific reviews will be added after departure.
  - Every itinerary is led and coordinated by the Divas Sojourn team.
  - Real traveler experiences will appear here once available.

STATUS:

- Intentional placeholder.

RECOMMENDED ACTION:

- Hide reviews section until actual reviews exist.
- Or support optional `trip.reviews` and render only when non-empty.

## Blog Placeholder Data

### Location: `Frontend/app/data/blogs.js`

CONTENT:

- Blog metadata and excerpts.
- No full article body content.

STATUS:

- Useful listing data, but not enough for real blog detail pages.

RECOMMENDED ACTION:

- Add `content` arrays/MDX files for each blog.
- Or move blogs to CMS/MDX.

### Location: `Frontend/app/blogs/[slug]/page.js`

CONTENT:

- Renders excerpt and placeholder text:
  - "Full article content will be added soon..."

STATUS:

- Placeholder route.

RECOMMENDED ACTION:

- Render real article body.
- Add related posts and author bio if desired.

## Curated Escape Placeholder Data

### Location: `Frontend/app/data/curatedEscapes.js`

CONTENT:

- 5 category objects with image, duration and price label.
- `curatedExperiencesIntro` still exists even though the Experiences section was removed.

STATUS:

- Category-level data is useful.
- `curatedExperiencesIntro` appears unused.
- Category details are not full package data.

RECOMMENDED ACTION:

- Remove unused `curatedExperiencesIntro` if not needed.
- Add full package/itinerary details for each category if those pages are meant to be real.

### Location: `Frontend/app/curated-escapes/[category-slug]/page.js`

CONTENT:

- Placeholder message:
  - "Full itinerary, inclusions, and featured packages for this escape type will be added soon."

STATUS:

- Placeholder route.

RECOMMENDED ACTION:

- Build real category detail content or hide category links until ready.

### Location: `Frontend/app/components/curated-escapes/ExperiencesSection.jsx`

CONTENT:

- Leftover component for removed "Experiences For Every Travel Style" section.

STATUS:

- Unused file.

RECOMMENDED ACTION:

- Delete if the section is permanently removed.

## International Trip Data Gaps

### Location: `Frontend/app/data/internationalTripDetails.js`

CONTENT:

- Full detailed itinerary data for Bali, Kenya, and Seychelles.
- Additional 10 trips represented with real core metadata, highlights, price, hotels, PDFs, and generated summary itinerary rows.

STATUS:

- Better than mock data, but not fully extracted for every International PDF.

RECOMMENDED ACTION:

- Replace generated summary itinerary rows with exact PDF day-by-day content for:
  - Georgia & Armenia
  - South Africa
  - Turkey
  - Greece
  - Russia
  - South Korea
  - Balkan Cruise
  - Laos
  - Mauritius
  - Yoga by the Backwaters
- Replace generic `standardInclusions` with exact inclusions from each PDF.
- Replace generic exclusions where PDFs have more specific exclusion lists.

## Upcoming Trips Gaps

### Location: `Frontend/app/data/upcomingTrips.js`

CONTENT:

- Imports `upcomingIndiaTripsData` only.

STATUS:

- Real India data only.
- International trip departures are not included.

RECOMMENDED ACTION:

- Derive a combined upcoming list from both `indiaTripDetails` and `combinedInternationalTripDetails`.
- Restore International destination filter in `FilterSidebar.jsx` when data is included.

### Location: `Frontend/app/components/upcoming/FilterSidebar.jsx`

CONTENT:

- Destination filter only includes `"India"`.

STATUS:

- Correct for current `upcomingTrips.js`, but incomplete for all upcoming trips.

RECOMMENDED ACTION:

- Include `"International"` when Upcoming Trips uses both sources.

## Navigation Links Without Pages

### Location: `Frontend/app/data/mockData.js`

CONTENT:

```text
/luxury-experiences
/about-us
/faqs
/personalize-trip
```

STATUS:

- These routes do not exist in `app/`.

RECOMMENDED ACTION:

- Build these pages or remove links until pages exist.

## Payment Data Verification

### Location: `Frontend/app/data/paymentData.js`

CONTENT:

- Payment methods and policy tables.

STATUS:

- Structured static data.
- Should be verified as production-accurate because account details differ from trip PDF financial details.

RECOMMENDED ACTION:

- Confirm final official payment account details.
- Decide whether trip detail financial info should point to the same account as `/payments`.

## Local Storage Placeholder Persistence

### Location: `Frontend/app/components/india-trip-detail/EnquiryCard.jsx`

CONTENT:

- Stores leads in localStorage key `divasIndiaTripLeads`.

STATUS:

- Browser-only placeholder persistence.

RECOMMENDED ACTION:

- Rename key to `divasTripLeads` if kept temporarily.
- Replace with backend/CRM integration.

### Location: `Frontend/app/components/international/ContactForm.jsx`

CONTENT:

- Stores form submissions in localStorage.

STATUS:

- Placeholder persistence.

RECOMMENDED ACTION:

- Replace with backend/CRM/email endpoint.

## Fake Data Cleanup Priority

1. Move navigation data out of `mockData.js`.
2. Replace homepage India and curated cards with real data files.
3. Include International trips in Upcoming Trips.
4. Replace hardcoded reviews with real review data or hide review sections.
5. Complete exact International PDF extraction for all 13 trips.
6. Add real blog detail content.
7. Add real curated escape detail content.
8. Remove unused components and unused data exports.
