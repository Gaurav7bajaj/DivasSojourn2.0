import { NextResponse } from "next/server";
import { getPublishedTrips, getTripNavItems, getUpcomingTrips } from "@/app/lib/data/trips";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");
    const destination = searchParams.get("destination");

    if (view === "nav") {
      const trips = await getTripNavItems(
        destination === "India" || destination === "International" ? destination : undefined,
      );
      return NextResponse.json({ trips });
    }

    if (view === "upcoming") {
      const trips = await getUpcomingTrips();
      const filtered =
        destination === "India" || destination === "International"
          ? trips.filter((trip) => trip.destination === destination)
          : trips;
      return NextResponse.json({ trips: filtered });
    }

    const trips = await getPublishedTrips();
    const filtered =
      destination === "India" || destination === "International"
        ? trips.filter((trip) => trip.destination === destination)
        : trips;
    return NextResponse.json({ trips: filtered });
  } catch {
    return NextResponse.json({ error: "Unable to load trips." }, { status: 500 });
  }
}
