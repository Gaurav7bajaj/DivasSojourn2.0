import { upcomingIndiaTripsData } from "./indiaTripDetails";

export const upcomingTripsData = upcomingIndiaTripsData;

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
