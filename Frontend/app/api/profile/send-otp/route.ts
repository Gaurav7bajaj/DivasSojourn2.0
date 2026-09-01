import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isValidPhone, normalizePhone } from "@/app/lib/data/customers";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { sendOtp } from "@/app/lib/smsalert";

export const dynamic = "force-dynamic";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const userLimit = await checkRateLimit(`profile-otp:${userId}`, MAX_PER_WINDOW, WINDOW_MS);
    if (!userLimit.allowed) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please try again later." },
        { status: 429 },
      );
    }
    const phoneLimit = await checkRateLimit(`profile-otp-phone:${digits}`, MAX_PER_WINDOW, WINDOW_MS);
    if (!phoneLimit.allowed) {
      return NextResponse.json(
        { error: "Too many OTP requests for this number. Please try again later." },
        { status: 429 },
      );
    }
    const ipLimit = await checkRateLimit(`profile-otp-ip:${ip}`, MAX_PER_WINDOW * 2, WINDOW_MS);
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
