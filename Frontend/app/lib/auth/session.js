import { createHmac, timingSafeEqual } from "crypto";

// Only used outside production so local `npm run dev` keeps working without
// an .env file. In production, a missing AUTH_SECRET means every session
// token fails to verify (fail closed) instead of trusting a value that's
// baked into the source code.
const DEV_FALLBACK_SECRET = "divas-sojourn-dev-secret-change-in-production";

function getSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  return process.env.NODE_ENV === "production" ? undefined : DEV_FALLBACK_SECRET;
}

function signPayload(payload) {
  const secret = getSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. Refusing to create a session without it.");
  }
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      phone: user.phone,
      name: user.name || "",
      iat: Date.now(),
    }),
  ).toString("base64url");

  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const secret = getSecret();
  if (!secret) {
    return null;
  }
  const expectedSignature = createHmac("sha256", secret).update(payload).digest("base64url");

  try {
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

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
    const user = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!user?.phone) {
      return null;
    }
    return { phone: user.phone, name: user.name || "" };
  } catch {
    return null;
  }
}
