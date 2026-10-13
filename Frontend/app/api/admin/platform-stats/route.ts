import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { getPlatformStats, updatePlatformStat } from "@/app/lib/data/siteReviews";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const platforms = await getPlatformStats();
    return NextResponse.json({ platforms });
  } catch {
    return NextResponse.json({ error: "Unable to load platform stats." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json({ error: "Platform id is required." }, { status: 400 });
    }

    const count = body.count != null ? Number(body.count) : undefined;
    const rating =
      body.rating === "" || body.rating === null || body.rating === undefined
        ? body.rating === null || body.rating === ""
          ? null
          : undefined
        : Number(body.rating);

    const platform = await updatePlatformStat(id, {
      count: Number.isFinite(count) ? count : undefined,
      rating: rating === undefined ? undefined : rating,
      ratingLabel:
        body.ratingLabel !== undefined
          ? body.ratingLabel
            ? String(body.ratingLabel)
            : null
          : undefined,
      countLabel: body.countLabel != null ? String(body.countLabel) : undefined,
      href: body.href != null ? String(body.href) : undefined,
    });

    return NextResponse.json({ platform });
  } catch (error) {
    console.error("PUT /api/admin/platform-stats failed", error);
    return NextResponse.json({ error: "Unable to update platform stats." }, { status: 500 });
  }
}
