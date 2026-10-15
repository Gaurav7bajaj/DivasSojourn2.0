import { NextResponse } from "next/server";
import {
  formDataToRecord,
  processEasebuzzNotification,
} from "@/app/lib/data/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Backup notification if the browser never returns to surl/furl.
 * Returns 200 quickly after idempotent DB update.
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, string> = {};

    if (contentType.includes("application/json")) {
      const json = await request.json();
      body = Object.fromEntries(
        Object.entries(json || {}).map(([k, v]) => [k, String(v ?? "")]),
      );
    } else {
      const formData = await request.formData();
      body = formDataToRecord(formData);
    }

    const result = await processEasebuzzNotification(body);
    if (!result.ok) {
      console.error("Easebuzz webhook rejected", result.error);
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.statusCode || 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      status: result.status,
      alreadyProcessed: Boolean(result.alreadyProcessed),
    });
  } catch (error) {
    console.error("Easebuzz webhook error", error);
    return NextResponse.json({ ok: false, error: "Webhook failed" }, { status: 500 });
  }
}
