# File Structure Map

This file maps the current project structure and describes what each important folder/file does.

## Project Root

```text
DivasSojourn2.0/
|-- Backend/
|-- Frontend/
|-- India Trips/
|-- International trips/
|-- PROJECT_STRUCTURE.md
|-- FILE_STRUCTURE.md
|-- COMPONENT_DOCUMENTATION.md
|-- DATA_FLOW.md
|-- FAKE_DATA_AUDIT.md
|-- FOLDER_RECOMMENDATIONS.md
|-- CLEANUP_CHECKLIST.md
`-- CURRENT_VS_NEEDED.md
```

### Root Folders

- `Backend/`: present but not used by the inspected Next.js frontend. No frontend API calls were found.
- `Frontend/`: active Next.js application.
- `India Trips/`: source PDFs for 6 India trips.
- `International trips/`: source PDFs for 13 International trips.

## Frontend Tree

```text
Frontend/
|-- app/
|   |-- blogs/
|   |   |-- page.js
|   |   `-- [slug]/page.js
|   |-- components/
|   |   |-- blogs/
|   |   |-- curated-escapes/
|   |   |-- home/
|   |   |-- india/
|   |   |-- india-trip-detail/
|   |   |-- international/
|   |   |-- payments/
|   |   |-- upcoming/
|   |   |-- Footer.jsx
|   |   |-- Navbar.jsx
|   |   `-- WhatsAppButton.jsx
|   |-- curated-escapes/
|   |   |-- page.js
|   |   `-- [category-slug]/page.js
|   |-- data/
|   |-- india-trips/
|   |   |-- page.js
|   |   `-- [trip-slug]/page.js
|   |-- international-trips/
|   |   |-- page.js
|   |   `-- [slug]/page.js
|   |-- payments/
|   |   `-- page.js
|   |-- upcoming-trips/
|   |   `-- page.js
|   |-- globals.css
|   |-- layout.js
|   `-- page.js
|-- public/
|   |-- divas-sojourn-logo.png
|   |-- home-hero-video.mp4
|   |-- india-trip-pdfs/
|   `-- international-trip-pdfs/
|-- eslint.config.mjs
|-- next.config.mjs
|-- package.json
|-- package-lock.json
`-- postcss.config.mjs
```

## `Frontend/app`

- `layout.js`: root layout; adds global metadata, `Navbar`, `Footer`, and `WhatsAppButton`.
- `page.js`: homepage route `/`; composes home sections.
- `globals.css`: global Tailwind import and base styles.

## Route Files

```text
app/page.js
```

- Route: `/`
- Purpose: landing page.
- Uses: `HeroSection`, `ReviewsSection`, `UpcomingTripsSection`, `IndiaTripsSection`, `InternationalTripsSection`, `CuratedEscapesSection`, `WhyDivasSection`.

```text
app/india-trips/page.js
```

- Route: `/india-trips`
- Purpose: India listing page with SEO and `ItemList` schema.
- Uses data from `app/data/indiaTrips.js`.

```text
app/india-trips/[trip-slug]/page.js
```

- Route: `/india-trips/[trip-slug]`
- Purpose: dynamic India trip detail page.
- Generates 6 static pages from `indiaTripDetails`.
- Uses shared trip detail layout in `components/india-trip-detail/TripDetailPage.jsx`.

```text
app/international-trips/page.js
```

- Route: `/international-trips`
- Purpose: International listing page with hero carousel, destinations grid, reviews/blogs/why/contact sections.
- Uses `app/data/internationalTrips.js`.

```text
app/international-trips/[slug]/page.js
```

- Route: `/international-trips/[slug]`
- Purpose: dynamic International trip detail page.
- Generates 13 static pages from `combinedInternationalTripDetails`.
- Uses the same trip detail layout as India pages.

```text
app/upcoming-trips/page.js
```

- Route: `/upcoming-trips`
- Purpose: upcoming trip listing with filter UI and SEO schema.
- Uses `app/data/upcomingTrips.js`.

```text
app/blogs/page.js
```

- Route: `/blogs`
- Purpose: blog listing with featured article and filters.
- Uses `app/data/blogs.js`.

```text
app/blogs/[slug]/page.js
```

- Route: `/blogs/[slug]`
- Purpose: generated blog detail route.
- Status: placeholder body; only excerpt and metadata are rendered.

```text
app/curated-escapes/page.js
```

- Route: `/curated-escapes`
- Purpose: curated escape category listing.
- Uses `app/data/curatedEscapes.js`.

```text
app/curated-escapes/[category-slug]/page.js
```

- Route: `/curated-escapes/[category-slug]`
- Purpose: generated category detail route.
- Status: placeholder detail copy; full itineraries not implemented.

```text
app/payments/page.js
```

- Route: `/payments`
- Purpose: payment methods, notes, and policy tables.
- Uses `app/data/paymentData.js`.

## Component Folders

### `app/components/home`

- `HeroSection.jsx`: homepage video hero.
- `ReviewsSection.jsx`: review stats strip from `mockData.js`.
- `UpcomingTripsSection.jsx`: homepage upcoming CTA/section.
- `IndiaTripsSection.jsx`: homepage India trip cards, still imports `indiaTrips` from `mockData.js`.
- `InternationalTripsSection.jsx`: homepage International cards, now derived from real international listing data.
- `CuratedEscapesSection.jsx`: homepage curated escape cards, still imports curated sample data from `mockData.js`.
- `TripSection.jsx`: reusable homepage section layout.
- `TripCard.jsx`: small card used inside homepage trip sections.
- `WhyDivasSection.jsx`: reusable why-us section.
- `index.js`: exports home components.

### `app/components/india`

- `IndiaHeroSection.jsx`: India listing page hero.
- `IndiaTripsGrid.jsx`: grid wrapper for India trips.
- `IndiaTripsCard.jsx`: India listing card linking to detail pages.
- `index.js`: exports India listing components.

### `app/components/international`

- `InternationalHeroCarousel.jsx`: International listing hero carousel.
- `DestinationsGrid.jsx`: International destination card grid.
- `DestinationCard.jsx`: International listing card linking to detail pages.
- `TravelerReviews.jsx`: review section using hardcoded `travelerReviews` by default.
- `ReviewCard.jsx`: individual review card.
- `BlogsSection.jsx`: blog teaser section.
- `BlogCard.jsx`: individual blog teaser card.
- `ContactForm.jsx`: client-side enquiry/contact form storing submissions locally.
- `index.js`: exports International components.

### `app/components/india-trip-detail`

These are now shared by both India and International detail routes.

- `TripDetailPage.jsx`: main detail page layout with hero, breadcrumbs, quick info, tabs, enquiry card, review notice, gallery, and similar trips.
- `TripHero.jsx`: full-width hero image with itinerary download and share button.
- `TripTabs.jsx`: client-side tab UI for Overview, Itinerary, Inclusions, Exclusions, Gallery, Other Info.
- `EnquiryCard.jsx`: sticky callback form and price box.
- `ShareButton.jsx`: Web Share API button with clipboard fallback.
- `JourneyFrames.jsx`: horizontal image carousel.
- `SimilarTrips.jsx`: horizontal related-trip carousel.
- `index.js`: barrel exports.

### `app/components/upcoming`

- `UpcomingTripsHeader.jsx`: hero/header for upcoming trips.
- `UpcomingTripsClient.jsx`: client state, filters, and filtered results.
- `FilterSidebar.jsx`: destination/duration/budget/month filters.
- `MonthFilterButtons.jsx`: top month filter chips.
- `RangeSlider.jsx`: reusable range control.
- `UpcomingTripsGrid.jsx`: result grid wrapper.
- `UpcomingTripCard.jsx`: compact upcoming trip card.
- `index.js`: exports upcoming components.

### `app/components/blogs`

- `BlogPageHeader.jsx`: blogs page header.
- `BlogsListingClient.jsx`: client filtering for blogs.
- `BlogFilters.jsx`: search/category/destination filters.
- `FeaturedBlog.jsx`: highlighted featured blog section.
- `BlogGrid.jsx`: grid wrapper.
- `BlogListingCard.jsx`: blog card.
- `index.js`: exports blog components.

### `app/components/curated-escapes`

- `CuratedEscapesHero.jsx`: curated escapes hero with video/image background.
- `CuratedEscapesGrid.jsx`: category grid wrapper.
- `CuratedEscapeCard.jsx`: category card.
- `ExperiencesSection.jsx`: unused leftover component from a removed section.
- `index.js`: exports active curated escape components.

### `app/components/payments`

- `PaymentMethodsSection.jsx`: methods section wrapper.
- `PaymentMethods.jsx`: renders payment method cards.
- `PaymentNoteBox.jsx`: important payment notes.
- `PaymentPolicySection.jsx`: short-haul and long-haul policy section.
- `PaymentTable.jsx`: reusable policy table.
- `PaymentsHeader.jsx`: unused after header removal.
- `index.js`: exports payment components.

### Shared Layout Components

- `Navbar.jsx`: sticky navigation, logo, search input, nav links, trip dropdowns, mobile menu.
- `Footer.jsx`: footer navigation and brand copy.
- `WhatsAppButton.jsx`: floating WhatsApp contact button.

## Data Folder

```text
app/data/
|-- blogs.js
|-- curatedEscapes.js
|-- indiaTripDetails.js
|-- indiaTrips.js
|-- internationalTripDetails.js
|-- internationalTrips.js
|-- mockData.js
|-- paymentData.js
|-- travelerReviews.js
`-- upcomingTrips.js
```

- `indiaTripDetails.js`: primary real data for 6 India trip PDFs.
- `indiaTrips.js`: listing exports derived from India detail data; `indiaReviews` and `indiaBlogs` are empty.
- `internationalTripDetails.js`: primary International trip data for 13 PDFs.
- `internationalTrips.js`: listing/hero exports derived from International detail data.
- `upcomingTrips.js`: derives upcoming trip cards/months from India trips only.
- `blogs.js`: local blog card data.
- `curatedEscapes.js`: curated category data.
- `paymentData.js`: payment methods and policy tables.
- `travelerReviews.js`: hardcoded sample review cards.
- `mockData.js`: remaining sample data and nav menu config.

## Public Assets

```text
public/
|-- divas-sojourn-logo.png
|-- home-hero-video.mp4
|-- india-trip-pdfs/
|   `-- 6 itinerary PDFs with slug filenames
`-- international-trip-pdfs/
    `-- 13 itinerary PDFs with slug filenames
```

## Config Files

- `package.json`: scripts and dependencies.
- `next.config.mjs`: Next.js config including remote image domains.
- `eslint.config.mjs`: ESLint config.
- `postcss.config.mjs`: Tailwind/PostCSS config.
- `package-lock.json`: locked dependency versions.

## API Endpoints

No API endpoints were found. There is no `app/api` route folder and no backend integration in the inspected frontend.
