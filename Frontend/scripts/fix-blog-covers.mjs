import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COVERS = [
  {
    match: /japan women trip/i,
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    match: /japan women tour/i,
    url: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    match: /russia trip packing/i,
    url: "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200&q=80",
  },
];

async function main() {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  for (const blog of blogs) {
    const empty = !blog.coverImageUrl?.trim();
    const rule = COVERS.find((item) => item.match.test(blog.title));
    console.log({
      title: blog.title.slice(0, 50),
      destination: blog.destination,
      category: blog.category,
      categories: blog.categories,
      empty,
      cover: blog.coverImageUrl?.slice(0, 60) || "(EMPTY)",
    });
    if (empty && rule) {
      await prisma.blog.update({
        where: { id: blog.id },
        data: { coverImageUrl: rule.url },
      });
      console.log("  -> patched");
    }
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
