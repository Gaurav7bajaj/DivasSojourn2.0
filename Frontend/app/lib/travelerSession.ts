import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const TRAVELER_COOKIE_NAME = "divasTravelerSession";
export const TRAVELER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

const DEV_FALLBACK_SECRET = "divas-traveler-dev-secret";

function getSecret(): string | undefined {
  const secret =
    process.env.TRAVELER_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.ADMIN_AUTH_SECRET;
  if (secret) return secret;
  return process.env.NODE_ENV === "production" ? undefined : DEV_FALLBACK_SECRET;
}

function signPayload(payload: string) {
  const secret = getSecret();
  if (!secret) {
    throw new Error("Missing AUTH_SECRET for traveler session.");
  }
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export type TravelerSession = {
  travelerId: string;
  phone: string;
  fullName: string;
  iat: number;
};

export function createTravelerToken(session: Omit<TravelerSession, "iat">): string {
  const payload = Buffer.from(
    JSON.stringify({ ...session, iat: Date.now() } satisfies TravelerSession),
  ).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

export function verifyTravelerToken(
  token: string | undefined | null,
): TravelerSession | null {
  if (!token || typeof token !== "string") return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const secret = getSecret();
  if (!secret) return null;

  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  try {
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;
  } catch {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as TravelerSession;
    if (!session?.travelerId || !session?.phone || !session?.fullName) return null;
    if (typeof session.iat !== "number") return null;
    const ageMs = Date.now() - session.iat;
    if (ageMs < 0 || ageMs > TRAVELER_SESSION_MAX_AGE_SECONDS * 1000) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getTravelerSession(): Promise<TravelerSession | null> {
  const cookieStore = await cookies();
  return verifyTravelerToken(cookieStore.get(TRAVELER_COOKIE_NAME)?.value);
}

export function travelerCookieOptions(maxAge = TRAVELER_SESSION_MAX_AGE_SECONDS) {
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview";
  return {
    httpOnly: true,
    // Lax still sent on top-level GET after Easebuzz redirect; we also re-set
    // the cookie on the payment callback response so login survives checkout.
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge,
  };
}

/** Build a fresh session cookie value for an existing traveler row. */
export function createTravelerTokenFromRecord(traveler: {
  id: string;
  phone: string;
  fullName: string;
}): string {
  return createTravelerToken({
    travelerId: traveler.id,
    phone: traveler.phone,
    fullName: traveler.fullName,
  });
}
