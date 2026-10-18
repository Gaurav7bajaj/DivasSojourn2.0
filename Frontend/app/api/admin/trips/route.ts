import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { parseTripPayload } from "@/app/lib/data/parseTripPayload";
import { createTrip, getTrips } from "@/app/lib/data/trips";
import { saveUploadedImage, saveUploadedPdf } from "@/app/lib/uploads";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trips = await getTrips();
    return NextResponse.json({ trips });
  } catch {
    return NextResponse.json({ error: "Unable to load trips." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const parsed = parseTripPayload(String(formData.get("payload") || "{}"));
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const coverFile = formData.get("coverImage");
    if (coverFile instanceof File && coverFile.size > 0) {
      const upload = await saveUploadedImage(coverFile, "trips");
      if (upload.error || !upload.url) {
        return NextResponse.json({ error: upload.error || "Cover upload failed." }, { status: 400 });
      }
      parsed.image = upload.url;
    }

    const galleryFiles = formData
      .getAll("galleryImages")
      .filter((item): item is File => item instanceof File && item.size > 0);
    const uploadedGallery: string[] = [...(parsed.galleryImages || [])];
    for (const file of galleryFiles) {
      const upload = await saveUploadedImage(file, "trips");
      if (upload.error || !upload.url) {
        return NextResponse.json({ error: upload.error || "Gallery upload failed." }, { status: 400 });
      }
      uploadedGallery.push(upload.url);
    }
    parsed.galleryImages = uploadedGallery;

    const pdfFile = formData.get("pdf");
    if (pdfFile instanceof File && pdfFile.size > 0) {
      const upload = await saveUploadedPdf(pdfFile);
      if (upload.error || !upload.url) {
        return NextResponse.json({ error: upload.error || "PDF upload failed." }, { status: 400 });
      }
      parsed.pdfPath = upload.url;
      parsed.sourcePdf = pdfFile.name;
    }

    const trip = await createTrip(parsed);
    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create trip." }, { status: 500 });
  }
}
