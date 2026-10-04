import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGE =
  "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?auto=format&fit=crop&w=1600&q=85";
const THUMB =
  "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?auto=format&fit=crop&w=900&q=85";

const trip = await prisma.trip.update({
  where: { slug: "jagannath-puri-2027" },
  data: {
    image: IMAGE,
    galleryImages: [
      THUMB,
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
    ],
  },
  select: { slug: true, image: true },
});

console.log(trip);
await prisma.$disconnect();
