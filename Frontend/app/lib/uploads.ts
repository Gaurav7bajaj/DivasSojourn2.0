/**
 * Image/PDF uploads for admin (blogs, gallery, trips).
 *
 * - Local `next dev`: writes under `public/uploads/` (no Blob token needed).
 * - Vercel / serverless: uploads to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set.
 *
 * Create the store in Vercel → Storage → Blob; the token is injected as
 * `BLOB_READ_WRITE_TOKEN` (also add it to `.env.local` for local Blob testing).
 */

import { del, put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export type UploadFolder = "blogs" | "gallery" | "trips";

const ALLOWED_PDF = new Set(["application/pdf"]);
const MAX_PDF_BYTES = 15 * 1024 * 1024;

function isServerlessHost(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function shouldUseBlob(): boolean {
  return hasBlobToken() || isServerlessHost();
}

function missingBlobTokenError(): string {
  return "Cloud uploads are not configured. Add BLOB_READ_WRITE_TOKEN from Vercel Storage → Blob, then redeploy.";
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
    return host.endsWith(".public.blob.vercel-storage.com") || host.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

async function putToBlob(
  pathname: string,
  file: File,
  contentType: string,
): Promise<{ url: string; error?: undefined } | { url?: undefined; error: string }> {
  if (!hasBlobToken()) {
    return { error: missingBlobTokenError() };
  }

  try {
    const blob = await put(pathname, file, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return { url: blob.url };
  } catch (error) {
    console.error("Vercel Blob upload failed", error);
    return { error: "Upload to cloud storage failed. Try again or use a smaller file." };
  }
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

  if (shouldUseBlob()) {
    return putToBlob(pathname, file, file.type);
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return { url: `/uploads/${folder}/${filename}` };
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

  if (shouldUseBlob()) {
    return putToBlob(pathname, file, "application/pdf");
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "trips");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return { url: `/uploads/trips/${filename}` };
}

export async function deleteUploadedFileIfLocal(fileUrl: string): Promise<void> {
  if (!fileUrl) return;

  if (isVercelBlobUrl(fileUrl)) {
    if (!hasBlobToken()) return;
    try {
      await del(fileUrl);
    } catch {
      // Ignore missing / already-deleted blobs
    }
    return;
  }

  if (!fileUrl.startsWith("/uploads/") || isServerlessHost()) {
    return;
  }

  const relative = fileUrl.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relative);

  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore missing files during cleanup
  }
}
