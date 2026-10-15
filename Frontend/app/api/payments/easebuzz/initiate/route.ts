import { NextResponse } from "next/server";
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
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await checkRateLimit(`pay-initiate:${ip}`, 8, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many payment attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const bookingId = String(body.bookingId || "").trim();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required." }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    if (booking.paid) {
      return NextResponse.json({ error: "This booking is already paid." }, { status: 400 });
    }

    const { key } = getEasebuzzCredentials();
    const amount = formatAmount(Number(booking.amount));
    const firstname = sanitizeName(booking.firstname);
    const productinfo = sanitizeProductInfo(booking.productinfo);
    const phone = sanitizePhone(booking.phone);
    const email = booking.email.trim().toLowerCase();
    const txnid = generateTxnid("DS");
    const siteUrl = getSiteUrl();
    const callbackUrl = `${siteUrl}/api/payments/easebuzz/callback`;
    // UDF values must be alphanumeric — UUID hyphens cause "Parameter validation failed".
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
        amount: booking.amount,
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

    return NextResponse.json({ checkoutUrl: initiated.checkoutUrl, txnid });
  } catch (error) {
    console.error("POST /api/payments/easebuzz/initiate failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start payment." },
      { status: 500 },
    );
  }
}
