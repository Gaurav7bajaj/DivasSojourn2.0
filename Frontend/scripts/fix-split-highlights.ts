import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function shouldMerge(a: string, b: string): boolean {
  const A = String(a || "").trim();
  const B = String(b || "").trim();
  if (!A || !B) return false;

  if (/[''\u2019]s$/i.test(A)) return true;
  if (/[-–—]\s*$/.test(A)) return true;
  if (/\b(to|by|with|at|of|and|&|in)$/i.test(A) && B.length < 60) return true;

  if (/One Pillar$/i.test(A) && /^Pagoda\b/i.test(B)) return true;
  if (/Ancient$/i.test(A) && /^Town\b/i.test(B)) return true;
  if (/\bHa$/i.test(A) && /^Long Bay\b/i.test(B)) return true;
  if (/Train Street$/i.test(A) && /^Experience\b/i.test(B)) return true;
  if (/Cam Thanh$/i.test(A) && /^Coconut Village\b/i.test(B)) return true;
  if (/Botanical Garden$/i.test(A) && /^\(/i.test(B)) return true;
  if (/4x4$/i.test(A) && /^Jeep Ride\b/i.test(B)) return true;
  if (/Sanahin$/i.test(A) && /^Monasteries\b/i.test(B)) return true;
  if (/Sevanavank$/i.test(A) && /^Monastery\b/i.test(B)) return true;
  if (/Rabgyaling$/i.test(A) && /^Monastery\b/i.test(B)) return true;
  if (/Gatsel Ling$/i.test(A) && /^Monastery\b/i.test(B)) return true;
  if (/Jyotirlinga$/i.test(A) && /^Darshan\b/i.test(B)) return true;
  if (/Dashashwamedh$/i.test(A) && /^Ghat\b/i.test(B)) return true;
  if (/Hanuman$/i.test(A) && /^Temple\b/i.test(B)) return true;
  if (/Janmabhoomi$/i.test(A) && /^Temple\b/i.test(B)) return true;
  if (/Maasai Mara Game$/i.test(A) && /^Drives\b/i.test(B)) return true;
  if (/National Park$/i.test(A) && /^Game Drive\b/i.test(B)) return true;
  if (/Drive\s*&$/i.test(A) && /^Viewpoint\b/i.test(B)) return true;

  if (
    /^(Pagoda|Town(\s*\(.*\))?|First University|Monastery(\s*\(.*\))?|Monasteries|Darshan|Ghat|Jeep Ride|Ella|Narmada|Experience|Coconut Village|Long Bay|Drives|Viewpoint|Game Drive|Maasai Mara|Temple(,.*)?)$/i.test(
      B,
    )
  ) {
    return true;
  }

  if (/^\([^)]+\)$/.test(B) && A.length < 80) return true;

  return false;
}

function joinParts(a: string, b: string): string {
  return `${a.trim()} ${b.trim()}`.replace(/\s+/g, " ").trim();
}

function mergeHighlights(highlights: string[]): {
  merged: string[];
  changes: { from: [string, string]; to: string }[];
} {
  const changes: { from: [string, string]; to: string }[] = [];
  const out: string[] = [];
  let i = 0;
  while (i < highlights.length) {
    let cur = String(highlights[i] || "").trim();
    while (i + 1 < highlights.length && shouldMerge(cur, String(highlights[i + 1] || ""))) {
      const next = String(highlights[i + 1] || "").trim();
      const joined = joinParts(cur, next);
      changes.push({ from: [cur, next], to: joined });
      cur = joined;
      i += 1;
    }
    if (cur) out.push(cur);
    i += 1;
  }
  return { merged: finalizeHighlights(out), changes };
}

/** Trusted full lists for trips corrupted earlier (from app static trip details). */
const STATIC_RESTORE: Record<string, string[]> = {
  "georgia-armenia": [
    "Holy Trinity Cathedral",
    "Narikala Fortress",
    "Bridge of Peace",
    "Ananuri Fortress",
    "Gudauri Panorama",
    "Wine tasting",
    "Lake Sevan",
    "Garni Temple",
    "Geghard Monastery",
    "Khor Virap",
    "Noravank Monastery",
  ],
  kenya: [
    "Two Full Maasai Mara Game Drives",
    "Big Five Sightings",
    "Guided Nature Walk",
    "Bush Dinner Experience",
    "Great Rift Valley",
    "Lake Naivasha",
    "Crescent Island Walk",
    "Lake Nakuru Game Drive",
    "Baboon Cliff Viewpoint",
    "Maasai Village Visit",
  ],
  "yoga-by-the-backwaters": [
    "Daily Yoga",
    "Meditation",
    "Breathwork",
    "Kerala Cooking Experience",
    "Sunset Backwater Boat Ride",
    "Village Walk",
    "Kalari Experience",
    "Wellness Workshops",
  ],
  russia: [
    "Red Square",
    "Moscow Metro Tour",
    "Alyosha Monument",
    "Nuclear Icebreaker Lenin",
    "Sami Village",
    "Aurora Hunting",
    "Teriberka Village",
    "Igloo House",
    "St. Petersburg City Tour",
  ],
  "russia-northern-lights": [
    "Red Square",
    "Moscow Metro Tour",
    "Alyosha Monument",
    "Nuclear Icebreaker Lenin",
    "Sami Village",
    "Aurora Hunting",
    "Teriberka Village",
    "Igloo House",
    "St. Petersburg City Tour",
  ],
  "georgia-armenia-2": [
    "Tbilisi Old City",
    "Sameba Cathedral",
    "Chronicles of Georgia",
    "Ananuri Fortress",
    "Gudauri Friendship Monument",
    "Gergeti Trinity Church with 4x4 Jeep Ride",
    "Bodbe Monastery",
    "Sighnaghi",
    "Haghpat & Sanahin Monasteries",
    "Dilijan",
    "Lake Sevan & Sevanavank Monastery",
    "Geghard Monastery",
    "Symphony of the Stones",
    "Garni Temple",
    "Lavash Baking Master Class",
    "Yerevan City Tour",
  ],
};

/** Strip list punctuation left over from PDF extraction (not sentence periods inside names). */
function cleanHighlightText(h: string): string {
  return String(h || "")
    .trim()
    .replace(/[,.]+$/g, "")
    .trim();
}

function finalizeHighlights(list: string[]): string[] {
  return list
    .map(cleanHighlightText)
    .filter((h) => h && h.toUpperCase() !== "SPECIAL ATTRACTIONS");
}

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  const richPath = resolve(process.cwd(), "scripts/data/new-trips-rich.json");
  const rich = JSON.parse(readFileSync(richPath, "utf8")) as {
    slug: string;
    highlights?: string[];
  }[];
  const richBySlug = new Map<string, string[]>();
  for (const trip of rich) {
    if (Array.isArray(trip.highlights) && trip.highlights.length) {
      richBySlug.set(trip.slug, trip.highlights.map(String));
    }
  }

  // Also fix source JSON so future upserts stay clean
  let richChanged = false;
  for (const trip of rich) {
    if (!Array.isArray(trip.highlights) || !trip.highlights.length) continue;
    const { merged, changes } = mergeHighlights(trip.highlights.map(String));
    const before = trip.highlights.map(String);
    const after = merged;
    const changed =
      changes.length > 0 ||
      before.length !== after.length ||
      before.some((v, idx) => cleanHighlightText(v) !== after[idx]);
    if (changed) {
      trip.highlights = after;
      richChanged = true;
    }
  }
  if (richChanged) {
    writeFileSync(richPath, `${JSON.stringify(rich, null, 2)}\n`, "utf8");
  }

  try {
    const trips = await prisma.trip.findMany({
      select: { id: true, slug: true, title: true, highlights: true },
      orderBy: { slug: "asc" },
    });

    const report: unknown[] = [];
    let updated = 0;

    for (const trip of trips) {
      const current = Array.isArray(trip.highlights)
        ? trip.highlights.map((h) => String(h))
        : [];

      let source =
        STATIC_RESTORE[trip.slug] ||
        richBySlug.get(trip.slug) ||
        current;
      if (!source.length) continue;

      // If restoring from static, use as final; else merge wrap splits
      const { merged: rawMerged, changes } = STATIC_RESTORE[trip.slug]
        ? {
            merged: STATIC_RESTORE[trip.slug],
            changes: [] as { from: [string, string]; to: string }[],
          }
        : mergeHighlights(source);
      const merged = finalizeHighlights(rawMerged);

      const same =
        merged.length === current.length &&
        merged.every((v, idx) => v === current[idx]);
      if (same) continue;

      await prisma.trip.update({
        where: { id: trip.id },
        data: { highlights: merged },
      });
      updated += 1;
      report.push({
        slug: trip.slug,
        title: trip.title,
        beforeCount: current.length,
        afterCount: merged.length,
        source: STATIC_RESTORE[trip.slug]
          ? "static-restore"
          : richBySlug.has(trip.slug)
            ? "rich-json-merge"
            : "db-merge",
        merges: changes,
        highlights: merged,
      });
    }

    console.log(JSON.stringify({ updated, richJsonUpdated: richChanged, report }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
