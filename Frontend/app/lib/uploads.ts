/**
 * Phase 1 local image uploads.
 * Phase 2: swap this helper for Cloudinary / S3 (or similar). No UI/API changes needed
 * beyond returning a public URL string the same way.
 */

import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export type UploadFolder = "blogs" | "gallery" | "trips";

const ALLOWED_PDF = new Set(["application/pdf"]);
const MAX_PDF_BYTES = 15 * 1024 * 1024;

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

export async function saveUploadedImage(
  file: File,
  folder: UploadFolder,
): Promise<{ url: string; error?: undefined } | { url?: undefined; error: string }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}.${extensionForType(file.type)}`;
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

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "trips");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `${randomUUID()}.pdf`;
  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return { url: `/uploads/trips/${filename}` };
}

export async function deleteUploadedFileIfLocal(imageUrl: string): Promise<void> {
  if (!imageUrl.startsWith("/uploads/")) {
    return;
  }

  const relative = imageUrl.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relative);

  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore missing files during cleanup
  }
}
