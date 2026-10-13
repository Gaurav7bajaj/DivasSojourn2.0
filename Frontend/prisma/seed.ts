import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PLATFORM_STATS, REVIEWS } from "../app/data/googleReviews";
import { SEED_BLOGS } from "../app/lib/data/seedBlogs";
import { SEED_GALLERY } from "../app/lib/data/seedGallery";
import { seedTrips } from "./seedTrips";

const prisma = new PrismaClient();

async function main() {
  for (const blog of SEED_BLOGS) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        coverImageUrl: blog.coverImageUrl,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        published: blog.published,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
        category: blog.category,
        categories: blog.categories ?? undefined,
        destination: blog.destination,
        readingTime: blog.readingTime,
        featured: blog.featured,
      },
    });
  }

  for (const image of SEED_GALLERY) {
    await prisma.galleryImage.upsert({
      where: { id: image.id },
      update: {
        imageUrl: image.imageUrl,
        caption: image.caption,
        category: image.category,
      },
      create: {
        id: image.id,
        imageUrl: image.imageUrl,
        caption: image.caption,
        category: image.category,
        createdAt: new Date(image.createdAt),
      },
    });
  }

  // Remove old Unsplash placeholder gallery seed rows if still present
  await prisma.galleryImage.deleteMany({
    where: {
      id: {
        in: [
          "gallery-seed-1",
          "gallery-seed-2",
          "gallery-seed-3",
          "gallery-seed-4",
          "gallery-seed-5",
          "gallery-seed-6",
        ],
      },
    },
  });

  const tripCount = await seedTrips(prisma);

  const existingReviews = await prisma.siteReview.count();
  if (existingReviews === 0) {
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

  const reviewCount = await prisma.siteReview.count();

  console.log(
    `Seeded ${SEED_BLOGS.length} blogs, ${SEED_GALLERY.length} gallery images, ${tripCount} trips, ${reviewCount} reviews, and ${PLATFORM_STATS.length} platform stats.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
