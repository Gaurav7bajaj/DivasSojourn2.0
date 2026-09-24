/**
 * Admin image/PDF uploads (blogs, gallery, trips).
 *
 * Local: saves under public/uploads/
 * Vercel: requires BLOB_READ_WRITE_TOKEN (Vercel Storage → Blob)
 *
 * Note: Vercel serverless request bodies are capped near ~4.5MB, so image
 * limits are kept under that so uploads work on the production admin URL.
 */

import { del, put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
/** Stay under Vercel's ~4.5MB request body limit (includes form fields). */
const MAX_BYTES = 4 * 1024 * 1024;
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

function extensionFromName(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "png";
  if (lower.endsWith(".webp")) return "webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "jpg";
  return null;
}

/** Some browsers (esp. Windows / mobile) send an empty File.type. */
function resolveImageType(file: File): string | null {
  const raw = (file.type || "").toLowerCase().trim();
  if (ALLOWED_TYPES.has(raw)) {
    return raw === "image/jpg" ? "image/jpeg" : raw;
  }

  const ext = extensionFromName(file.name || "");
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "jpg") return "image/jpeg";
  return null;
}

export function validateImageFile(file: File): string | null {
  const type = resolveImageType(file);
  if (!type) {
    return "Only JPG, PNG, and WebP images are allowed (HEIC/HEIF from iPhones is not supported — convert to JPG first).";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be 4MB or smaller for cloud uploads. Compress the photo and try again.";
  }
  if (file.size <= 0) {
    return "The selected image file is empty.";
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
  body: ArrayBuffer,
  contentType: string,
): Promise<{ url: string; error?: undefined } | { url?: undefined; error: string }> {
  const token = blobToken();
  if (!token) {
    return {
      error:
        "Cloud uploads are not configured. In Vercel → Settings → Environment Variables, ensure BLOB_READ_WRITE_TOKEN is set for Production, Preview, and Development, then Redeploy.",
    };
  }

  try {
    const blob = await put(pathname, body, {
      access: "public",
      contentType,
      addRandomSuffix: true,
      multipart: true,
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
  body: ArrayBuffer,
): Promise<{ url: string }> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, Buffer.from(body));
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

  const contentType = resolveImageType(file)!;
  const filename = `${randomUUID()}.${extensionForType(contentType)}`;
  const pathname = `${folder}/${filename}`;
  const body = await file.arrayBuffer();

  // On Vercel always use Blob (never try local disk).
  if (isVercelRuntime() || blobToken()) {
    return putToBlob(pathname, body, contentType);
  }

  return saveLocally(folder, filename, body);
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
  const body = await file.arrayBuffer();

  if (isVercelRuntime() || blobToken()) {
    return putToBlob(pathname, body, "application/pdf");
  }

  return saveLocally("trips", filename, body);
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

export function uploadErrorFromCaught(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (
    message.includes("body") ||
    message.includes("payload") ||
    message.includes("too large") ||
    message.includes("413") ||
    message.includes("formdata")
  ) {
    return "Upload failed because the file is too large for the server. Use a JPG/PNG/WebP under 4MB.";
  }
  return "Unable to save. Please try again.";
}
