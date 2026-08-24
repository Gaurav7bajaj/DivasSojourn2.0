/**
 * Shared sliding-window rate limiter backed by Prisma (the RateLimit table).
 *
 * This replaces per-route in-memory Maps, which only work when a Node
 * process keeps running between requests. Most production hosts for
 * Next.js (Vercel, Netlify, most "serverless" platforms) run API routes as
 * short-lived functions that do NOT share memory between invocations, so an
 * in-memory limiter silently stops limiting anything once deployed there.
 *
 * Note: the read-then-write here isn't wrapped in a DB transaction, so under
 * heavy concurrent traffic to the exact same key a request or two could
 * slip through right at the boundary. That's an acceptable tradeoff for an
 * OTP/login limiter at this app's scale — the goal is stopping casual abuse,
 * not building a hardened distributed rate limiter.
 */

import { prisma } from "@/app/lib/data/prisma";

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const existing = await prisma.rateLimit.findUnique({ where: { key } });

  if (!existing || now.getTime() - existing.windowStart.getTime() > windowMs) {
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, windowStart: now, count: 1 },
      update: { windowStart: now, count: 1 },
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  return { allowed: true, remaining: Math.max(0, maxRequests - existing.count - 1) };
}

/** Best-effort client identifier for rate limiting behind a proxy/CDN. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}
