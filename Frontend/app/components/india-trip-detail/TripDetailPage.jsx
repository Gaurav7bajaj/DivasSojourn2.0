"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ShortContactForm from "../international/ShortContactForm";
import { deriveCountryLabel } from "../../lib/data/tripCountry";
import { deriveRegionLabel } from "../../lib/data/tripRegion";
import ItineraryUnlockModal from "./ItineraryUnlockModal";
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
  itineraryUnlocked = false,
  hasItinerary = false,
}) {
  const router = useRouter();
  const [unlockOpen, setUnlockOpen] = useState(false);

  const enrichedTrip = useMemo(() => {
    const country =
      trip.destination === "International" ? deriveCountryLabel(trip) : undefined;
    const region = trip.destination === "India" ? deriveRegionLabel(trip) : undefined;
    return { ...trip, country, region };
  }, [trip]);

  const locked = hasItinerary && !itineraryUnlocked;

  const sections = useMemo(() => {
    const list = [{ id: "overview", label: "Overview" }];
    if (hasItinerary || (Array.isArray(enrichedTrip.itinerary) && enrichedTrip.itinerary.length)) {
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
  }, [enrichedTrip, hasItinerary]);

  const firstDeparture = getDepartures(enrichedTrip).find((d) => !d.soldOut);
  const bookHref = `/payments?trip=${encodeURIComponent(enrichedTrip.slug)}${
    firstDeparture?.startDate
      ? `&date=${encodeURIComponent(firstDeparture.startDate)}`
      : ""
  }`;

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

  const openUnlock = () => setUnlockOpen(true);

  const handleSectionClick = (id) => {
    if (id === "itinerary" && locked) {
      openUnlock();
    }
  };

  const handleUnlocked = () => {
    setUnlockOpen(false);
    router.refresh();
  };

  return (
    <main className="bg-[#0B0B0C] pb-24 text-[#FBF8F1] md:pb-0">
      <TripDetailHero trip={enrichedTrip} basePath={basePath} baseLabel={baseLabel} />
      <TripStickyNav
        sections={sections}
        trip={enrichedTrip}
        bookHref={bookHref}
        onSectionClick={handleSectionClick}
      />

      <div className="px-5 pt-14 md:px-12 xl:px-24">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-[72px]">
            <TripOverviewSection trip={enrichedTrip} />
            <TripItinerarySection
              trip={enrichedTrip}
              locked={locked}
              onRequestUnlock={openUnlock}
            />
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

      <ItineraryUnlockModal
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
        onUnlocked={handleUnlocked}
        tripName={enrichedTrip.shortName || enrichedTrip.title}
      />
    </main>
  );
}
