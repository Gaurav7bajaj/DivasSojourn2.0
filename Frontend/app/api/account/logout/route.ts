import { NextResponse } from "next/server";
import {
  ITINERARY_UNLOCK_COOKIE,
  itineraryUnlockCookieOptions,
} from "@/app/lib/itineraryUnlock";
import {
  TRAVELER_COOKIE_NAME,
  travelerCookieOptions,
} from "@/app/lib/travelerSession";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(TRAVELER_COOKIE_NAME, "", {
    ...travelerCookieOptions(0),
    maxAge: 0,
  });
  // Signing out also locks itineraries again.
  response.cookies.set(ITINERARY_UNLOCK_COOKIE, "", {
    ...itineraryUnlockCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
