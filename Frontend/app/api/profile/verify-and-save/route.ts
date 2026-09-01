import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  isValidPhone,
  normalizePhone,
  upsertCustomerProfile,
} from "@/app/lib/data/customers";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { validateOtp } from "@/app/lib/smsalert";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const phone = String(body.phone || "").trim();
    const code = String(body.code || body.otp || "").trim();

    if (firstName.length < 1) {
      return NextResponse.json({ error: "First name is required." }, { status: 400 });
    }
    if (lastName.length < 1) {
      return NextResponse.json({ error: "Last name is required." }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Enter a valid phone number (at least 10 digits)." },
        { status: 400 },
      );
    }
    if (!code || code.replace(/\D/g, "").length < 3) {
      return NextResponse.json({ error: "Enter the OTP sent to your phone." }, { status: 400 });
    }

    const digits = normalizePhone(phone);
    const ip = getClientIp(request);
    const verifyLimit = await checkRateLimit(
      `profile-otp-verify:${userId}:${digits}`,
      10,
      15 * 60 * 1000,
    );
    if (!verifyLimit.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 },
      );
    }
    const ipLimit = await checkRateLimit(`profile-otp-verify-ip:${ip}`, 20, 15 * 60 * 1000);
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

    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      "";

    const profile = await upsertCustomerProfile({
      clerkUserId: userId,
      email,
      firstName,
      lastName,
      phone: digits,
    });

    return NextResponse.json({ complete: true, profile });
  } catch {
    return NextResponse.json({ error: "Unable to verify OTP." }, { status: 500 });
  }
}
