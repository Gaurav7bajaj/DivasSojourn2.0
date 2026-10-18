import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/data/prisma";
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
    const fullName = String(body.fullName || body.name || "").trim();
    const tripName = String(body.tripName || "").trim();
    const tripSlug = String(body.tripSlug || "").trim();

    if (fullName.length < 2) {
      return NextResponse.json(
        { error: "Enter your full name." },
        { status: 400 },
      );
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

    // Save verified lead so the team can call knowing the person's name.
    try {
      const pageLabel = tripName || tripSlug || "Itinerary unlock";
      await prisma.enquiry.create({
        data: {
          name: fullName,
          email: `itinerary.${digits}@leads.divassojourn.local`,
          phone: digits.slice(-10),
          message: tripSlug
            ? `Unlocked itinerary for trip: ${tripSlug}`
            : "Unlocked trip itinerary via phone OTP",
          page: pageLabel,
          interestedIn: tripName || tripSlug || "",
          formType: "itinerary",
        },
      });
    } catch (leadError) {
      // Unlock should still succeed even if lead logging fails.
      console.error("Failed to save itinerary unlock lead", leadError);
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
