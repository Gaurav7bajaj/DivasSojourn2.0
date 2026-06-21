# Data Flow

This document describes how data currently moves through the app.

## Data Storage Strategy

The frontend currently uses local JavaScript modules as the data layer.

```text
Source PDFs
  -> manual extraction into app/data/*.js
  -> route/page components import data modules
  -> listing/detail components receive data as props or import directly
```

There is no active database, CMS, REST API, GraphQL API, or Next.js `app/api` endpoint in the inspected frontend.

## Homepage Flow

```text
app/page.js
  -> HeroSection
      -> hardcoded text, /home-hero-video.mp4
  -> ReviewsSection
      -> app/data/mockData.js -> reviews
  -> UpcomingTripsSection
      -> component-local section content
  -> IndiaTripsSection
      -> app/data/mockData.js -> indiaTrips
  -> InternationalTripsSection
      -> app/data/internationalTrips.js -> internationalDestinations
      -> app/data/internationalTripDetails.js -> combinedInternationalTripDetails
  -> CuratedEscapesSection
      -> app/data/mockData.js -> curatedEscapes
  -> WhyDivasSection
      -> component-local copy
```

Notes:

- International homepage cards now come from real International trip data.
- India and Curated homepage cards still come from `mockData.js`.
- Review stats are hardcoded in `mockData.js`.

## India Trips Listing Flow

```text
app/india-trips/page.js
  -> app/data/indiaTrips.js
      -> re-exports indiaTripsData from app/data/indiaTripDetails.js
      -> exports empty indiaReviews and indiaBlogs arrays
  -> IndiaHeroSection
  -> IndiaTripsGrid
      -> IndiaTripsCard
          -> Link: /india-trips/[trip.slug]
```

Source:

```text
India Trips/*.pdf
  -> app/data/indiaTripDetails.js
  -> app/data/indiaTrips.js
  -> listing UI
```

## India Trip Detail Flow

```text
app/india-trips/[trip-slug]/page.js
  -> generateStaticParams()
      -> indiaTripDetails.map(trip.slug)
  -> generateMetadata()
      -> selected trip metadata
  -> JSON-LD schema
  -> TripDetailPage
      -> TripHero
          -> trip.image
          -> trip.pdfPath
      -> TripTabs
          -> trip.route
          -> trip.overview
          -> trip.highlights
          -> trip.itinerary
          -> trip.inclusions
          -> trip.exclusions
          -> trip.galleryImages
          -> trip.accommodations
          -> trip.financialDetails
          -> trip.notes
      -> EnquiryCard
          -> localStorage
          -> /payments?trip=[slug]
      -> JourneyFrames
      -> SimilarTrips
```

Current India generated pages:

```text
/india-trips/wonders-of-ladakh
/india-trips/jyotirlingas-ellora-divine-historic-odyssey
/india-trips/tawang-dirang-beyond
/india-trips/north-east-cherry-blossom-trails
/india-trips/coorg-ooty-coonoor-mysore
/india-trips/north-east-trip
```

## International Trips Listing Flow

```text
app/international-trips/page.js
  -> app/data/internationalTrips.js
      -> re-exports internationalDestinations and internationalHeroSlides
  -> InternationalHeroCarousel
      -> internationalHeroSlides
  -> DestinationsGrid
      -> DestinationCard
          -> Link: /international-trips/[destination.slug]
  -> TravelerReviews
      -> travelerReviews.js by default
  -> BlogsSection
      -> blogs.js
  -> WhyDivasSection
  -> ContactForm
      -> localStorage
```

Source:

```text
International trips/*.pdf
  -> app/data/internationalTripDetails.js
  -> app/data/internationalTrips.js
  -> listing UI
```

## International Trip Detail Flow

```text
app/international-trips/[slug]/page.js
  -> generateStaticParams()
      -> combinedInternationalTripDetails.map(trip.slug)
  -> generateMetadata()
      -> selected trip metadata
  -> JSON-LD schema
  -> shared TripDetailPage
      -> same component chain as India details
      -> basePath="/international-trips"
      -> baseLabel="International Trips"
```

Current International generated pages:

```text
/international-trips/bali
/international-trips/kenya
/international-trips/seychelles-island-discovery
/international-trips/georgia-armenia
/international-trips/south-africa
/international-trips/turkey
/international-trips/greece
/international-trips/russia
/international-trips/south-korea
/international-trips/balkan-cruise
/international-trips/essence-of-laos
/international-trips/mauritius-island
/international-trips/yoga-by-the-backwaters
```

## Upcoming Trips Flow

```text
app/upcoming-trips/page.js
  -> app/data/upcomingTrips.js
      -> upcomingIndiaTripsData from indiaTripDetails.js
      -> upcomingMonths derived from upcomingTripsData
  -> UpcomingTripsHeader
  -> UpcomingTripsClient
      -> draftFilters state
      -> appliedFilters state
      -> filteredTrips useMemo()
      -> MonthFilterButtons
      -> FilterSidebar
      -> UpcomingTripsGrid
          -> UpcomingTripCard
              -> Link based on destination
```

Important:

- `upcomingTrips.js` currently imports India trips only.
- International trips are not included in Upcoming Trips yet.
- `FilterSidebar.jsx` currently offers only `"India"` as a destination option.

## Blog Flow

```text
app/blogs/page.js
  -> app/data/blogs.js
  -> BlogPageHeader
  -> FeaturedBlog
  -> BlogsListingClient
      -> BlogFilters
      -> BlogGrid
          -> BlogListingCard
              -> /blogs/[slug]
```

Blog detail:

```text
app/blogs/[slug]/page.js
  -> generateStaticParams() from blogs.js
  -> generateMetadata() from blogs.js
  -> renders hero + excerpt + placeholder message
```

The blog detail route is structurally ready but does not render full article content.

## Curated Escapes Flow

```text
app/curated-escapes/page.js
  -> app/data/curatedEscapes.js
  -> CuratedEscapesHero
  -> CuratedEscapesGrid
      -> CuratedEscapeCard
          -> /curated-escapes/[category-slug]
```

Category detail:

```text
app/curated-escapes/[category-slug]/page.js
  -> curatedEscapes.js
  -> generated static category pages
  -> renders category hero/detail card + placeholder note
```

## Payments Flow

```text
app/payments/page.js
  -> app/data/paymentData.js
  -> PaymentMethodsSection
      -> PaymentMethods
      -> PaymentNoteBox
  -> PaymentPolicySection
      -> PaymentTable
```

Trip enquiry cards link to:

```text
/payments?trip=[trip.slug]
```

The payment page does not currently read the `trip` query parameter.

## Form Submission Flow

### Trip Detail Enquiry Form

```text
EnquiryCard
  -> validates name, email, 10-digit phone
  -> localStorage.getItem("divasIndiaTripLeads")
  -> localStorage.setItem("divasIndiaTripLeads", updated leads)
```

Issue:

- The localStorage key is India-specific even though the component is used for International trips too.

### International Contact Form

```text
ContactForm
  -> validates client-side fields
  -> localStorage
  -> success message
```

Issue:

- There is no backend or CRM integration.

## Navigation Flow

```text
Navbar
  -> mockData.js -> navLinks
  -> mockData.js -> tripMenus
  -> indiaTrips.js -> India dropdown
  -> internationalTrips.js -> International dropdown
```

Missing destination pages:

```text
/luxury-experiences
/about-us
/faqs
/personalize-trip
```

## API Flow

No API flow currently exists.

```text
Frontend UI
  -> local JS modules
  -> localStorage for form submissions
  -> no backend persistence
```

Recommended future API flow:

```text
Forms
  -> POST /api/leads
  -> database / CRM / email notification

Trip data
  -> local JS modules now
  -> CMS/database later if non-developers need editing access
```
