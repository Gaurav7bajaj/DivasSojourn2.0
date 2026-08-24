import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "divasAdminSession";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Only used outside production, so local `npm run dev` keeps working
// without an .env file. In production a missing secret means every admin
// token verification fails closed (see verifyAdminToken) instead of
// silently signing with a value baked into the source code.
const DEV_FALLBACK_SECRET = "divas-admin-dev-secret-change-in-production";

function getSecret(): string | undefined {
  const secret = process.env.ADMIN_AUTH_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;
  return process.env.NODE_ENV === "production" ? undefined : DEV_FALLBACK_SECRET;
}

function signPayload(payload: string) {
  const secret = getSecret();
  if (!secret) {
    throw new Error(
      "ADMIN_AUTH_SECRET (or AUTH_SECRET) is not set. Refusing to create an admin session without it.",
    );
  }
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export type AdminSession = {
  email: string;
  iat: number;
};

export function createAdminToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, iat: Date.now() } satisfies AdminSession),
  ).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

export function verifyAdminToken(token: string | undefined | null): AdminSession | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const secret = getSecret();
  if (!secret) {
    // Fail closed: with no configured secret, treat every token as invalid
    // instead of falling back to a guessable, hardcoded default.
    return null;
  }
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");

  try {
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (sigBuffer.length !== expectedBuffer.length) {
      return null;
    }
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (!session?.email) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/** Edge-safe verify used by middleware (Web Crypto not required — HMAC via Node crypto unavailable on edge).
 *  Middleware uses a duplicated lightweight check via the same token format with SubtleCrypto alternative.
 *  For Next.js Node middleware runtime we use this sync verify when possible.
 */
export function verifyAdminTokenEdgeCompatible(token: string | undefined | null): boolean {
  return Boolean(verifyAdminToken(token));
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

const DEV_FALLBACK_EMAIL = "admin@divassojourn.com";
const DEV_FALLBACK_PASSWORD = "changeme";

/**
 * Returns null when ADMIN_EMAIL/ADMIN_PASSWORD aren't configured in
 * production, so the login route can refuse to authenticate anyone against
 * a hardcoded default password instead of silently accepting "changeme".
 */
export function getAdminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (email && password) {
    return { email, password };
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return { email: email || DEV_FALLBACK_EMAIL, password: password || DEV_FALLBACK_PASSWORD };
}

export function adminCookieOptions(maxAge = SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
