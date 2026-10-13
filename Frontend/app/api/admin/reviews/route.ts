import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import {
  createSiteReview,
  getPlatformStats,
  getSiteReviews,
} from "@/app/lib/data/siteReviews";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [reviews, platforms] = await Promise.all([
      getSiteReviews(),
      getPlatformStats(),
    ]);
    return NextResponse.json({ reviews, platforms });
  } catch (error) {
    console.error("GET /api/admin/reviews failed", error);
    return NextResponse.json({ error: "Unable to load reviews." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const date = String(body.date || "").trim();
    const text = String(body.text || "");
    const url = String(body.url || "").trim();
    const rating = Number(body.rating) || 5;

    if (!name || !text || !url) {
      return NextResponse.json(
        { error: "Name, text, and URL are required." },
        { status: 400 },
      );
    }

    const review = await createSiteReview({ name, date, rating, text, url });
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/reviews failed", error);
    return NextResponse.json({ error: "Unable to create review." }, { status: 500 });
  }
}
