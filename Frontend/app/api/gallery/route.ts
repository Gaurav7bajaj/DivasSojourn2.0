import { NextResponse } from "next/server";
import { getGalleryImages } from "@/app/lib/data/gallery";
import { toPublicGalleryItem } from "@/app/lib/data/mappers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json({
      images: images.map(toPublicGalleryItem),
      records: images,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load gallery." }, { status: 500 });
  }
}
