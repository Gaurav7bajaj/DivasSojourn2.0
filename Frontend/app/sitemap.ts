import type { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/app/lib/data/blogs";
import { getPublishedTrips } from "@/app/lib/data/trips";

const BASE = "https://divassojourn.com";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { url: `${BASE}/upcoming-trips`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/india-trips`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/international-trips`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/calendar`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE}/blogs`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE}/gallery`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE}/about-us`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/faqs`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/payments`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/tailored-trips`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/personalize-trip`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/travel-saving-plan`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/terms-condition`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [trips, blogs] = await Promise.all([
    getPublishedTrips().catch(() => []),
    getPublishedBlogs().catch(() => []),
  ]);

  const tripEntries: MetadataRoute.Sitemap = trips.map((trip) => ({
    url: `${BASE}/${trip.destination === "India" ? "india-trips" : "international-trips"}/${trip.slug}`,
    lastModified: trip.updatedAt ? new Date(trip.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE}/blogs/${blog.slug}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...STATIC_ROUTES, ...tripEntries, ...blogEntries];
}
