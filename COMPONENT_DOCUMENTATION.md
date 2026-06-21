# Component Documentation

This file documents the important route files, shared components, feature components, and data modules in the current frontend.

## App Shell

### FILE: `Frontend/app/layout.js`

PURPOSE: Root app layout and global SEO metadata.

WHAT IT DOES:
- Imports global CSS.
- Renders `Navbar`, page content, `Footer`, and `WhatsAppButton`.
- Defines default metadata, Open Graph, Twitter, robots, and canonical settings.

CURRENTLY USING DATA:
- Hardcoded global metadata.

NEEDS UPDATING:
- Add `data-scroll-behavior="smooth"` to `<html>` if Next route transition warning is kept.

### FILE: `Frontend/app/page.js`

PURPOSE: Homepage route.

WHAT IT DOES:
- Composes homepage sections in order: hero, reviews, upcoming, India, International, curated escapes, why-us.

CURRENTLY USING DATA:
- Indirectly uses `mockData.js`, `internationalTrips.js`, and section component data imports.

NEEDS UPDATING:
- Replace homepage India and curated cards from `mockData.js` with real data modules.

## Global Components

### FILE: `Frontend/app/components/Navbar.jsx`

PURPOSE: Sticky site navigation with logo, search, contact button, dropdowns, and mobile menu.

WHAT IT DOES:
- Shows logo from `/divas-sojourn-logo.png`.
- Renders top nav links from `mockData.js`.
- Renders International dropdown from `internationalDestinations`.
- Renders India dropdown from `indiaTripsData`.
- Supports mobile collapsible International and India menus.

RECEIVES:
- No props.

CURRENTLY USING DATA:
- `navLinks`, `tripMenus` from `mockData.js`.
- `indiaTripsData` from `indiaTrips.js`.
- `internationalDestinations` from `internationalTrips.js`.

NEEDS UPDATING:
- Move navigation config out of `mockData.js` into `navigation.js`.
- Create pages for `/luxury-experiences`, `/about-us`, `/faqs`, and `/personalize-trip`, or remove those links.

### FILE: `Frontend/app/components/Footer.jsx`

PURPOSE: Footer with brand copy and navigation links.

WHAT IT DOES:
- Displays brand summary.
- Reuses nav/menu data for footer navigation.

CURRENTLY USING DATA:
- `navLinks`, `tripMenus` from `mockData.js`.

NEEDS UPDATING:
- Move nav data to a dedicated navigation data file.

### FILE: `Frontend/app/components/WhatsAppButton.jsx`

PURPOSE: Floating WhatsApp action button.

WHAT IT DOES:
- Provides persistent WhatsApp contact CTA.

CURRENTLY USING DATA:
- Hardcoded contact behavior/content.

## Homepage Components

### FILE: `Frontend/app/components/home/HeroSection.jsx`

PURPOSE: Homepage hero banner.

WHAT IT DOES:
- Renders full-width video background using `/home-hero-video.mp4`.
- Uses dark overlays and white text.
- CTA links to `/upcoming-trips`.

CURRENTLY USING DATA:
- Hardcoded hero copy and fallback image.

### FILE: `Frontend/app/components/home/ReviewsSection.jsx`

PURPOSE: Homepage review/stat strip.

WHAT IT DOES:
- Renders platform review cards.

CURRENTLY USING DATA:
- `reviews` from `mockData.js`.

NEEDS UPDATING:
- Replace with real review source or remove fake review counts.

### FILE: `Frontend/app/components/home/UpcomingTripsSection.jsx`

PURPOSE: Homepage section promoting upcoming trips.

WHAT IT DOES:
- Renders CTA/preview for upcoming trips.

CURRENTLY USING DATA:
- Component-local content and shared card/layout components.

### FILE: `Frontend/app/components/home/IndiaTripsSection.jsx`

PURPOSE: Homepage India trip preview cards.

WHAT IT DOES:
- Renders a `TripSection` for India trips.

CURRENTLY USING DATA:
- `indiaTrips` from `mockData.js`.

NEEDS UPDATING:
- Use `indiaTripsData` from `indiaTrips.js` so homepage matches real PDF-derived India data.

### FILE: `Frontend/app/components/home/InternationalTripsSection.jsx`

PURPOSE: Homepage International trip preview cards.

WHAT IT DOES:
- Renders a `TripSection` for the first four International destinations.

CURRENTLY USING DATA:
- `internationalDestinations` from `internationalTrips.js`, derived from real International trip data.

### FILE: `Frontend/app/components/home/CuratedEscapesSection.jsx`

PURPOSE: Homepage curated escape preview cards.

WHAT IT DOES:
- Renders curated escape teasers.

CURRENTLY USING DATA:
- `curatedEscapes` from `mockData.js`.

NEEDS UPDATING:
- Use `app/data/curatedEscapes.js` to avoid duplicate sample data.

### FILE: `Frontend/app/components/home/TripSection.jsx`

PURPOSE: Reusable homepage trip section layout.

RECEIVES:
- `id`, `title`, `subtitle`, `description`, `ctaHref`, `heroImage`, `heroAlt`, `trips`.

SENDS TO:
- CTA and cards link to `ctaHref`.

### FILE: `Frontend/app/components/home/TripCard.jsx`

PURPOSE: Small homepage trip card.

RECEIVES:
- `trip`: `{ id, name, image, price, description }`
- `href`: target route.

SENDS TO:
- Navigates to listing route via `href`.

NEEDS UPDATING:
- Allow per-card detail URLs if homepage cards should link directly to trip detail pages.

### FILE: `Frontend/app/components/home/WhyDivasSection.jsx`

PURPOSE: Reusable brand value section.

WHAT IT DOES:
- Displays reasons to travel with Divas Sojourn.

CURRENTLY USING DATA:
- Component-local hardcoded copy.

## India Listing Components

### FILE: `Frontend/app/india-trips/page.js`

PURPOSE: India trip listing route.

WHAT IT DOES:
- Defines SEO metadata and `ItemList` schema.
- Renders hero, India trip grid, conditional reviews/blogs, why-us, and contact form.

CURRENTLY USING DATA:
- `indiaTripsData`, `indiaReviews`, `indiaBlogs` from `indiaTrips.js`.

### FILE: `Frontend/app/components/india/IndiaHeroSection.jsx`

PURPOSE: India listing hero.

WHAT IT DOES:
- Displays India page headline, background, and CTA.

### FILE: `Frontend/app/components/india/IndiaTripsGrid.jsx`

PURPOSE: India listing grid.

RECEIVES:
- `trips`

### FILE: `Frontend/app/components/india/IndiaTripsCard.jsx`

PURPOSE: Individual India listing card.

RECEIVES:
- `trip` with `slug`, `image`, `title`, `dates`, `duration`, `price`.

SENDS TO:
- `/india-trips/[slug]`

CURRENTLY USING DATA:
- Real listing data derived from `indiaTripDetails.js`.

## International Listing Components

### FILE: `Frontend/app/international-trips/page.js`

PURPOSE: International trip listing route.

WHAT IT DOES:
- Defines SEO metadata and `ItemList` schema.
- Renders hero carousel, breadcrumbs, destination grid, reviews, blogs, why-us, and contact form.

CURRENTLY USING DATA:
- `internationalDestinations` from `internationalTrips.js`.
- `blogs` from `blogs.js`.

NEEDS UPDATING:
- Consider hiding `TravelerReviews` until real reviews exist.

### FILE: `Frontend/app/components/international/InternationalHeroCarousel.jsx`

PURPOSE: International listing hero carousel.

WHAT IT DOES:
- Rotates through `internationalHeroSlides`.
- Displays headline and CTA.

CURRENTLY USING DATA:
- `internationalHeroSlides` from `internationalTrips.js`.

### FILE: `Frontend/app/components/international/DestinationsGrid.jsx`

PURPOSE: International destination grid wrapper.

CURRENTLY USING DATA:
- `internationalDestinations`.

### FILE: `Frontend/app/components/international/DestinationCard.jsx`

PURPOSE: Individual International listing card.

RECEIVES:
- `destination`: `{ slug, image, name, subtitle, description, startingPrice, duration, badge }`

SENDS TO:
- `/international-trips/[slug]`

CURRENTLY USING DATA:
- Real listing data derived from `internationalTripDetails.js`.

### FILE: `Frontend/app/components/international/TravelerReviews.jsx`

PURPOSE: Review/testimonial section.

RECEIVES:
- Optional `reviews`; defaults to `travelerReviews`.

CURRENTLY USING DATA:
- Hardcoded review samples from `travelerReviews.js`.

NEEDS UPDATING:
- Replace with real reviews or conditionally hide.

### FILE: `Frontend/app/components/international/ContactForm.jsx`

PURPOSE: International enquiry/contact form.

WHAT IT DOES:
- Validates required fields.
- Stores submissions in `localStorage`.

CURRENTLY USING DATA:
- Component-local form options and browser local storage.

NEEDS UPDATING:
- Connect to backend/CRM/email endpoint when available.

## Trip Detail Components

### FILE: `Frontend/app/india-trips/[trip-slug]/page.js`

PURPOSE: Dynamic India trip detail route.

WHAT IT DOES:
- Uses `generateStaticParams` for 6 routes.
- Defines trip-specific metadata.
- Adds `BreadcrumbList` and `TouristTrip` JSON-LD.
- Renders `TripDetailPage`.

CURRENTLY USING DATA:
- `indiaTripDetails`.

### FILE: `Frontend/app/international-trips/[slug]/page.js`

PURPOSE: Dynamic International trip detail route.

WHAT IT DOES:
- Uses `generateStaticParams` for 13 routes.
- Defines trip-specific metadata.
- Adds `BreadcrumbList` and `TouristTrip` JSON-LD.
- Renders shared `TripDetailPage` with International base path/label.

CURRENTLY USING DATA:
- `combinedInternationalTripDetails`.

### FILE: `Frontend/app/components/india-trip-detail/TripDetailPage.jsx`

PURPOSE: Shared full trip detail layout.

RECEIVES:
- `trip`
- `similarTrips`
- `basePath`
- `baseLabel`

WHAT IT DOES:
- Renders hero, breadcrumbs, title, quick badges, tabs, enquiry card, reviews notice, journey frames, and similar trips.

NEEDS UPDATING:
- Rename folder to `trip-detail` because it is no longer India-only.
- Replace `ReviewsNotice` placeholder with real trip testimonials or hide if none exist.

### FILE: `Frontend/app/components/india-trip-detail/TripHero.jsx`

PURPOSE: Full-width detail hero.

RECEIVES:
- `trip`

WHAT IT DOES:
- Shows trip image.
- Provides itinerary PDF download via `trip.pdfPath`.
- Includes `ShareButton`.

### FILE: `Frontend/app/components/india-trip-detail/TripTabs.jsx`

PURPOSE: Tabbed trip detail content.

RECEIVES:
- `trip`

WHAT IT DOES:
- Tabs: Overview & Highlights, Itinerary, Inclusions, Exclusions, Gallery, Other Info.
- Renders accommodation table, pricing, financial details, notes, and cancellation policy links.

### FILE: `Frontend/app/components/india-trip-detail/EnquiryCard.jsx`

PURPOSE: Sticky trip enquiry form and price box.

RECEIVES:
- `trip`

WHAT IT DOES:
- Validates name, email, and 10-digit phone number.
- Stores submissions in `localStorage` key `divasIndiaTripLeads`.
- Links to `/payments?trip=[slug]`.

NEEDS UPDATING:
- Rename localStorage key to a generic `divasTripLeads`.
- Connect to a real backend endpoint.

### FILE: `Frontend/app/components/india-trip-detail/ShareButton.jsx`

PURPOSE: Share trip URL.

WHAT IT DOES:
- Uses Web Share API when available.
- Falls back to clipboard copy.

### FILE: `Frontend/app/components/india-trip-detail/JourneyFrames.jsx`

PURPOSE: Horizontal gallery carousel.

RECEIVES:
- `trip.galleryImages`

### FILE: `Frontend/app/components/india-trip-detail/SimilarTrips.jsx`

PURPOSE: Horizontal similar trips carousel.

RECEIVES:
- `trips`
- `basePath`

SENDS TO:
- `${basePath}/${trip.slug}`

## Upcoming Trips Components

### FILE: `Frontend/app/upcoming-trips/page.js`

PURPOSE: Upcoming trips route.

WHAT IT DOES:
- Defines SEO metadata and `ItemList` schema.
- Renders `UpcomingTripsHeader` and `UpcomingTripsClient`.

CURRENTLY USING DATA:
- `upcomingTripsData` from `upcomingTrips.js`.

### FILE: `Frontend/app/components/upcoming/UpcomingTripsClient.jsx`

PURPOSE: Client-side filtering state and layout.

WHAT IT DOES:
- Manages draft/applied filters for destination, duration, budget, and month.
- Filters `upcomingTripsData`.

### FILE: `Frontend/app/components/upcoming/FilterSidebar.jsx`

PURPOSE: Sidebar filters.

WHAT IT DOES:
- Renders independently scrollable filters.
- Currently only includes India as destination option.

NEEDS UPDATING:
- Include International when `upcomingTrips.js` includes International trips.

### FILE: `Frontend/app/components/upcoming/UpcomingTripCard.jsx`

PURPOSE: Upcoming trip card.

RECEIVES:
- Upcoming trip object.

SENDS TO:
- India or International detail URL depending on `trip.destination`.

## Blog Components

### FILE: `Frontend/app/blogs/page.js`

PURPOSE: Blog listing route.

CURRENTLY USING DATA:
- `blogs.js`.

### FILE: `Frontend/app/blogs/[slug]/page.js`

PURPOSE: Blog detail route.

STATUS:
- Placeholder. It renders hero, excerpt, and message that full article content will be added soon.

### Blog Component Folder

- `BlogPageHeader.jsx`: listing page header.
- `BlogsListingClient.jsx`: client filtering/search state.
- `BlogFilters.jsx`: filter controls.
- `FeaturedBlog.jsx`: featured blog block.
- `BlogGrid.jsx`: card grid.
- `BlogListingCard.jsx`: blog card.

## Curated Escapes Components

### FILE: `Frontend/app/curated-escapes/page.js`

PURPOSE: Curated escape listing route.

CURRENTLY USING DATA:
- `curatedEscapes.js`.

### FILE: `Frontend/app/curated-escapes/[category-slug]/page.js`

PURPOSE: Curated escape category route.

STATUS:
- Placeholder. Full itinerary/inclusion/package details are not implemented.

### Component Folder

- `CuratedEscapesHero.jsx`: hero with video/image.
- `CuratedEscapesGrid.jsx`: category grid.
- `CuratedEscapeCard.jsx`: category card.
- `ExperiencesSection.jsx`: unused leftover component.

## Payment Components

### FILE: `Frontend/app/payments/page.js`

PURPOSE: Payments route.

CURRENTLY USING DATA:
- `paymentData.js`.

### Component Folder

- `PaymentMethodsSection.jsx`: section wrapper.
- `PaymentMethods.jsx`: method cards.
- `PaymentNoteBox.jsx`: warning/notes.
- `PaymentPolicySection.jsx`: policy wrapper.
- `PaymentTable.jsx`: reusable table.
- `PaymentsHeader.jsx`: unused after header removal.

## Data Modules

### FILE: `Frontend/app/data/indiaTripDetails.js`

PURPOSE: Single source of truth for 6 India trips.

CONTAINS:
- Financial details.
- Cancellation links.
- Detailed trip objects.
- Derived `indiaTripsData`.
- Derived `upcomingIndiaTripsData`.

STATUS:
- Real PDF-derived data.

### FILE: `Frontend/app/data/internationalTripDetails.js`

PURPOSE: Single source of truth for 13 International trips.

CONTAINS:
- Financial details.
- Cancellation links.
- Trip objects.
- Derived `internationalDestinations`.
- Derived `internationalHeroSlides`.

STATUS:
- Real trip coverage exists.
- Full day-by-day extraction should be improved for trips currently using generated summary itinerary rows.

### FILE: `Frontend/app/data/mockData.js`

PURPOSE: Legacy mixed data file.

CONTAINS:
- Review stats.
- Sample India trips.
- Sample International trips.
- Sample curated escapes.
- Navigation links and trip menus.

STATUS:
- Needs splitting and cleanup.

### FILE: `Frontend/app/data/travelerReviews.js`

PURPOSE: Sample traveler reviews.

STATUS:
- Hardcoded sample data.

### FILE: `Frontend/app/data/blogs.js`

PURPOSE: Blog listing metadata and excerpts.

STATUS:
- Useful listing data, but detail body content is missing.

### FILE: `Frontend/app/data/curatedEscapes.js`

PURPOSE: Curated escape category data.

STATUS:
- Real category structure but not full package data.

### FILE: `Frontend/app/data/paymentData.js`

PURPOSE: Payment methods and policy data.

STATUS:
- Structured static business data.
