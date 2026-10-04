import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGE =
  "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1600&q=85";
const THUMB =
  "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=900&q=85";

const trip = await prisma.trip.update({
  where: { slug: "varanasi-prayagraj-ayodhya-2027" },
  data: {
    image: IMAGE,
    galleryImages: [
      THUMB,
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=85",
    ],
  },
  select: { slug: true, image: true },
});

console.log(trip);
await prisma.$disconnect();
