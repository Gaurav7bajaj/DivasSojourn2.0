/**
 * Admin image/PDF uploads (blogs, gallery, trips).
 *
 * Local: saves under public/uploads/
 * Vercel: requires BLOB_READ_WRITE_TOKEN (Vercel Storage → Blob)
 */

import { del, put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_PDF = new Set(["application/pdf"]);
const MAX_PDF_BYTES = 15 * 1024 * 1024;

export type UploadFolder = "blogs" | "gallery" | "trips";

function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
}

function blobToken(): string | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token || undefined;
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be 5MB or smaller.";
  }
  return null;
}

function extensionForType(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function isVercelBlobUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return (
      host.endsWith(".public.blob.vercel-storage.com") ||
      host.endsWith(".private.blob.vercel-storage.com") ||
      host.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

async function putToBlob(
  pathname: string,
  file: File,
  contentType: string,
): Promise<{ url: string; error?: undefined } | { url?: undefined; error: string }> {
  const token = blobToken();
  if (!token) {
    return {
      error:
        "Cloud uploads are not configured. In Vercel → Settings → Environment Variables, ensure BLOB_READ_WRITE_TOKEN is set for Production, then Redeploy.",
    };
  }

  try {
    const blob = await put(pathname, file, {
      access: "public",
      contentType,
      addRandomSuffix: true,
      token,
    });
    return { url: blob.url };
  } catch (error) {
    console.error("Vercel Blob upload failed", error);
    const message = error instanceof Error ? error.message : "unknown error";
    return {
      error: `Upload to Vercel Blob failed (${message}). Check BLOB_READ_WRITE_TOKEN and redeploy.`,
    };
  }
}

async function saveLocally(
  folder: string,
  filename: string,
  file: File,
): Promise<{ url: string }> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${folder}/${filename}` };
}

export async function saveUploadedImage(
  file: File,
  folder: UploadFolder,
): Promise<{ url: string; error?: undefined } | { url?: undefined; error: string }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const filename = `${randomUUID()}.${extensionForType(file.type)}`;
  const pathname = `${folder}/${filename}`;

  // On Vercel always use Blob (never try local disk).
  if (isVercelRuntime() || blobToken()) {
    return putToBlob(pathname, file, file.type);
  }

  return saveLocally(folder, filename, file);
}

export async function saveUploadedPdf(
  file: File,
): Promise<{ url: string; error?: undefined } | { url?: undefined; error: string }> {
  if (!ALLOWED_PDF.has(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
    return { error: "Only PDF files are allowed." };
  }
  if (file.size > MAX_PDF_BYTES) {
    return { error: "PDF must be 15MB or smaller." };
  }

  const filename = `${randomUUID()}.pdf`;
  const pathname = `trips/${filename}`;

  if (isVercelRuntime() || blobToken()) {
    return putToBlob(pathname, file, "application/pdf");
  }

  return saveLocally("trips", filename, file);
}

/** Deletes a local /uploads file or a Vercel Blob URL. */
export async function deleteUploadedFileIfLocal(fileUrl: string): Promise<void> {
  if (!fileUrl) return;

  if (isVercelBlobUrl(fileUrl)) {
    const token = blobToken();
    if (!token) return;
    try {
      await del(fileUrl, { token });
    } catch {
      // ignore missing blobs
    }
    return;
  }

  if (!fileUrl.startsWith("/uploads/") || isVercelRuntime()) {
    return;
  }

  try {
    await fs.unlink(path.join(process.cwd(), "public", fileUrl.replace(/^\//, "")));
  } catch {
    // ignore missing files
  }
}
