import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGE =
  "https://images.unsplash.com/photo-1653959699604-1eb000740b57?auto=format&fit=crop&w=1600&q=85";
const THUMB =
  "https://images.unsplash.com/photo-1653959699604-1eb000740b57?auto=format&fit=crop&w=900&q=85";

const trip = await prisma.trip.update({
  where: { slug: "sri-lanka-soul-2027" },
  data: {
    image: IMAGE,
    galleryImages: [
      THUMB,
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=85",
    ],
  },
  select: { slug: true, image: true },
});

console.log(trip);
await prisma.$disconnect();
