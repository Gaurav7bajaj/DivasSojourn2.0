import { NextResponse } from "next/server";
import { getTripBySlug } from "@/app/lib/data/trips";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const trip = await getTripBySlug(slug);
    if (!trip || !trip.published) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }
    return NextResponse.json({ trip });
  } catch {
    return NextResponse.json({ error: "Unable to load trip." }, { status: 500 });
  }
}
