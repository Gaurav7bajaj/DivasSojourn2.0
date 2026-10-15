import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/data/prisma";
import {
  formatAmount,
  sanitizeName,
  sanitizePhone,
  sanitizeProductInfo,
} from "@/app/lib/easebuzz";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Create a booking from trip slug + traveller details.
 * Amount always comes from the Trip row (earlyBirdPrice ?? price), never the client.
 */
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await checkRateLimit(`pay-booking:${ip}`, 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const tripSlug = String(body.tripSlug || "").trim();
    const firstname = sanitizeName(String(body.firstname || ""));
    const email = String(body.email || "").trim().toLowerCase();
    const phone = sanitizePhone(String(body.phone || ""));

    if (!tripSlug || !firstname || !email || phone.length !== 10) {
      return NextResponse.json(
        { error: "tripSlug, firstname, email, and a 10-digit phone are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({ where: { slug: tripSlug } });
    if (!trip || !trip.published) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }

    const amountInr = trip.earlyBirdPrice ?? trip.price;
    if (!amountInr || amountInr <= 0) {
      return NextResponse.json({ error: "Trip has no payable amount." }, { status: 400 });
    }

    const amount = formatAmount(amountInr);
    const productinfo = sanitizeProductInfo(
      `${trip.shortName || trip.title} booking`,
    );

    const booking = await prisma.booking.create({
      data: {
        tripId: trip.id,
        tripSlug: trip.slug,
        tripTitle: trip.title,
        firstname,
        email,
        phone,
        productinfo,
        amount: new Prisma.Decimal(amount),
      },
    });

    return NextResponse.json({
      bookingId: booking.id,
      amount,
      productinfo: booking.productinfo,
      tripTitle: booking.tripTitle,
    });
  } catch (error) {
    console.error("POST /api/payments/bookings failed", error);
    return NextResponse.json({ error: "Unable to create booking." }, { status: 500 });
  }
}
