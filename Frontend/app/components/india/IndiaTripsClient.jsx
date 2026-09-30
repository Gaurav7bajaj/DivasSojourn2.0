"use client";

import TripListingClient from "../shared/TripListingClient";

export default function IndiaTripsClient({ trips = [], months = [] }) {
  return (
    <TripListingClient
      trips={trips}
      months={months}
      primaryGroup="region"
      showMobileDestinationChips={false}
      sectionId=""
      getBadgeLabel={(trip) =>
        trip.region ? `India · ${trip.region}` : "India"
      }
    />
  );
}
