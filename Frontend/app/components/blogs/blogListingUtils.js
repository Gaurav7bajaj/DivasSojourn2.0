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

/** Filter chip label for topic; "Travel" displays as "Stories". */
export function topicChipLabel(category) {
  if (category === "Travel") return "Stories";
  return category;
}

/** Resolve topic used for badges/filters (first non-destination category). */
export function resolveTopic(blog) {
  const cats = blog.categories?.length ? blog.categories : [blog.category];
  const topic = cats.find((c) => c && !DESTINATION_LABELS.has(c));
  if (topic) return topic;
  if (blog.category && !DESTINATION_LABELS.has(blog.category)) return blog.category;
  return "Travel";
}

export function formatReadingLabel(readingTime) {
  const raw = (readingTime || "5 min").trim();
  if (/read/i.test(raw)) return raw;
  if (/min/i.test(raw)) return `${raw} read`;
  return `${raw} min read`;
}

export function badgePair(blog) {
  const destination =
    blog.destination && blog.destination !== "All Destinations"
      ? blog.destination
      : "Travel";
  const topic = resolveTopic(blog);
  return { destination, topic };
}

export function matchesSearch(blog, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const tags = [
    blog.title,
    blog.excerpt,
    blog.destination,
    blog.category,
    ...(blog.categories || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return tags.includes(q);
}
