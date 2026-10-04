import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const needles = [
  "sri",
  "lanka",
  "ramesh",
  "jyotir",
  "jagannath",
  "puri",
  "rann",
  "kutch",
  "pondicherry",
  "puducherry",
  "mahabalipuram",
];

async function main() {
  const trips = await prisma.trip.findMany({
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      shortName: true,
      image: true,
      published: true,
      destination: true,
    },
  });

  const matched = trips.filter((t) => {
    const hay = `${t.slug} ${t.title} ${t.shortName}`.toLowerCase();
    return needles.some((n) => hay.includes(n));
  });

  for (const t of matched) {
    console.log(
      JSON.stringify(
        {
          slug: t.slug,
          title: t.title,
          image: t.image,
          published: t.published,
          destination: t.destination,
        },
        null,
        2,
      ),
    );
  }
  console.log("count", matched.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
