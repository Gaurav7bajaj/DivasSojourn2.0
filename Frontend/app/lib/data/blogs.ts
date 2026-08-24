/**
 * Blog data-access layer (Prisma).
 *
 * Exported function names/signatures stay stable so admin UI, public pages, and
 * API routes do not need to change when swapping SQLite ↔ Postgres.
 */

import { slugify } from "./mappers";
import { prisma } from "./prisma";
import type { Blog, BlogCreateInput, BlogUpdateInput } from "./types";
import type { Blog as PrismaBlog, Prisma } from "@prisma/client";

function parseCategories(value: Prisma.JsonValue | null): string[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value as string[];
  }
  return undefined;
}

function toBlog(row: PrismaBlog): Blog {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    coverImageUrl: row.coverImageUrl,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    published: row.published,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    category: row.category ?? undefined,
    categories: parseCategories(row.categories),
    destination: row.destination ?? undefined,
    readingTime: row.readingTime ?? undefined,
    featured: row.featured ?? undefined,
  };
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let candidate = baseSlug || "untitled";
  let suffix = 2;

  while (true) {
    const existing = await prisma.blog.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function getBlogs(): Promise<Blog[]> {
  const rows = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toBlog);
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const rows = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toBlog);
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const row = await prisma.blog.findUnique({ where: { slug } });
  return row ? toBlog(row) : null;
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const row = await prisma.blog.findUnique({ where: { id } });
  return row ? toBlog(row) : null;
}

export async function createBlog(input: BlogCreateInput): Promise<Blog> {
  const baseSlug = slugify(input.slug || input.title);
  const slug = await ensureUniqueSlug(baseSlug);

  const row = await prisma.blog.create({
    data: {
      title: input.title.trim(),
      slug,
      coverImageUrl: input.coverImageUrl?.trim() || "",
      excerpt: input.excerpt.trim(),
      content: input.content.trim(),
      author: input.author.trim(),
      published: input.published ?? true,
      category: input.category,
      categories: input.categories ?? undefined,
      destination: input.destination,
      readingTime: input.readingTime,
      featured: input.featured,
    },
  });

  return toBlog(row);
}

export async function updateBlog(id: string, input: BlogUpdateInput): Promise<Blog | null> {
  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const nextSlug =
    input.slug !== undefined || input.title !== undefined
      ? await ensureUniqueSlug(
          slugify(input.slug || input.title || existing.slug),
          id,
        )
      : existing.slug;

  const row = await prisma.blog.update({
    where: { id },
    data: {
      title: input.title !== undefined ? input.title.trim() : undefined,
      slug: nextSlug,
      coverImageUrl:
        input.coverImageUrl !== undefined ? input.coverImageUrl.trim() : undefined,
      excerpt: input.excerpt !== undefined ? input.excerpt.trim() : undefined,
      content: input.content !== undefined ? input.content.trim() : undefined,
      author: input.author !== undefined ? input.author.trim() : undefined,
      published: input.published,
      category: input.category,
      categories: input.categories === undefined ? undefined : input.categories,
      destination: input.destination,
      readingTime: input.readingTime,
      featured: input.featured,
    },
  });

  return toBlog(row);
}

export async function deleteBlog(id: string): Promise<boolean> {
  try {
    await prisma.blog.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
