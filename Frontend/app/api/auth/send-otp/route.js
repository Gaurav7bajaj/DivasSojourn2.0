import { NextResponse } from "next/server";
import { createOtp, isValidIndianPhone, normalizePhone } from "../../../lib/auth/otpStore";

// TODO before launch: this only stores the OTP and (in development) logs it
// to the server console — no SMS is actually sent to the traveler's phone.
// Wire up a real SMS provider (e.g. MSG91, Twilio, Firebase Auth) here
// before this login flow can work for real users.
export async function POST(request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(body.phone);

    if (!isValidIndianPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 },
      );
    }

    const result = await createOtp(phone);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 429 });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[auth] OTP for ${phone}: ${result.otp}`);
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
      expiresIn: 300,
      // Only true outside production when MOCK_OTP is set, so the client
      // can show a dev-only hint instead of hardcoding it for everyone.
      mock: result.mock,
    });
  } catch {
    return NextResponse.json({ error: "Unable to send OTP. Please try again." }, { status: 500 });
  }
}
