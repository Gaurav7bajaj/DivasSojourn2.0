import { Blog, GalleryImage, PublicBlogCard, PublicGalleryItem } from "./types";
import { slugify } from "../slugify";
import {
  resolveGalleryDestination,
  resolveGalleryDimensions,
  resolveGalleryFocus,
} from "../../data/galleryMeta";

export { slugify };

export function formatDisplayDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const DESTINATION_LABELS = new Set([
  "India",
  "Japan",
  "Russia",
  "Bali",
  "Europe",
  "International",
  "Africa",
  "All Destinations",
]);

function resolveBlogDestination(blog: Blog): string {
  const raw = blog.destination?.trim();
  if (raw && raw !== "All Destinations") {
    return raw;
  }

  const candidates = [
    ...(blog.categories || []),
    blog.category,
  ].filter(Boolean) as string[];

  const fromCategory = candidates.find((label) => DESTINATION_LABELS.has(label) && label !== "All Destinations");
  return fromCategory || raw || "All Destinations";
}

/** Empty / whitespace cover URLs become "" so UI can render a gradient fallback. */
export function toPublicBlogCard(blog: Blog): PublicBlogCard {
  const cover = blog.coverImageUrl?.trim() || "";
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    image: cover,
    category: blog.category || "Travel",
    categories: blog.categories?.length ? blog.categories : [blog.category || "Travel"],
    destination: resolveBlogDestination(blog),
    author: blog.author,
    date: formatDisplayDate(blog.createdAt),
    datePublished: blog.createdAt.slice(0, 10),
    readingTime: blog.readingTime || "5 min",
    featured: blog.featured,
    content: blog.content,
  };
}

export function toPublicGalleryItem(
  image: GalleryImage,
  index = 0,
): PublicGalleryItem {
  const dims = resolveGalleryDimensions(image.imageUrl);
  const destination = resolveGalleryDestination(
    image.imageUrl,
    image.category,
    image.caption,
  );

  return {
    id: image.id,
    src: image.imageUrl,
    alt: `Divas Sojourn travellers — ${destination}`,
    destination,
    trip: image.category || undefined,
    width: dims.width,
    height: dims.height,
    focus: resolveGalleryFocus(image.imageUrl),
    index: index + 1,
  };
}
