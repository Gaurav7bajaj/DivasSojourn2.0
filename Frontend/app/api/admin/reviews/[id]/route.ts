import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { deleteSiteReview, updateSiteReview } from "@/app/lib/data/siteReviews";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const review = await updateSiteReview(id, {
      name: body.name != null ? String(body.name) : undefined,
      date: body.date != null ? String(body.date) : undefined,
      text: body.text != null ? String(body.text) : undefined,
      url: body.url != null ? String(body.url) : undefined,
      rating: body.rating != null ? Number(body.rating) : undefined,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : undefined,
    });
    return NextResponse.json({ review });
  } catch (error) {
    console.error("PUT /api/admin/reviews/[id] failed", error);
    return NextResponse.json({ error: "Unable to update review." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteSiteReview(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/reviews/[id] failed", error);
    return NextResponse.json({ error: "Unable to delete review." }, { status: 500 });
  }
}
