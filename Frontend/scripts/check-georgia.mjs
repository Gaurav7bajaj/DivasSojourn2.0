import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const trips = await prisma.trip.findMany({
  where: { slug: { contains: "georgia" } },
  select: { slug: true, image: true, galleryImages: true },
});
console.log(JSON.stringify(trips, null, 2));
await prisma.$disconnect();
