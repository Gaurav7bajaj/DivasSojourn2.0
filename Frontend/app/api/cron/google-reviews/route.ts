import { NextRequest, NextResponse } from "next/server";
import { refreshGooglePlaceIfStale } from "@/app/lib/data/googleReviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization") || "";
  if (authHeader === `Bearer ${secret}`) {
    return true;
  }

  // Vercel Cron also sends this header on Hobby/Pro when CRON_SECRET is set in some setups
  const cronHeader = request.headers.get("x-vercel-cron-secret") || "";
  return cronHeader === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await refreshGooglePlaceIfStale({ force: true });
    return NextResponse.json({
      ok: true,
      refreshed: result.refreshed,
      skipped: "skipped" in result ? result.skipped : undefined,
      fetchedAt: result.cache?.fetchedAt ?? null,
      rating: result.cache?.rating ?? null,
      userRatingsTotal: result.cache?.userRatingsTotal ?? null,
      reviewCount: Array.isArray(result.cache?.reviews) ? result.cache.reviews.length : 0,
    });
  } catch (error) {
    console.error("google-reviews cron failed", error);
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
