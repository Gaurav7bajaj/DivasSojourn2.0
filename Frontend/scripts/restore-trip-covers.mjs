/**
 * One-off: restore original Unsplash cover URLs for selected trips.
 * Usage: node --env-file=.env.local scripts/restore-trip-covers.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RESTORES = [
  {
    slugs: ["rann-of-kutch-2027"],
    titleIncludes: ["Gujarat Glory", "Rann of Kutch"],
    image:
      "https://images.unsplash.com/photo-1706013698821-3f417f9fcc0b?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slugs: ["ujjain-2027"],
    titleIncludes: ["Mahakal Ujjain", "Ujjain"],
    image:
      "https://images.unsplash.com/photo-1658730458768-8b8cc0c00955?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slugs: ["gateway-to-ladakh-2027"],
    titleIncludes: ["Gateway to Ladakh"],
    image:
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slugs: ["guwahati-shillong-cherrapunji-2027"],
    titleIncludes: ["Guwahati, Shillong", "Cherrapunji"],
    image:
      "https://images.unsplash.com/photo-1723651973403-a262cfd9db0f?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slugs: ["japan-christmas-new-year"],
    titleIncludes: ["Christmas & New Year in Japan", "Japan Christmas"],
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slugs: ["russia-northern-lights-2027", "russia"],
    titleIncludes: ["Northern Lights in Russia", "Russia Northern Lights"],
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slugs: ["mauritius-bliss-2027"],
    titleIncludes: ["Mauritius Bliss"],
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slugs: ["dwarka-somnath-divine-gujarat"],
    titleIncludes: ["Dwarka Somnath Divine Gujarat Pilgrimage"],
    image:
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slugs: ["jagannath-puri-2027"],
    titleIncludes: ["Shree Jagannath Puri"],
    image:
      "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slugs: ["tawang-dirang", "tawang-dirang-2027"],
    titleIncludes: ["Serenity Trails - Tawang, Dirang & Beyond"],
    image:
      "https://images.unsplash.com/photo-1626761627604-f27d98885f4b?auto=format&fit=crop&w=1600&q=85",
  },
];

async function findTrip(entry) {
  for (const slug of entry.slugs) {
    const bySlug = await prisma.trip.findUnique({ where: { slug } });
    if (bySlug) return bySlug;
  }
  for (const fragment of entry.titleIncludes) {
    const matches = await prisma.trip.findMany({
      where: { title: { contains: fragment, mode: "insensitive" } },
    });
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      // Prefer exact-ish title match
      const preferred = matches.find((t) =>
        entry.titleIncludes.some((f) => t.title.toLowerCase().includes(f.toLowerCase())),
      );
      return preferred || matches[0];
    }
  }
  return null;
}

async function main() {
  for (const entry of RESTORES) {
    const trip = await findTrip(entry);
    if (!trip) {
      console.log(`MISS  ${entry.slugs.join("|")} — not found`);
      continue;
    }
    if (trip.image === entry.image) {
      console.log(`OK    ${trip.slug} — already restored`);
      continue;
    }
    await prisma.trip.update({
      where: { id: trip.id },
      data: { image: entry.image },
    });
    console.log(`SET   ${trip.slug}`);
    console.log(`      was: ${trip.image.slice(0, 90)}${trip.image.length > 90 ? "…" : ""}`);
    console.log(`      now: ${entry.image}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
