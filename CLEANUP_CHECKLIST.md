# Cleanup Checklist

Use this checklist to remove fake data, reduce duplication, and prepare the project for ongoing trip page work.

## Data Cleanup

- [ ] Move `navLinks` and `tripMenus` from `app/data/mockData.js` to `app/data/navigation.js`.
- [ ] Update `Navbar.jsx` to import from `navigation.js`.
- [ ] Update `Footer.jsx` to import from `navigation.js`.
- [ ] Replace `ReviewsSection.jsx` fake review stats with verified real stats or remove the counts.
- [ ] Replace `travelerReviews.js` sample reviews with real reviews.
- [ ] Hide `TravelerReviews` sections when no real reviews exist.
- [ ] Update `IndiaTripsSection.jsx` to use `indiaTripsData` from `app/data/indiaTrips.js`.
- [ ] Update `CuratedEscapesSection.jsx` to use `app/data/curatedEscapes.js`.
- [ ] Delete `app/data/mockData.js` after all imports are removed.

## Trip Data Cleanup

- [ ] Keep `indiaTripDetails.js` as the source of truth for 6 India trips.
- [ ] Verify all India PDF-derived fields against the source PDFs.
- [ ] Complete exact day-by-day extraction for every International PDF.
- [ ] Replace generated International summary itinerary rows with exact PDF itinerary text.
- [ ] Replace generic International inclusions with PDF-specific inclusions.
- [ ] Replace generic International exclusions with PDF-specific exclusions where available.
- [ ] Confirm all International `pdfPath` values download correctly.
- [ ] Confirm all India `pdfPath` values download correctly.
- [ ] Confirm payment account details in trip PDFs versus `/payments` page.

## Upcoming Trips Cleanup

- [ ] Create combined upcoming data from India and International trip detail data.
- [ ] Include International trips in `upcomingTrips.js`.
- [ ] Restore `"International"` destination filter in `FilterSidebar.jsx`.
- [ ] Make budget range dynamic based on current trip data.
- [ ] Make duration range dynamic based on current trip data.
- [ ] Confirm every Upcoming Trip card links to the correct detail route.

## Component Cleanup

- [ ] Rename `app/components/india-trip-detail` to `app/components/trip-detail`.
- [ ] Update imports in India and International detail route pages.
- [ ] Split `TripTabs.jsx` into smaller tab components if it becomes hard to maintain.
- [ ] Rename `EnquiryCard` localStorage key from `divasIndiaTripLeads` to `divasTripLeads`.
- [ ] Delete `components/curated-escapes/ExperiencesSection.jsx` if permanently unused.
- [ ] Delete `components/payments/PaymentsHeader.jsx` if the removed header will not return.
- [ ] Add shared `formatCurrency` helper to remove repeated `Intl.NumberFormat`.
- [ ] Add shared trip mapping helpers for listing/upcoming card data.

## Route Cleanup

- [ ] Build `/luxury-experiences` page or remove nav link.
- [ ] Build `/about-us` page or remove nav link.
- [ ] Build `/faqs` page or remove nav link.
- [ ] Build `/personalize-trip` page or remove nav link.
- [ ] Replace placeholder blog detail pages with real article content.
- [ ] Replace placeholder curated escape category pages with real package details.
- [ ] Add a not-found experience if needed for invalid trip slugs.

## SEO Cleanup

- [ ] Verify all 6 India detail pages have unique titles and descriptions.
- [ ] Verify all 13 International detail pages have unique titles and descriptions.
- [ ] Add canonical URLs for any new nav pages.
- [ ] Remove fake review/rating schema unless real review data exists.
- [ ] Add FAQ schema only where real FAQs are present.
- [ ] Confirm Open Graph images resolve successfully.

## Image and Asset Cleanup

- [ ] Replace any broken Unsplash URLs reported by the dev server.
- [ ] Move brand assets into `public/brand/` if adopting the recommended structure.
- [ ] Move trip PDFs into `public/trip-pdfs/india` and `public/trip-pdfs/international` only if you are ready to update all `pdfPath` values.
- [ ] Add explicit image sizes or fixed parent heights where Next warns about `fill` images with zero height.
- [ ] Add `style={{ width: "auto" }}` or matching image dimensions for the logo warning if it persists.

## Form and Persistence Cleanup

- [ ] Replace localStorage lead capture with a real backend endpoint.
- [ ] Add `app/api/leads/route.js` or connect to an external CRM/form service.
- [ ] Add server-side validation for leads.
- [ ] Add spam protection if public forms go live.
- [ ] Add success/error states based on actual API response.

## Testing Checklist

- [ ] Run `npm run lint`.
- [ ] Stop the dev server before running `npm run build` on Windows/OneDrive to avoid `.next` file lock errors.
- [ ] Run `npm run build`.
- [ ] Test homepage at `/`.
- [ ] Test India listing at `/india-trips`.
- [ ] Test all 6 India detail pages.
- [ ] Test International listing at `/international-trips`.
- [ ] Test all 13 International detail pages.
- [ ] Test Upcoming Trips filters.
- [ ] Test blog listing and blog detail routes.
- [ ] Test curated escape listing and category routes.
- [ ] Test payments page.
- [ ] Test navbar desktop dropdowns.
- [ ] Test navbar mobile menu/dropdowns.
- [ ] Test itinerary download links.
- [ ] Test share button.
- [ ] Test enquiry form validation.
- [ ] Test responsive layouts on mobile, tablet, and desktop.

## Suggested Execution Order

1. Navigation cleanup.
2. Homepage fake data cleanup.
3. Upcoming Trips combined data.
4. International trip extraction completion.
5. Shared component rename/refactor.
6. Placeholder page completion.
7. Backend/form integration.
8. Final QA and SEO pass.
