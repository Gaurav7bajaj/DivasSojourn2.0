import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { createGalleryImage, getGalleryImages } from "@/app/lib/data/gallery";
import { saveUploadedImage } from "@/app/lib/uploads";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const images = await getGalleryImages();
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: "Unable to load gallery." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const caption = String(formData.get("caption") || "").trim() || undefined;
    const category = String(formData.get("category") || "").trim() || undefined;
    const files = formData.getAll("images").filter((item): item is File => item instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: "Please select at least one image." }, { status: 400 });
    }

    const created = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!file.size) continue;
      const upload = await saveUploadedImage(file, "gallery");
      if (upload.error || !upload.url) {
        errors.push(`${file.name}: ${upload.error || "Upload failed."}`);
        continue;
      }
      const image = await createGalleryImage({
        imageUrl: upload.url,
        caption,
        category,
      });
      created.push(image);
    }

    if (!created.length) {
      return NextResponse.json(
        { error: errors[0] || "Unable to upload images." },
        { status: 400 },
      );
    }

    return NextResponse.json({ images: created, errors }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to upload gallery images." }, { status: 500 });
  }
}
