import { NextResponse } from "next/server";
import { isValidPhone, normalizePhone } from "@/app/lib/phone";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import {
  ITINERARY_UNLOCK_COOKIE,
  createItineraryUnlockToken,
  itineraryUnlockCookieOptions,
} from "@/app/lib/itineraryUnlock";
import { validateOtp } from "@/app/lib/smsalert";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = String(body.phone || "").trim();
    const code = String(body.code || body.otp || "").trim();

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Enter a valid phone number (at least 10 digits)." },
        { status: 400 },
      );
    }
    if (code.replace(/\D/g, "").length < 3) {
      return NextResponse.json(
        { error: "Enter the OTP sent to your phone." },
        { status: 400 },
      );
    }

    const digits = normalizePhone(phone);
    const ip = getClientIp(request);

    const verifyLimit = await checkRateLimit(
      `itinerary-otp-verify:${digits}`,
      10,
      15 * 60 * 1000,
    );
    if (!verifyLimit.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 },
      );
    }

    const ipLimit = await checkRateLimit(
      `itinerary-otp-verify-ip:${ip}`,
      20,
      15 * 60 * 1000,
    );
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 },
      );
    }

    const otpResult = await validateOtp(digits, code);
    if (!otpResult.ok) {
      return NextResponse.json(
        { error: otpResult.message || "Invalid OTP. Please try again." },
        { status: 400 },
      );
    }

    const token = createItineraryUnlockToken(digits);
    const response = NextResponse.json({ ok: true, unlocked: true });
    response.cookies.set(
      ITINERARY_UNLOCK_COOKIE,
      token,
      itineraryUnlockCookieOptions(),
    );
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to verify OTP." }, { status: 500 });
  }
}
