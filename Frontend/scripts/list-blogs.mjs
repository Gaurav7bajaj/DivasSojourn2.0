import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const rows = await prisma.blog.findMany({
  where: { published: true },
  orderBy: { createdAt: "desc" },
  select: {
    id: true,
    title: true,
    slug: true,
    coverImageUrl: true,
    destination: true,
    category: true,
    featured: true,
  },
});
for (const row of rows) {
  console.log(
    `${row.featured ? "F" : "-"} | ${(row.coverImageUrl || "(EMPTY)").slice(0, 60)} | ${row.title.slice(0, 50)}`,
  );
}
await prisma.$disconnect();
