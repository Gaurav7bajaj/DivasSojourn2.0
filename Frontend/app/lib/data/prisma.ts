import { PrismaClient } from "@prisma/client";

/**
 * Shared Prisma client for the data-access layer.
 * Provider (SQLite vs Postgres) is controlled only by schema.prisma + DATABASE_URL.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
