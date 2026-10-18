import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/data/prisma";
import { isValidPhone, normalizePhone } from "@/app/lib/phone";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { validateOtp } from "@/app/lib/smsalert";
import {
  TRAVELER_COOKIE_NAME,
  createTravelerToken,
  travelerCookieOptions,
} from "@/app/lib/travelerSession";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = String(body.phone || "").trim();
    const code = String(body.code || body.otp || "").trim();
    const fullName = String(body.fullName || body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();

    if (fullName.length < 2) {
      return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
    }
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
    const phone10 = digits.slice(-10);
    const ip = getClientIp(request);

    const verifyLimit = await checkRateLimit(
      `account-otp-verify:${phone10}`,
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
      `account-otp-verify-ip:${ip}`,
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

    const traveler = await prisma.traveler.upsert({
      where: { phone: phone10 },
      create: {
        phone: phone10,
        fullName,
        email: email || "",
      },
      update: {
        fullName,
        ...(email ? { email } : {}),
      },
    });

    // Attach orphan bookings made with this phone before login.
    await prisma.booking.updateMany({
      where: { phone: phone10, travelerId: null },
      data: { travelerId: traveler.id },
    });

    const token = createTravelerToken({
      travelerId: traveler.id,
      phone: traveler.phone,
      fullName: traveler.fullName,
    });

    const response = NextResponse.json({
      ok: true,
      traveler: {
        id: traveler.id,
        fullName: traveler.fullName,
        phone: traveler.phone,
        email: traveler.email,
      },
    });
    response.cookies.set(TRAVELER_COOKIE_NAME, token, travelerCookieOptions());
    return response;
  } catch (error) {
    console.error("account verify failed", error);
    return NextResponse.json({ error: "Unable to verify OTP." }, { status: 500 });
  }
}
