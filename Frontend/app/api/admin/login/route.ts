import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  ADMIN_COOKIE_NAME,
  createAdminToken,
  getAdminCredentials,
} from "@/app/lib/admin/session";
import { safeCompare } from "@/app/lib/admin/safeCompare";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";

const MAX_ATTEMPTS_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimit(
      `admin-login:${getClientIp(request)}`,
      MAX_ATTEMPTS_PER_WINDOW,
      WINDOW_MS,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 10 minutes." },
        { status: 429 },
      );
    }

    const credentials = getAdminCredentials();
    if (!credentials) {
      console.error("Admin login blocked: ADMIN_EMAIL/ADMIN_PASSWORD are not configured.");
      // Generic response — do not reveal whether credentials are configured.
      return NextResponse.json({ error: "Unable to log in." }, { status: 401 });
    }

    const body = await request.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    const emailOk = safeCompare(email, credentials.email.toLowerCase());
    const passwordOk = safeCompare(password, credentials.password);
    if (!emailOk || !passwordOk) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!process.env.ADMIN_AUTH_SECRET && !process.env.AUTH_SECRET) {
      console.error("Admin login blocked: ADMIN_AUTH_SECRET is not configured.");
      return NextResponse.json({ error: "Unable to log in." }, { status: 401 });
    }

    const token = createAdminToken(credentials.email);
    const response = NextResponse.json({ success: true, email: credentials.email });
    response.cookies.set(ADMIN_COOKIE_NAME, token, adminCookieOptions());
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to log in." }, { status: 500 });
  }
}
