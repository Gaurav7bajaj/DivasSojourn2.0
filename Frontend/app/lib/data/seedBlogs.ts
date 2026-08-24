import type { Blog } from "./types";

/** Seed blogs for prisma/seed.ts (and historical JSON bootstrap). */
export const SEED_BLOGS: Blog[] = [
  {
    id: "blog-seed-1",
    title: "Why Travellers Love Divas Sojourn Europe Trips | Reviews and Feedback",
    slug: "why-travellers-love-divas-sojourn-europe-trips",
    coverImageUrl:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Discover what makes our Europe trips special through real traveler feedback, thoughtful planning and memorable women-only experiences.",
    content:
      "Our Europe trips are built around comfort, connection and carefully paced days. Travelers often mention the trusted local planning, shared evenings, and the ease of exploring iconic cities with a women-only group.\n\nFrom welcome dinners to guided walks, every itinerary balances signature sights with breathing room. That combination is what keeps so many travelers coming back — and recommending Divas Sojourn to friends.",
    author: "Prajakta",
    published: true,
    createdAt: "2025-09-15T10:00:00.000Z",
    updatedAt: "2025-09-15T10:00:00.000Z",
    category: "Travel",
    categories: ["Europe", "Travel"],
    destination: "Europe",
    readingTime: "5 min",
    featured: true,
  },
  {
    id: "blog-seed-2",
    title: "35 Amazing Places To Visit In Spiti Valley You Can't Miss",
    slug: "35-amazing-places-spiti-valley",
    coverImageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "A complete guide to the most scenic monasteries, villages, lakes and viewpoints across Spiti Valley.",
    content:
      "Spiti Valley rewards travelers who plan with care. High-altitude monasteries, quiet villages, and glacial lakes sit along roads that demand good pacing and warm layers.\n\nThis guide highlights the places our groups love most — from Key Monastery and Chandratal to the winding approaches that make every stop feel earned.",
    author: "Arun",
    published: true,
    createdAt: "2026-06-11T10:00:00.000Z",
    updatedAt: "2026-06-11T10:00:00.000Z",
    category: "Places to Visit",
    categories: ["India", "Places to Visit"],
    destination: "India",
    readingTime: "8 min",
    featured: true,
  },
  {
    id: "blog-seed-3",
    title: "Key Monastery: The Largest Gompa in Spiti Valley",
    slug: "key-monastery-largest-gompa",
    coverImageUrl:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Explore the majestic Key Monastery, its spiritual importance and what travelers should know before visiting.",
    content:
      "Key Monastery rises above the Spiti River like a stone fortress of prayer. Visitors come for the views, stay for the calm, and leave with a deeper sense of the valley's living Buddhist heritage.\n\nArrive with respectful clothing, a light appetite for stairs, and time to sit quietly with the landscape.",
    author: "Neha",
    published: true,
    createdAt: "2026-06-11T09:00:00.000Z",
    updatedAt: "2026-06-11T09:00:00.000Z",
    category: "Things to Do",
    categories: ["India", "Things to Do"],
    destination: "India",
    readingTime: "5 min",
  },
  {
    id: "blog-seed-4",
    title: "10 Must-Visit Places in Bali for Solo Female Travelers",
    slug: "10-must-visit-places-bali",
    coverImageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Explore the hidden gems of Bali that are perfect for solo female travelers, from temples to beaches.",
    content:
      "Bali is welcoming for solo women when you pick the right neighborhoods and daylight plans. Temples at quieter hours, beach clubs with friends from the group, and cafes that double as coworking spots all make the island feel easy.\n\nThese ten stops are favorites from our women-only Bali departures.",
    author: "Priya",
    published: true,
    createdAt: "2026-06-05T10:00:00.000Z",
    updatedAt: "2026-06-05T10:00:00.000Z",
    category: "Places to Visit",
    categories: ["International", "Places to Visit"],
    destination: "International",
    readingTime: "6 min",
    featured: true,
  },
  {
    id: "blog-seed-5",
    title: "Kerala Backwaters: A Peaceful Getaway Guide",
    slug: "kerala-backwaters-guide",
    coverImageUrl:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Everything you need to know about Kerala's beautiful backwaters, houseboats and slow travel moments.",
    content:
      "The Kerala backwaters are made for slow mornings and long conversations. Houseboat decks, village canals, and coconut-lined shores invite you to put the itinerary down for a while.\n\nPack light cottons, motion-friendly snacks, and curiosity for the quiet details between destinations.",
    author: "Rishika",
    published: true,
    createdAt: "2026-05-15T10:00:00.000Z",
    updatedAt: "2026-05-15T10:00:00.000Z",
    category: "Places to Visit",
    categories: ["India", "Places to Visit"],
    destination: "India",
    readingTime: "6 min",
  },
  {
    id: "blog-seed-6",
    title: "Seasonal Travel Guide: Best Time to Visit Each Destination",
    slug: "seasonal-travel-guide",
    coverImageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Plan trips around the best weather, seasonal festivals and ideal travel windows for popular destinations.",
    content:
      "Timing changes everything. Monsoon roads, shoulder-season quiet, and festival calendars all shape how a trip feels.\n\nUse this seasonal overview as a starting point, then match it to your comfort with heat, crowds, and altitude.",
    author: "Travel Expert",
    published: true,
    createdAt: "2026-05-05T10:00:00.000Z",
    updatedAt: "2026-05-05T10:00:00.000Z",
    category: "Travel Tips",
    categories: ["Travel Tips"],
    destination: "All Destinations",
    readingTime: "7 min",
  },
];
