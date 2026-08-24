import "dotenv/config";
import { PrismaClient } from "@prisma/client";
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
      update: {},
      create: {
        id: image.id,
        imageUrl: image.imageUrl,
        caption: image.caption,
        category: image.category,
        createdAt: new Date(image.createdAt),
      },
    });
  }

  const tripCount = await seedTrips(prisma);

  console.log(
    `Seeded ${SEED_BLOGS.length} blogs, ${SEED_GALLERY.length} gallery images, and ${tripCount} trips.`,
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
