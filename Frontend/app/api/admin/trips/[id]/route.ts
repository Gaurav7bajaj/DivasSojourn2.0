import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { parseTripPayload } from "@/app/lib/data/parseTripPayload";
import { deleteTrip, getTripById, updateTrip } from "@/app/lib/data/trips";
import { deleteUploadedFileIfLocal, saveUploadedImage, saveUploadedPdf } from "@/app/lib/uploads";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const existing = await getTripById(id);
    if (!existing) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const parsed = parseTripPayload(String(formData.get("payload") || "{}"));
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    let image = parsed.image || existing.image;
    const coverFile = formData.get("coverImage");
    if (coverFile instanceof File && coverFile.size > 0) {
      const upload = await saveUploadedImage(coverFile, "trips");
      if (upload.error || !upload.url) {
        return NextResponse.json({ error: upload.error || "Cover upload failed." }, { status: 400 });
      }
      if (existing.image.startsWith("/uploads/")) {
        await deleteUploadedFileIfLocal(existing.image);
      }
      image = upload.url;
    }

    const keepGallery = Array.isArray(parsed.galleryImages)
      ? parsed.galleryImages
      : existing.galleryImages;
    const galleryFiles = formData
      .getAll("galleryImages")
      .filter((item): item is File => item instanceof File && item.size > 0);
    const uploadedGallery = [...keepGallery];
    for (const file of galleryFiles) {
      const upload = await saveUploadedImage(file, "trips");
      if (upload.error || !upload.url) {
        return NextResponse.json({ error: upload.error || "Gallery upload failed." }, { status: 400 });
      }
      uploadedGallery.push(upload.url);
    }

    let pdfPath = parsed.pdfPath ?? existing.pdfPath;
    let sourcePdf = parsed.sourcePdf ?? existing.sourcePdf;
    const pdfFile = formData.get("pdf");
    if (pdfFile instanceof File && pdfFile.size > 0) {
      const upload = await saveUploadedPdf(pdfFile);
      if (upload.error || !upload.url) {
        return NextResponse.json({ error: upload.error || "PDF upload failed." }, { status: 400 });
      }
      if (existing.pdfPath?.startsWith("/uploads/")) {
        await deleteUploadedFileIfLocal(existing.pdfPath);
      }
      pdfPath = upload.url;
      sourcePdf = pdfFile.name;
    }

    const trip = await updateTrip(id, {
      ...parsed,
      image,
      galleryImages: uploadedGallery,
      pdfPath,
      sourcePdf,
    });

    return NextResponse.json({ trip });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update trip." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteTrip(id);
    if (!deleted) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete trip." }, { status: 500 });
  }
}
