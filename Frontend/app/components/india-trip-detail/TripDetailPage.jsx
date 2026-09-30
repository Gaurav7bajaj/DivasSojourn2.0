"use client";

import { useMemo } from "react";
import ShortContactForm from "../international/ShortContactForm";
import { deriveCountryLabel } from "../../lib/data/tripCountry";
import { deriveRegionLabel } from "../../lib/data/tripRegion";
import TripBookingCard from "./TripBookingCard";
import {
  TripInclusionsSection,
  TripItinerarySection,
  TripOverviewSection,
  TripWhoGoingSection,
} from "./TripContentSections";
import TripDetailHero from "./TripDetailHero";
import TripMomentsGallery from "./TripMomentsGallery";
import TripStickyNav from "./TripStickyNav";
import SimilarTrips from "./SimilarTrips";
import { getDepartures, getTripGalleryPhotos } from "./tripDetailUtils";

export default function TripDetailPage({
  trip,
  similarTrips = [],
  basePath = "/india-trips",
  baseLabel = "India Trips",
}) {
  const enrichedTrip = useMemo(() => {
    const country =
      trip.destination === "International" ? deriveCountryLabel(trip) : undefined;
    const region = trip.destination === "India" ? deriveRegionLabel(trip) : undefined;
    return { ...trip, country, region };
  }, [trip]);

  const sections = useMemo(() => {
    const list = [{ id: "overview", label: "Overview" }];
    if (Array.isArray(enrichedTrip.itinerary) && enrichedTrip.itinerary.length) {
      list.push({ id: "itinerary", label: "Itinerary" });
    }
    if (
      (Array.isArray(enrichedTrip.inclusions) && enrichedTrip.inclusions.length) ||
      (Array.isArray(enrichedTrip.exclusions) && enrichedTrip.exclusions.length)
    ) {
      list.push({ id: "inclusions", label: "Inclusions" });
    }
    if (
      Array.isArray(enrichedTrip.womenJoiningFrom) &&
      enrichedTrip.womenJoiningFrom.some((w) => w?.name || w?.location)
    ) {
      list.push({ id: "who", label: "Who's going" });
    }
    if (getTripGalleryPhotos(enrichedTrip).length >= 3) {
      list.push({ id: "gallery", label: "Gallery" });
    }
    return list;
  }, [enrichedTrip]);

  const firstDeparture = getDepartures(enrichedTrip).find((d) => !d.soldOut);
  const bookHref = `/payments?trip=${encodeURIComponent(enrichedTrip.slug)}${
    firstDeparture?.startDate
      ? `&date=${encodeURIComponent(firstDeparture.startDate)}`
      : ""
  }`;

  // Enrich similar trips with country/region for cards
  const similar = useMemo(
    () =>
      similarTrips.map((item) => ({
        ...item,
        country:
          item.destination === "International" ? deriveCountryLabel(item) : item.country,
        region: item.destination === "India" ? deriveRegionLabel(item) : item.region,
      })),
    [similarTrips],
  );

  return (
    <main className="bg-[#0B0B0C] pb-24 text-[#FBF8F1] md:pb-0">
      <TripDetailHero trip={enrichedTrip} basePath={basePath} baseLabel={baseLabel} />
      <TripStickyNav sections={sections} trip={enrichedTrip} bookHref={bookHref} />

      <div className="px-5 pt-14 md:px-12 xl:px-24">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-[72px]">
            <TripOverviewSection trip={enrichedTrip} />
            <TripItinerarySection trip={enrichedTrip} />
            <TripInclusionsSection trip={enrichedTrip} />
            <TripWhoGoingSection trip={enrichedTrip} />
            <TripMomentsGallery trip={enrichedTrip} />
          </div>

          <TripBookingCard trip={enrichedTrip} />
        </div>
      </div>

      <div className="mt-16">
        <SimilarTrips
          trips={similar}
          basePath={basePath}
          currentTrip={enrichedTrip}
        />
      </div>

      <ShortContactForm
        pageLabel={enrichedTrip.shortName || enrichedTrip.title}
        storageKey="divasTripDetailLeads"
        eyebrow="Planning this trip?"
        titleLead="Reach out"
        titleEm="to us"
      />
    </main>
  );
}
