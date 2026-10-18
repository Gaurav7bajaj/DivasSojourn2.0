import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates = [
  {
    slug: "south-korea",
    price: 342500,
    earlyBirdPrice: null,
    note: "Flights from Delhi included. Early bird slots gone",
  },
  {
    slug: "rameshwaram-spiritual-gateway",
    price: 51500,
    earlyBirdPrice: null,
  },
  {
    slug: "north-east-cherry-blossom-trails",
    price: 47999,
    earlyBirdPrice: null,
  },
  {
    slug: "dwarka-somnath-divine-gujarat",
    price: 47999,
    earlyBirdPrice: 45999,
  },
  {
    slug: "japan-christmas-new-year",
    price: 385500,
    earlyBirdPrice: null,
  },
];

for (const u of updates) {
  const row = await prisma.trip.update({
    where: { slug: u.slug },
    data: {
      price: u.price,
      earlyBirdPrice: u.earlyBirdPrice,
    },
  });
  console.log(`Updated ${row.slug}: price=${row.price} earlyBird=${row.earlyBirdPrice}`);
}

await prisma.$disconnect();
