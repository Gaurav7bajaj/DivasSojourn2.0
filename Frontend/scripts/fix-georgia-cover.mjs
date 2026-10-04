import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WORKING =
  "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1600&q=85";
const WORKING_THUMB =
  "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=900&q=85";

async function main() {
  const trips = await prisma.trip.findMany({
    where: {
      OR: [
        { slug: { contains: "georgia", mode: "insensitive" } },
        { title: { contains: "Georgia", mode: "insensitive" } },
      ],
    },
    select: { id: true, slug: true, title: true, image: true, galleryImages: true },
  });
  console.log("before:", JSON.stringify(trips, null, 2));

  for (const trip of trips) {
    const gallery = Array.isArray(trip.galleryImages) ? trip.galleryImages : [];
    const nextGallery = gallery.map((url) =>
      String(url).includes("1565008576549-57569a493962") ? WORKING_THUMB : url,
    );
    if (!nextGallery.length) nextGallery.push(WORKING_THUMB);

    await prisma.trip.update({
      where: { id: trip.id },
      data: {
        image: WORKING,
        galleryImages: nextGallery,
      },
    });
    console.log("updated", trip.slug);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
