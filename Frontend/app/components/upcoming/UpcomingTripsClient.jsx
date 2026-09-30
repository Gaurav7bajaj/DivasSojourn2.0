"use client";

import TripListingClient from "../shared/TripListingClient";

/** Upcoming Trips listing — shared TripListingClient with destination filters. */
export default function UpcomingTripsClient({ trips = [], months = [] }) {
  return (
    <TripListingClient trips={trips} months={months} primaryGroup="destination" />
  );
}
