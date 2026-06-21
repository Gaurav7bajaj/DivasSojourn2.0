# Divas Sojourn Project Structure

This document is the master index for the current codebase audit. The app is a Next.js App Router frontend in `Frontend/`, with source PDFs stored at the project root in `India Trips/` and `International trips/`.

## Current State Summary

- Frontend framework: Next.js App Router, React, Tailwind CSS.
- Main app folder: `Frontend/app`.
- Static assets: `Frontend/public`.
- Data strategy: local JavaScript data modules, not JSON files or a database.
- API endpoints: none found. There is no `app/api` folder.
- Trip detail routes: built for 6 India trips and 13 International trips.
- Remaining placeholders: blog detail body content, curated escape category detail bodies, generic trip review notices, and several nav-only pages.

## Documentation Files

- `FILE_STRUCTURE.md`: visual tree and folder purpose.
- `COMPONENT_DOCUMENTATION.md`: component and route purpose map.
- `DATA_FLOW.md`: how data moves through homepage, listings, details, forms, and filters.
- `FAKE_DATA_AUDIT.md`: remaining sample/fake/placeholder data.
- `FOLDER_RECOMMENDATIONS.md`: recommended structure for trip pages and future cleanup.
- `CLEANUP_CHECKLIST.md`: actionable cleanup tasks.
- `CURRENT_VS_NEEDED.md`: feature comparison, current status, and roadmap.

## High-Level Tree

```text
DivasSojourn2.0/
|-- Backend/
|   `-- Currently not used by the inspected frontend.
|-- Frontend/
|   |-- app/
|   |   |-- blogs/
|   |   |-- components/
|   |   |-- curated-escapes/
|   |   |-- data/
|   |   |-- india-trips/
|   |   |-- international-trips/
|   |   |-- payments/
|   |   |-- upcoming-trips/
|   |   |-- globals.css
|   |   |-- layout.js
|   |   `-- page.js
|   |-- public/
|   |   |-- divas-sojourn-logo.png
|   |   |-- home-hero-video.mp4
|   |   |-- india-trip-pdfs/
|   |   `-- international-trip-pdfs/
|   |-- package.json
|   |-- next.config.mjs
|   |-- postcss.config.mjs
|   `-- eslint.config.mjs
|-- India Trips/
|   `-- Source India trip PDFs.
`-- International trips/
    `-- Source International trip PDFs.
```

## Routes

```text
/                                      -> Homepage
/india-trips                           -> India trip listing
/india-trips/[trip-slug]               -> India trip detail page, 6 generated routes
/international-trips                   -> International trip listing
/international-trips/[slug]            -> International trip detail page, 13 generated routes
/upcoming-trips                        -> Upcoming trips with filters
/blogs                                 -> Blog listing
/blogs/[slug]                          -> Blog detail placeholder body, 12 generated routes
/curated-escapes                       -> Curated escape listing
/curated-escapes/[category-slug]       -> Curated escape placeholder detail, 5 generated routes
/payments                              -> Payment methods and policy
```

Nav links currently point to these missing pages:

```text
/luxury-experiences
/about-us
/faqs
/personalize-trip
```

## Data Sources

- `Frontend/app/data/indiaTripDetails.js`: real India trip data for 6 PDFs.
- `Frontend/app/data/internationalTripDetails.js`: International trip data for 13 PDFs. Some trips have summarized generated itineraries and should be upgraded to full PDF-extracted day-by-day detail.
- `Frontend/app/data/upcomingTrips.js`: derives upcoming trips from India trip data only.
- `Frontend/app/data/indiaTrips.js`: exports India listing data from `indiaTripDetails.js`.
- `Frontend/app/data/internationalTrips.js`: exports International listing/hero data from `internationalTripDetails.js`.
- `Frontend/app/data/blogs.js`: local blog listing data, mostly excerpts and metadata.
- `Frontend/app/data/curatedEscapes.js`: curated escape category data.
- `Frontend/app/data/paymentData.js`: payment methods and policy tables.
- `Frontend/app/data/mockData.js`: remaining mixed sample data and nav menu data.
- `Frontend/app/data/travelerReviews.js`: hardcoded traveler review samples.

## Main Technical Debt

- `mockData.js` mixes real navigation configuration with sample review/trip/card data.
- `upcomingTrips.js` currently includes India trips only; International PDF trips are not yet included in Upcoming Trips.
- `internationalTripDetails.js` contains full detail for Bali, Kenya and Seychelles, but several other International trips use generated summary itineraries from metadata.
- `blogs/[slug]/page.js` is a placeholder detail page and does not render full article body content.
- `curated-escapes/[category-slug]/page.js` is a placeholder detail page.
- `ExperiencesSection.jsx` exists but is no longer exported/rendered after the section was removed.
- Several navigation links point to unimplemented pages.

## Recommended Direction

Keep the current App Router structure, but move toward a domain-first data/component layout:

```text
Frontend/app/
|-- data/
|   |-- trips/
|   |   |-- indiaTrips.js
|   |   |-- internationalTrips.js
|   |   `-- tripIndex.js
|   |-- navigation.js
|   |-- reviews.js
|   `-- payments.js
|-- components/
|   |-- trip-detail/
|   |-- trip-listing/
|   |-- layout/
|   `-- forms/
```

The existing `india-trip-detail` components can become shared `trip-detail` components because they now support both India and International trip pages.
