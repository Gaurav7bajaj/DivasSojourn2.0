import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/data/prisma";
import {
  formDataToRecord,
  processEasebuzzNotification,
} from "@/app/lib/data/payments";
import { getSiteUrl } from "@/app/lib/easebuzz";
import {
  TRAVELER_COOKIE_NAME,
  createTravelerTokenFromRecord,
  travelerCookieOptions,
} from "@/app/lib/travelerSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Easebuzz often expects an HTML page after the return POST (browser form POST).
 * A bare 303 can fail silently in some gateways/browsers — use meta + JS redirect.
 */
function htmlRedirectResponse(absoluteUrl: string) {
  const safe = absoluteUrl.replace(/"/g, "&quot;");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${safe}" />
  <title>Redirecting…</title>
  <script>window.location.replace(${JSON.stringify(absoluteUrl)});</script>
</head>
<body style="font-family:system-ui,sans-serif;background:#0B0B0C;color:#FBF8F1;display:flex;min-height:100vh;align-items:center;justify-content:center;">
  <p>Payment received. <a href="${safe}" style="color:#D6AE3C">Continue</a> if you are not redirected.</p>
</body>
</html>`;
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Re-attach traveler session on the return response so login survives checkout.
 * Prefer booking.travelerId (account owner), not passenger phone.
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
    if (!traveler && booking.travelerId) {
      traveler = await prisma.traveler.findUnique({
        where: { id: booking.travelerId },
      });
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

async function finishRedirect(path: string, txnid: string) {
  // Always use configured public site URL (must match Easebuzz surl/furl + Vercel env).
  const siteUrl = getSiteUrl();
  const target = txnid
    ? `${siteUrl}${path}?txnid=${encodeURIComponent(txnid)}`
    : `${siteUrl}${path}`;
  const response = htmlRedirectResponse(target);
  await attachTravelerSessionFromTxnid(response, txnid);
  return response;
}

async function handleCallback(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, string> = {};

    if (contentType.includes("application/json")) {
      const json = (await request.json()) as Record<string, unknown>;
      for (const [key, value] of Object.entries(json)) {
        if (value != null) body[key] = String(value);
      }
    } else {
      const formData = await request.formData();
      body = formDataToRecord(formData);
    }

    // Some Easebuzz flows also put txnid on the query string.
    const url = new URL(request.url);
    if (!body.txnid && url.searchParams.get("txnid")) {
      body.txnid = url.searchParams.get("txnid") || "";
    }

    const result = await processEasebuzzNotification(body);
    const txnid = String(body.txnid || (result.ok ? result.txnid : "") || "");

    if (!result.ok) {
      console.error("Easebuzz callback rejected", result.error, { txnid });
      return finishRedirect("/payment/failed", txnid);
    }

    const success = result.status === "SUCCESS";
    return finishRedirect(
      success ? "/payment/success" : "/payment/failed",
      result.txnid,
    );
  } catch (error) {
    console.error("Easebuzz callback error", error);
    return finishRedirect("/payment/failed", "");
  }
}

export async function POST(request: Request) {
  return handleCallback(request);
}

/**
 * Easebuzz may retry/return via GET. If txnid is present, send user to status page.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const txnid = url.searchParams.get("txnid") || "";
  if (txnid) {
    try {
      const payment = await prisma.payment.findUnique({ where: { txnid } });
      if (payment?.status === "SUCCESS") {
        return finishRedirect("/payment/success", txnid);
      }
      if (payment) {
        return finishRedirect("/payment/failed", txnid);
      }
    } catch (error) {
      console.error("Easebuzz GET callback lookup failed", error);
    }
  }
  return finishRedirect("/payments", "");
}
