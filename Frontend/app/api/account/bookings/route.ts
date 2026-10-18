import { NextResponse } from "next/server";
import { getAccountBookingsForTraveler } from "@/app/lib/accountBookings";
import { prisma } from "@/app/lib/data/prisma";
import { getTravelerSession } from "@/app/lib/travelerSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getTravelerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.traveler.findUnique({
      where: { id: session.travelerId },
    });
    if (!account) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await getAccountBookingsForTraveler(account);
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET /api/account/bookings failed", error);
    return NextResponse.json(
      { error: "Unable to load bookings." },
      { status: 500 },
    );
  }
}
