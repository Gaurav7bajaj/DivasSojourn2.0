import { NextResponse } from "next/server";
import { InstallmentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/data/prisma";
import {
  formatAmount,
  sanitizeName,
  sanitizePhone,
  sanitizeProductInfo,
} from "@/app/lib/easebuzz";
import {
  FULL_PAYMENT_WITHIN_DAYS,
  buildInstallmentPlan,
  daysUntilDeparture,
  roundMoney,
} from "@/app/lib/paymentSchedule";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { getTravelerSession } from "@/app/lib/travelerSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Create a booking from trip slug + traveller (passenger) details.
 * Signed-in account owns the booking (travelerId); passenger phone may differ
 * (e.g. booking for a sister). Amount/installments follow the payment schedule.
 */
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await checkRateLimit(`pay-booking:${ip}`, 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const session = await getTravelerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to book a trip.", code: "LOGIN_REQUIRED" },
        { status: 401 },
      );
    }

    const account = await prisma.traveler.findUnique({
      where: { id: session.travelerId },
    });
    if (!account) {
      return NextResponse.json(
        { error: "Please sign in to book a trip.", code: "LOGIN_REQUIRED" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const tripSlug = String(body.tripSlug || "").trim();
    const firstname = sanitizeName(
      String(body.firstname || body.fullName || account.fullName || ""),
    );
    const email = String(body.email || account.email || "")
      .trim()
      .toLowerCase();
    // Passenger phone — may differ from the signed-in account phone.
    const phone = sanitizePhone(String(body.phone || account.phone || ""));

    if (!tripSlug || !firstname || !email || phone.length !== 10) {
      return NextResponse.json(
        {
          error:
            "Trip, traveler full name, email, and a 10-digit phone are required.",
        },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({ where: { slug: tripSlug } });
    if (!trip || !trip.published) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }
    if (trip.soldOut) {
      return NextResponse.json(
        { error: "This trip is sold out. No seats left." },
        { status: 400 },
      );
    }

    const amountInr = trip.earlyBirdPrice ?? trip.price;
    if (!amountInr || amountInr <= 0) {
      return NextResponse.json({ error: "Trip has no payable amount." }, { status: 400 });
    }

    const daysLeft = daysUntilDeparture(trip.startDate);
    if (daysLeft < 0) {
      return NextResponse.json(
        { error: "This departure date has already passed." },
        { status: 400 },
      );
    }

    const total = roundMoney(Number(amountInr));
    const productinfo = sanitizeProductInfo(
      `${trip.shortName || trip.title} booking`,
    );

    const plan = buildInstallmentPlan({
      destination: trip.destination,
      totalAmount: total,
      startDateIso: trip.startDate,
    });

    const nextDue = plan.find((row) => row.dueNow) || plan[0];
    const payNowAmount = nextDue ? formatAmount(nextDue.amountDue) : formatAmount(total);
    const requiresFullPayment = daysLeft < FULL_PAYMENT_WITHIN_DAYS;

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          travelerId: account.id,
          tripId: trip.id,
          tripSlug: trip.slug,
          tripTitle: trip.title,
          firstname,
          email,
          phone,
          productinfo,
          amount: new Prisma.Decimal(formatAmount(total)),
          amountPaid: new Prisma.Decimal(0),
        },
      });

      await tx.bookingInstallment.createMany({
        data: plan.map((row) => ({
          bookingId: created.id,
          stage: row.stage,
          label: row.label,
          sortOrder: row.sortOrder,
          dueDate: row.dueDate,
          amountDue: new Prisma.Decimal(formatAmount(row.amountDue)),
          status: row.dueNow ? InstallmentStatus.DUE : InstallmentStatus.UPCOMING,
        })),
      });

      return created;
    });

    const installments = await prisma.bookingInstallment.findMany({
      where: { bookingId: booking.id },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      bookingId: booking.id,
      amount: formatAmount(total),
      payNowAmount,
      requiresFullPayment,
      daysUntilDeparture: daysLeft,
      productinfo: booking.productinfo,
      tripTitle: booking.tripTitle,
      installments: installments.map((row) => ({
        id: row.id,
        stage: row.stage,
        label: row.label,
        amountDue: formatAmount(Number(row.amountDue)),
        dueDate: row.dueDate?.toISOString() ?? null,
        status: row.status,
      })),
    });
  } catch (error) {
    console.error("POST /api/payments/bookings failed", error);
    return NextResponse.json({ error: "Unable to create booking." }, { status: 500 });
  }
}
