import { NextResponse } from "next/server";
import {
  getGoogleMeta,
  getSiteReviews,
  toWallReviews,
} from "@/app/lib/data/siteReviews";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows, google] = await Promise.all([getSiteReviews(), getGoogleMeta()]);
    return NextResponse.json({
      reviews: toWallReviews(rows),
      google,
    });
  } catch (error) {
    console.error("GET /api/reviews failed", error);
    return NextResponse.json({ error: "Unable to load reviews." }, { status: 500 });
  }
}
