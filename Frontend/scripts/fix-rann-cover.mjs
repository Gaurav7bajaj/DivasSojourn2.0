import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGE =
  "https://images.unsplash.com/photo-1706013698821-3f417f9fcc0b?auto=format&fit=crop&w=1600&q=85";
const THUMB =
  "https://images.unsplash.com/photo-1706013698821-3f417f9fcc0b?auto=format&fit=crop&w=900&q=85";

const trip = await prisma.trip.update({
  where: { slug: "rann-of-kutch-2027" },
  data: {
    image: IMAGE,
    galleryImages: [
      THUMB,
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=85",
    ],
  },
  select: { slug: true, image: true },
});

console.log(trip);
await prisma.$disconnect();
