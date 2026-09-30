"use client";

import TripListingClient from "../shared/TripListingClient";

export default function InternationalTripsClient({ trips = [], months = [] }) {
  return (
    <TripListingClient
      trips={trips}
      months={months}
      primaryGroup="country"
      showMobileDestinationChips={false}
      getBadgeLabel={(trip) =>
        trip.country
          ? `International · ${trip.country}`
          : "International"
      }
    />
  );
}
