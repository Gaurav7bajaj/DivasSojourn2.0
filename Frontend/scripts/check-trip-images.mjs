import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NEEDLES = [
  "sri lanka",
  "sri-lanka",
  "rameshwaram",
  "jyotirling",
  "ujjain",
  "mahakal",
  "jagannath",
  "puri",
  "rann",
  "kutch",
  "pondicherry",
  "puducherry",
  "mahabalipuram",
];

const trips = await prisma.trip.findMany({
  orderBy: { startDate: "asc" },
  select: {
    id: true,
    slug: true,
    title: true,
    shortName: true,
    image: true,
    destination: true,
    published: true,
  },
});

const matched = trips.filter((t) => {
  const hay = `${t.slug} ${t.title} ${t.shortName}`.toLowerCase();
  return NEEDLES.some((n) => hay.includes(n));
});

console.log(JSON.stringify(matched, null, 2));
console.log("\n--- ALL published short list ---");
for (const t of trips.filter((x) => x.published)) {
  console.log(`${t.destination.padEnd(14)} ${t.slug.padEnd(40)} ${t.image?.slice(0, 70) || "(EMPTY)"}`);
}

await prisma.$disconnect();
