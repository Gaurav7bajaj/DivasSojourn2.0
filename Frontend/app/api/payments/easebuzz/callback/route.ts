import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/data/prisma";
import {
  formDataToRecord,
  processEasebuzzNotification,
} from "@/app/lib/data/payments";
import { resolveAppOrigin } from "@/app/lib/easebuzz";
import {
  TRAVELER_COOKIE_NAME,
  createTravelerTokenFromRecord,
  travelerCookieOptions,
} from "@/app/lib/travelerSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Easebuzz returns via cross-site POST. Re-attach the traveler session on the
 * redirect response so the user stays signed in after payment (avoids www/apex
 * or cookie drops across the gateway hop).
 */
async function attachTravelerSessionFromTxnid(
  response: NextResponse,
  txnid: string,
) {
  if (!txnid) return;
  try {
    const payment = await prisma.payment.findUnique({
      where: { txnid },
      include: {
        booking: {
          include: { traveler: true },
        },
      },
    });
    const booking = payment?.booking;
    if (!booking) return;

    let traveler = booking.traveler;
    if (!traveler && booking.phone) {
      traveler = await prisma.traveler.findUnique({
        where: { phone: booking.phone.slice(-10) },
      });
      if (traveler && !booking.travelerId) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { travelerId: traveler.id },
        });
      }
    }
    if (!traveler) return;

    response.cookies.set(
      TRAVELER_COOKIE_NAME,
      createTravelerTokenFromRecord(traveler),
      travelerCookieOptions(),
    );
  } catch (error) {
    console.error("Failed to restore traveler session after payment", error);
  }
}

async function handleCallback(request: Request) {
  const siteUrl = resolveAppOrigin(request);

  try {
    const formData = await request.formData();
    const body = formDataToRecord(formData);
    const result = await processEasebuzzNotification(body);
    const txnid = String(body.txnid || (result.ok ? result.txnid : "") || "");

    if (!result.ok) {
      console.error("Easebuzz callback rejected", result.error);
      const response = NextResponse.redirect(
        `${siteUrl}/payment/failed?txnid=${encodeURIComponent(txnid)}`,
        303,
      );
      await attachTravelerSessionFromTxnid(response, txnid);
      return response;
    }

    const success = result.status === "SUCCESS";
    const path = success ? "/payment/success" : "/payment/failed";
    const response = NextResponse.redirect(
      `${siteUrl}${path}?txnid=${encodeURIComponent(result.txnid)}`,
      303,
    );
    await attachTravelerSessionFromTxnid(response, result.txnid);
    return response;
  } catch (error) {
    console.error("Easebuzz callback error", error);
    return NextResponse.redirect(`${siteUrl}/payment/failed`, 303);
  }
}

export async function POST(request: Request) {
  return handleCallback(request);
}

/** Some gateways retry as GET — send traveller to a safe page. */
export async function GET(request: Request) {
  const siteUrl = resolveAppOrigin(request);
  return NextResponse.redirect(`${siteUrl}/payments`, 303);
}
