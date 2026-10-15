import { NextResponse } from "next/server";
import {
  formDataToRecord,
  processEasebuzzNotification,
} from "@/app/lib/data/payments";
import { getSiteUrl } from "@/app/lib/easebuzz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleCallback(request: Request) {
  const siteUrl = getSiteUrl();

  try {
    const formData = await request.formData();
    const body = formDataToRecord(formData);
    const result = await processEasebuzzNotification(body);

    if (!result.ok) {
      console.error("Easebuzz callback rejected", result.error);
      const txnid = String(body.txnid || "");
      return NextResponse.redirect(
        `${siteUrl}/payment/failed?txnid=${encodeURIComponent(txnid)}`,
        303,
      );
    }

    const success = result.status === "SUCCESS";
    const path = success ? "/payment/success" : "/payment/failed";
    return NextResponse.redirect(
      `${siteUrl}${path}?txnid=${encodeURIComponent(result.txnid)}`,
      303,
    );
  } catch (error) {
    console.error("Easebuzz callback error", error);
    return NextResponse.redirect(`${siteUrl}/payment/failed`, 303);
  }
}

export async function POST(request: Request) {
  return handleCallback(request);
}

/** Some gateways retry as GET — send traveller to a safe page. */
export async function GET() {
  const siteUrl = getSiteUrl();
  return NextResponse.redirect(`${siteUrl}/payments`, 303);
}
