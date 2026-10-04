import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLUGS = [
  "sri-lanka-soul-2027",
  "rameshwaram-spiritual-gateway",
  "jyotirlingas-ellora-divine-historic-odyssey",
  "jagannath-puri-2027",
  "rann-of-kutch-2027",
  "pondicherry-mahabalipuram-2027",
];

async function headOk(url) {
  if (!url?.trim()) return { ok: false, status: "empty" };
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return { ok: res.ok, status: res.status };
  } catch (error) {
    return { ok: false, status: String(error.message || error) };
  }
}

async function main() {
  const trips = await prisma.trip.findMany({
    where: {
      OR: [
        { slug: { in: SLUGS } },
        { title: { contains: "Sri Lanka", mode: "insensitive" } },
        { title: { contains: "Rameshwaram", mode: "insensitive" } },
        { title: { contains: "Jyotirling", mode: "insensitive" } },
        { title: { contains: "Jagannath", mode: "insensitive" } },
        { title: { contains: "Rann", mode: "insensitive" } },
        { title: { contains: "Pondicherry", mode: "insensitive" } },
        { title: { contains: "Puri", mode: "insensitive" } },
      ],
    },
    select: { id: true, slug: true, title: true, image: true },
    orderBy: { slug: "asc" },
  });

  for (const trip of trips) {
    const check = await headOk(trip.image);
    console.log(
      JSON.stringify({
        slug: trip.slug,
        title: trip.title,
        image: trip.image,
        status: check.status,
        ok: check.ok,
      }),
    );
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
