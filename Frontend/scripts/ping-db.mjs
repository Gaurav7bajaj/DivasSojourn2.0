import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const count = await prisma.trip.count();
console.log("trip count", count);
await prisma.$disconnect();
