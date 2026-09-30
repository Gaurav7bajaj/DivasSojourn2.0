import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rows = await prisma.trip.findMany({
  orderBy: { startDate: "asc" },
  select: {
    id: true,
    title: true,
    shortName: true,
    slug: true,
    destination: true,
    startDate: true,
    endDate: true,
    price: true,
    earlyBirdPrice: true,
    pdfPath: true,
    nights: true,
    days: true,
    published: true,
  },
});

console.log(JSON.stringify(rows, null, 2));
await prisma.$disconnect();
