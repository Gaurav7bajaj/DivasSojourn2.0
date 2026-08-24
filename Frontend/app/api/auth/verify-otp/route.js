import { NextResponse } from "next/server";
import { isValidIndianPhone, normalizePhone, verifyStoredOtp } from "../../../lib/auth/otpStore";
import { createSessionToken } from "../../../lib/auth/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(body.phone);
    const otp = String(body.otp || "").trim();
    const name = String(body.name || "").trim();

    if (!isValidIndianPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 },
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "Please enter the 6-digit OTP." }, { status: 400 });
    }

    const verification = await verifyStoredOtp(phone, otp);

    if (!verification.ok) {
      return NextResponse.json({ error: verification.error }, { status: 401 });
    }

    const user = { phone, name };
    const token = createSessionToken(user);

    return NextResponse.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to verify OTP. Please try again." }, { status: 500 });
  }
}
