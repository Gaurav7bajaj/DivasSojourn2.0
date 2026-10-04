import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ITINERARY_UNLOCK_COOKIE = "divasItineraryUnlock";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

const DEV_FALLBACK_SECRET = "divas-itinerary-unlock-dev-secret";

function getSecret(): string | undefined {
  const secret =
    process.env.ITINERARY_UNLOCK_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.ADMIN_AUTH_SECRET;
  if (secret) return secret;
  return process.env.NODE_ENV === "production" ? undefined : DEV_FALLBACK_SECRET;
}

function signPayload(payload: string) {
  const secret = getSecret();
  if (!secret) {
    throw new Error("Missing AUTH_SECRET for itinerary unlock cookie.");
  }
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export type ItineraryUnlockSession = {
  phone: string;
  iat: number;
};

export function createItineraryUnlockToken(phone: string): string {
  const payload = Buffer.from(
    JSON.stringify({ phone, iat: Date.now() } satisfies ItineraryUnlockSession),
  ).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

export function verifyItineraryUnlockToken(
  token: string | undefined | null,
): ItineraryUnlockSession | null {
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
    ) as ItineraryUnlockSession;
    if (!session?.phone || !session?.iat) return null;
    const ageMs = Date.now() - session.iat;
    if (ageMs < 0 || ageMs > SESSION_MAX_AGE_SECONDS * 1000) return null;
    return session;
  } catch {
    return null;
  }
}

export async function isItineraryUnlocked(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(
    verifyItineraryUnlockToken(cookieStore.get(ITINERARY_UNLOCK_COOKIE)?.value),
  );
}

export function itineraryUnlockCookieOptions(maxAge = SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

/** Hide day details until phone OTP unlock. Keeps day count for the locked UI. */
export function redactTripItinerary<T extends { itinerary?: unknown[] }>(trip: T): T {
  const days = Array.isArray(trip.itinerary) ? trip.itinerary : [];
  return {
    ...trip,
    itinerary: days.map((day, index) => {
      const record = day && typeof day === "object" ? (day as Record<string, unknown>) : {};
      const dayNum = typeof record.day === "number" ? record.day : index + 1;
      return {
        day: dayNum,
        title: `Day ${dayNum}`,
        date: "",
        location: "",
        description: "",
        meals: "",
        hotel: "",
      };
    }),
  };
}
