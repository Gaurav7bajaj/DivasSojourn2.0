import { NextResponse } from "next/server";
import { isValidPhone, normalizePhone } from "@/app/lib/phone";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { sendOtp } from "@/app/lib/smsalert";

export const dynamic = "force-dynamic";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = String(body.phone || "").trim();

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Enter a valid phone number (at least 10 digits)." },
        { status: 400 },
      );
    }

    const digits = normalizePhone(phone);
    const ip = getClientIp(request);

    const phoneLimit = await checkRateLimit(
      `itinerary-otp-phone:${digits}`,
      MAX_PER_WINDOW,
      WINDOW_MS,
    );
    if (!phoneLimit.allowed) {
      return NextResponse.json(
        { error: "Too many OTP requests for this number. Please try again later." },
        { status: 429 },
      );
    }

    const ipLimit = await checkRateLimit(
      `itinerary-otp-ip:${ip}`,
      MAX_PER_WINDOW * 2,
      WINDOW_MS,
    );
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please try again later." },
        { status: 429 },
      );
    }

    const result = await sendOtp(digits);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message || "Unable to send OTP." },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, message: "OTP sent successfully." });
  } catch {
    return NextResponse.json({ error: "Unable to send OTP." }, { status: 500 });
  }
}
