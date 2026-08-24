/**
 * Gallery data-access layer (Prisma).
 *
 * Exported function names/signatures stay stable so admin UI, public pages, and
 * API routes do not need to change when swapping SQLite ↔ Postgres.
 *
 * Image files still save to public/uploads/ (see lib/uploads.ts); this layer
 * only persists the resulting URL on GalleryImage.imageUrl.
 */

import { prisma } from "./prisma";
import type { GalleryImage, GalleryImageCreateInput } from "./types";
import type { GalleryImage as PrismaGalleryImage } from "@prisma/client";

function toGalleryImage(row: PrismaGalleryImage): GalleryImage {
  return {
    id: row.id,
    imageUrl: row.imageUrl,
    caption: row.caption ?? undefined,
    category: row.category ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const rows = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toGalleryImage);
}

export async function getGalleryImageById(id: string): Promise<GalleryImage | null> {
  const row = await prisma.galleryImage.findUnique({ where: { id } });
  return row ? toGalleryImage(row) : null;
}

export async function createGalleryImage(
  input: GalleryImageCreateInput,
): Promise<GalleryImage> {
  const row = await prisma.galleryImage.create({
    data: {
      imageUrl: input.imageUrl.trim(),
      caption: input.caption?.trim() || null,
      category: input.category?.trim() || null,
    },
  });
  return toGalleryImage(row);
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  try {
    await prisma.galleryImage.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
