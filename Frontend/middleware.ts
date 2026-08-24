import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "divasAdminSession";

// Kept in sync with app/lib/admin/session.ts's DEV_FALLBACK_SECRET — this
// file runs on the Edge runtime, which can't use Node's `crypto` module, so
// the HMAC logic is duplicated here using Web Crypto instead of importing
// the Node version.
const DEV_FALLBACK_SECRET = "divas-admin-dev-secret-change-in-production";

function getSecret(): string | undefined {
  const secret = process.env.ADMIN_AUTH_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;
  return process.env.NODE_ENV === "production" ? undefined : DEV_FALLBACK_SECRET;
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  const base64 = padded + "=".repeat(padLength);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64Url(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i += 1) {
    binary += String.fromCharCode(view[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const secret = getSecret();
  if (!secret) {
    // Fail closed: no configured secret means no one can be authenticated.
    return false;
  }

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const expected = bytesToBase64Url(signed);
    if (expected.length !== signature.length) return false;

    let mismatch = 0;
    for (let i = 0; i < expected.length; i += 1) {
      mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    if (mismatch !== 0) return false;

    const json = new TextDecoder().decode(base64UrlToBytes(payload));
    const session = JSON.parse(json) as { email?: string };
    return Boolean(session?.email);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = await isValidAdminToken(token);

  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginApi = pathname === "/api/admin/login";

  if (isAdminPage && !isLoginPage && !authenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && authenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAdminApi && !isLoginApi && !authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
