import type { GalleryImage } from "./types";

/** Seed gallery images for prisma/seed.ts (and historical JSON bootstrap). */
export const SEED_GALLERY: GalleryImage[] = [
  {
    id: "gallery-seed-1",
    imageUrl:
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80",
    caption: "Women travelers exploring together",
    category: "Community",
    createdAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "gallery-seed-2",
    imageUrl:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
    caption: "Group of friends on a mountain trek",
    category: "India Trips",
    createdAt: "2026-01-11T10:00:00.000Z",
  },
  {
    id: "gallery-seed-3",
    imageUrl:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    caption: "Beach sunset with travelers",
    category: "International",
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "gallery-seed-4",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    caption: "Scenic mountain landscape",
    category: "India Trips",
    createdAt: "2026-01-13T10:00:00.000Z",
  },
  {
    id: "gallery-seed-5",
    imageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    caption: "Lake and mountain adventure",
    category: "India Trips",
    createdAt: "2026-01-14T10:00:00.000Z",
  },
  {
    id: "gallery-seed-6",
    imageUrl:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80",
    caption: "Cultural exploration in a historic city",
    category: "International",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
];
