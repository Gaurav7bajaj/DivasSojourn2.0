import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGE =
  "https://images.unsplash.com/photo-1624257146471-78ea613e1649?auto=format&fit=crop&w=1600&q=85";
const THUMB =
  "https://images.unsplash.com/photo-1624257146471-78ea613e1649?auto=format&fit=crop&w=900&q=85";

const trip = await prisma.trip.update({
  where: { slug: "pondicherry-mahabalipuram-2027" },
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
