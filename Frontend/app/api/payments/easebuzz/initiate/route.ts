import { NextResponse } from "next/server";
import { InstallmentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/data/prisma";
import {
  formatAmount,
  generateRequestHash,
  generateTxnid,
  getEasebuzzCredentials,
  getSiteUrl,
  initiateEasebuzzPayment,
  sanitizeName,
  sanitizePhone,
  sanitizeProductInfo,
  sanitizeUdf,
} from "@/app/lib/easebuzz";
import { pickNextPayable } from "@/app/lib/paymentSchedule";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { getTravelerSession } from "@/app/lib/travelerSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getTravelerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to continue payment.", code: "LOGIN_REQUIRED" },
        { status: 401 },
      );
    }

    const ip = getClientIp(request);
    const limit = await checkRateLimit(`pay-initiate:${ip}`, 8, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many payment attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const bookingId = String(body.bookingId || "").trim();
    const requestedInstallmentId = String(body.installmentId || "").trim();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required." }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { installments: { orderBy: { sortOrder: "asc" } } },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const ownsBooking =
      booking.travelerId === session.travelerId ||
      booking.phone === session.phone;
    if (!ownsBooking) {
      return NextResponse.json(
        { error: "You can only pay for your own bookings." },
        { status: 403 },
      );
    }

    if (booking.paid) {
      return NextResponse.json({ error: "This booking is already fully paid." }, { status: 400 });
    }

    // Refresh due flags from calendar.
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    for (const row of booking.installments) {
      if (row.status === InstallmentStatus.PAID || row.status === InstallmentStatus.WAIVED) {
        continue;
      }
      const shouldBeDue =
        row.stage === "ADVANCE" ||
        !row.dueDate ||
        row.dueDate.getTime() <= today.getTime();
      const nextStatus = shouldBeDue ? InstallmentStatus.DUE : InstallmentStatus.UPCOMING;
      if (row.status !== nextStatus) {
        await prisma.bookingInstallment.update({
          where: { id: row.id },
          data: { status: nextStatus },
        });
        row.status = nextStatus;
      }
    }

    const nextPayable = pickNextPayable(
      booking.installments.map((row) => ({
        id: row.id,
        stage: row.stage,
        label: row.label,
        status: row.status,
        amountDue: Number(row.amountDue),
        dueDate: row.dueDate,
        sortOrder: row.sortOrder,
      })),
    );

    if (!nextPayable) {
      return NextResponse.json(
        { error: "No installment is due right now." },
        { status: 400 },
      );
    }

    if (requestedInstallmentId && requestedInstallmentId !== nextPayable.id) {
      return NextResponse.json(
        { error: "Pay the next due installment first." },
        { status: 400 },
      );
    }

    const installmentRow =
      booking.installments.find((row) => row.id === nextPayable.id) || null;
    if (!installmentRow) {
      return NextResponse.json({ error: "Installment not found." }, { status: 404 });
    }
    if (
      installmentRow.status === InstallmentStatus.PAID ||
      installmentRow.status === InstallmentStatus.WAIVED
    ) {
      return NextResponse.json({ error: "This installment is already paid." }, { status: 400 });
    }

    const { key } = getEasebuzzCredentials();
    const amount = formatAmount(Number(installmentRow.amountDue));
    const firstname = sanitizeName(booking.firstname);
    const productinfo = sanitizeProductInfo(
      `${booking.productinfo} — ${installmentRow.label}`.slice(0, 100),
    );
    const phone = sanitizePhone(booking.phone);
    const email = booking.email.trim().toLowerCase();
    const txnid = generateTxnid("DS");
    const siteUrl = getSiteUrl();
    const callbackUrl = `${siteUrl}/api/payments/easebuzz/callback`;
    const udf1 = sanitizeUdf(booking.id);

    const hash = generateRequestHash({
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
    });

    await prisma.payment.create({
      data: {
        txnid,
        bookingId: booking.id,
        installmentId: installmentRow.id,
        amount: new Prisma.Decimal(amount),
        status: "PENDING",
      },
    });

    const initiated = await initiateEasebuzzPayment({
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: callbackUrl,
      furl: callbackUrl,
      udf1,
      hash,
    });

    if (!initiated.ok) {
      await prisma.payment.update({
        where: { txnid },
        data: {
          status: "FAILED",
          rawResponse: { initiateError: initiated.error },
        },
      });
      return NextResponse.json({ error: initiated.error }, { status: 400 });
    }

    return NextResponse.json({
      checkoutUrl: initiated.checkoutUrl,
      txnid,
      amount,
      installmentId: installmentRow.id,
      installmentLabel: installmentRow.label,
    });
  } catch (error) {
    console.error("POST /api/payments/easebuzz/initiate failed", error);
    return NextResponse.json({ error: "Unable to start payment." }, { status: 500 });
  }
}
