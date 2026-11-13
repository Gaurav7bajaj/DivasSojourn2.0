import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveUploadDiskPath } from "@/app/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".gif": "image/gif",
};

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, context: RouteContext) {
  const { path: parts } = await context.params;
  if (!parts?.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const fileUrl = `/uploads/${parts.join("/")}`;
  const diskPath = resolveUploadDiskPath(fileUrl);
  if (!diskPath) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(diskPath);
    const ext = path.extname(diskPath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
