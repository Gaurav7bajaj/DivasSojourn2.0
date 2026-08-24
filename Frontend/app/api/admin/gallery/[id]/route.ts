import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { deleteGalleryImage, getGalleryImageById } from "@/app/lib/data/gallery";
import { deleteUploadedFileIfLocal } from "@/app/lib/uploads";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const existing = await getGalleryImageById(id);
    if (!existing) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    const deleted = await deleteGalleryImage(id);
    if (!deleted) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    await deleteUploadedFileIfLocal(existing.imageUrl);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete image." }, { status: 500 });
  }
}
