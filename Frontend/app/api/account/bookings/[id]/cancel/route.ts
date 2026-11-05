import { NextResponse } from "next/server";
import { InstallmentStatus } from "@prisma/client";
import { prisma } from "@/app/lib/data/prisma";
import { getTravelerSession } from "@/app/lib/travelerSession";
import { sendEnquiryNotificationEmail } from "@/app/lib/sendEnquiryEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getTravelerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing booking id." }, { status: 400 });
    }

    let reason = "";
    try {
      const body = await request.json();
      reason = String(body?.reason || "").trim().slice(0, 500);
    } catch {
      reason = "";
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        OR: [
          { travelerId: session.travelerId },
          { phone: session.phone },
        ],
      },
      include: {
        trip: { select: { title: true, startDate: true } },
        traveler: { select: { fullName: true, email: true, phone: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (booking.cancelledAt) {
      return NextResponse.json({
        ok: true,
        alreadyCancelled: true,
        booking: { id: booking.id, cancelledAt: booking.cancelledAt.toISOString() },
      });
    }

    const now = new Date();
    const [updated] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: booking.id },
        data: {
          cancelledAt: now,
          cancelReason: reason,
          travelerId: booking.travelerId || session.travelerId,
        },
      }),
      prisma.bookingInstallment.updateMany({
        where: {
          bookingId: booking.id,
          status: { in: [InstallmentStatus.UPCOMING, InstallmentStatus.DUE] },
        },
        data: { status: InstallmentStatus.WAIVED },
      }),
    ]);

    const tripTitle =
      booking.tripTitle || booking.trip?.title || booking.tripSlug || "Trip";
    const name =
      booking.traveler?.fullName || booking.firstname || session.fullName || "Traveler";
    const phone = booking.traveler?.phone || booking.phone || session.phone;
    const email = booking.traveler?.email || booking.email || "";

    void sendEnquiryNotificationEmail({
      name,
      phone,
      email,
      page: "Account — cancel booking",
      formType: "cancellation",
      interestedIn: tripTitle,
      travelDate: booking.trip?.startDate || "",
      message: [
        `Traveler cancelled booking ${booking.id}.`,
        `Trip: ${tripTitle}`,
        `Amount paid so far: ₹${Number(booking.amountPaid).toLocaleString("en-IN")}`,
        `Trip total: ₹${Number(booking.amount).toLocaleString("en-IN")}`,
        reason ? `Reason: ${reason}` : "Reason: (not provided)",
        "",
        "Unpaid instalments were waived in the system. Refunds (if any) must be processed manually per cancellation policy.",
      ].join("\n"),
    });

    return NextResponse.json({
      ok: true,
      booking: {
        id: updated.id,
        cancelledAt: updated.cancelledAt?.toISOString() || now.toISOString(),
      },
    });
  } catch (error) {
    console.error("POST /api/account/bookings/[id]/cancel failed", error);
    return NextResponse.json(
      { error: "Unable to cancel booking." },
      { status: 500 },
    );
  }
}
