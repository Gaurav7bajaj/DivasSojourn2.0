import { upcomingIndiaTripsData } from "./indiaTripDetails";
import { combinedInternationalTripDetails } from "./internationalTripDetails";

export const upcomingInternationalTripsData = combinedInternationalTripDetails
  .filter((trip) => trip.status === "upcoming")
  .map((trip) => ({
    id: trip.id + 100, // Offset to prevent ID collisions
    title: trip.title,
    slug: trip.slug,
    image: trip.image,
    destination: "International",
    duration: { nights: trip.nights, days: trip.days },
    departure: `${trip.pickupLocation} / ${trip.dropLocation}`,
    startDate: trip.startDate,
    endDate: trip.endDate,
    batches: 1,
    originalPrice: trip.originalPrice || (trip.earlyBirdPrice ? trip.price : null),
    currentPrice: trip.earlyBirdPrice || trip.price,
    description: trip.overview,
  }));

export const upcomingTripsData = [...upcomingIndiaTripsData, ...upcomingInternationalTripsData];


export const upcomingMonths = Array.from(
  new Map(
    upcomingTripsData.map((trip) => {
      const value = trip.startDate.slice(0, 7);
      const date = new Date(`${value}-01T00:00:00`);
      const label = date.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      });

      return [value, { label: label.replace(" ", "-"), value }];
    }),
  ).values(),
);
