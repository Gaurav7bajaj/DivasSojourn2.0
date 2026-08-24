import { Blog, GalleryImage, PublicBlogCard, PublicGalleryItem } from "./types";
import { slugify } from "../slugify";

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

export function toPublicBlogCard(blog: Blog): PublicBlogCard {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    image: blog.coverImageUrl,
    category: blog.category || "Travel",
    categories: blog.categories?.length ? blog.categories : [blog.category || "Travel"],
    destination: blog.destination || "All Destinations",
    author: blog.author,
    date: formatDisplayDate(blog.createdAt),
    datePublished: blog.createdAt.slice(0, 10),
    readingTime: blog.readingTime || "5 min",
    featured: blog.featured,
    content: blog.content,
  };
}

export function toPublicGalleryItem(image: GalleryImage): PublicGalleryItem {
  return {
    src: image.imageUrl,
    alt: image.caption || image.category || "Gallery photo",
  };
}
