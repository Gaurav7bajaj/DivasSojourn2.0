import { prisma } from "./prisma";
import {
  GOOGLE,
  PLATFORM_STATS,
  REVIEWS,
  type GoogleReview,
} from "../../data/googleReviews";

export type SiteReviewDto = {
  id: string;
  sortOrder: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  url: string;
};

export type PlatformStatDto = {
  id: string;
  platform: string;
  rating: number | null;
  ratingLabel: string | null;
  count: number;
  countLabel: string;
  href: string;
};

function staticReviewsAsDto(): SiteReviewDto[] {
  return REVIEWS.map((review) => ({
    id: `static-${review.id}`,
    sortOrder: review.id,
    name: review.name,
    date: review.date,
    rating: review.rating,
    text: review.text,
    url: review.url,
  }));
}

function staticPlatformsAsDto(): PlatformStatDto[] {
  return PLATFORM_STATS.map((p) => ({
    id: p.id,
    platform: p.platform,
    rating: p.rating,
    ratingLabel: p.ratingLabel,
    count: p.count,
    countLabel: p.countLabel || `${p.count}+ reviews`,
    href: p.href,
  }));
}

/** Seed DB from static data when empty (first load / after migrate). */
export async function ensureReviewsSeeded() {
  const [reviewCount, platformCount] = await Promise.all([
    prisma.siteReview.count(),
    prisma.platformStat.count(),
  ]);

  if (reviewCount === 0) {
    await prisma.siteReview.createMany({
      data: REVIEWS.map((review) => ({
        sortOrder: review.id,
        name: review.name,
        date: review.date,
        rating: review.rating,
        text: review.text,
        url: review.url,
      })),
    });
  }

  if (platformCount === 0) {
    for (const p of PLATFORM_STATS) {
      await prisma.platformStat.upsert({
        where: { id: p.id },
        update: {},
        create: {
          id: p.id,
          platform: p.platform,
          rating: p.rating,
          ratingLabel: p.ratingLabel,
          count: p.count,
          countLabel: p.countLabel,
          href: p.href,
        },
      });
    }
  }
}

export async function getSiteReviews(): Promise<SiteReviewDto[]> {
  try {
    await ensureReviewsSeeded();
    const rows = await prisma.siteReview.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (!rows.length) return staticReviewsAsDto();
    return rows.map((row) => ({
      id: row.id,
      sortOrder: row.sortOrder,
      name: row.name,
      date: row.date,
      rating: row.rating,
      text: row.text,
      url: row.url,
    }));
  } catch (error) {
    console.error("getSiteReviews failed", error);
    return staticReviewsAsDto();
  }
}

export async function getPlatformStats(): Promise<PlatformStatDto[]> {
  try {
    await ensureReviewsSeeded();
    const rows = await prisma.platformStat.findMany();
    if (!rows.length) return staticPlatformsAsDto();

    const order = ["google", "tripadvisor", "facebook"];
    return order
      .map((id) => rows.find((r) => r.id === id))
      .filter(Boolean)
      .map((row) => ({
        id: row!.id,
        platform: row!.platform,
        rating: row!.rating,
        ratingLabel: row!.ratingLabel,
        count: row!.count,
        countLabel: row!.countLabel || `${row!.count}+ reviews`,
        href: row!.href,
      }));
  } catch (error) {
    console.error("getPlatformStats failed", error);
    return staticPlatformsAsDto();
  }
}

export async function getGoogleMeta() {
  const platforms = await getPlatformStats();
  const google = platforms.find((p) => p.id === "google");
  return {
    rating: google?.rating ?? GOOGLE.rating,
    count: google?.count ?? GOOGLE.count,
    allReviewsUrl: GOOGLE.allReviewsUrl,
    writeReviewUrl: GOOGLE.writeReviewUrl,
  };
}

export async function createSiteReview(input: {
  name: string;
  date: string;
  rating: number;
  text: string;
  url: string;
}) {
  const max = await prisma.siteReview.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (max._max.sortOrder ?? 0) + 1;
  return prisma.siteReview.create({
    data: {
      sortOrder,
      name: input.name.trim(),
      date: input.date.trim(),
      rating: Math.max(1, Math.min(5, Math.round(input.rating) || 5)),
      text: input.text,
      url: input.url.trim(),
    },
  });
}

export async function updateSiteReview(
  id: string,
  input: Partial<{
    name: string;
    date: string;
    rating: number;
    text: string;
    url: string;
    sortOrder: number;
  }>,
) {
  return prisma.siteReview.update({
    where: { id },
    data: {
      ...(input.name != null ? { name: input.name.trim() } : {}),
      ...(input.date != null ? { date: input.date.trim() } : {}),
      ...(input.rating != null
        ? { rating: Math.max(1, Math.min(5, Math.round(input.rating) || 5)) }
        : {}),
      ...(input.text != null ? { text: input.text } : {}),
      ...(input.url != null ? { url: input.url.trim() } : {}),
      ...(input.sortOrder != null ? { sortOrder: input.sortOrder } : {}),
    },
  });
}

export async function deleteSiteReview(id: string) {
  return prisma.siteReview.delete({ where: { id } });
}

export async function updatePlatformStat(
  id: string,
  input: Partial<{
    rating: number | null;
    ratingLabel: string | null;
    count: number;
    countLabel: string;
    href: string;
  }>,
) {
  const count = input.count;
  const countLabel =
    input.countLabel ??
    (count != null ? `${count}+ reviews` : undefined);

  return prisma.platformStat.update({
    where: { id },
    data: {
      ...(input.rating !== undefined ? { rating: input.rating } : {}),
      ...(input.ratingLabel !== undefined ? { ratingLabel: input.ratingLabel } : {}),
      ...(count != null ? { count } : {}),
      ...(countLabel != null ? { countLabel } : {}),
      ...(input.href != null ? { href: input.href.trim() } : {}),
    },
  });
}

/** Map DB/static reviews to the wall card shape (numeric id for display order). */
export function toWallReviews(
  reviews: SiteReviewDto[],
): GoogleReview[] {
  return reviews.map((r, index) => ({
    id: index + 1,
    name: r.name,
    date: r.date,
    rating: r.rating,
    text: r.text,
    url: r.url,
  }));
}
