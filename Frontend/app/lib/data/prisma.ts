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

function isTransientDbError(error: unknown): boolean {
  const message = String((error as { message?: string })?.message || error || "");
  const code = String((error as { code?: string })?.code || "");
  return (
    code === "P1001" ||
    code === "P1017" ||
    /Can't reach database server/i.test(message) ||
    /Server has closed the connection/i.test(message) ||
    /Connection reset/i.test(message) ||
    /Timed out fetching a new connection/i.test(message)
  );
}

/** Retry helper for Neon cold starts / brief disconnects. */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  { retries = 3, baseDelayMs = 800 }: { retries?: number; baseDelayMs?: number } = {},
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === retries || !isTransientDbError(error)) {
        throw error;
      }
      const delay = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
