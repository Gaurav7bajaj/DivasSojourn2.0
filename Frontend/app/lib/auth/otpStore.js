import { prisma } from "@/app/lib/data/prisma";
import { checkRateLimit } from "@/app/lib/rateLimit";

const OTP_TTL_MS = 5 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_OTP_REQUESTS_PER_WINDOW = 3;

// MOCK_OTP is a local-dev convenience so you don't need a real SMS
// provider to test the login flow. It is intentionally ignored outside
// development, even if the env var is set on the host by mistake.
function mockOtpCode() {
  if (process.env.NODE_ENV === "production") return undefined;
  return process.env.MOCK_OTP || undefined;
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  return digits;
}

export function isValidIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(normalizePhone(phone));
}

export async function createOtp(phone) {
  const rateLimit = await checkRateLimit(`otp:${phone}`, MAX_OTP_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS);
  if (!rateLimit.allowed) {
    return { ok: false, error: "Too many OTP requests. Please try again in 10 minutes." };
  }

  const mock = mockOtpCode();
  const otp = mock || generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  // Only one active code per phone at a time.
  await prisma.otpCode.deleteMany({ where: { phone } });
  await prisma.otpCode.create({ data: { phone, code: otp, expiresAt } });

  return { ok: true, otp, expiresAt, mock: Boolean(mock) };
}

export async function verifyStoredOtp(phone, otp) {
  const mock = mockOtpCode();
  if (mock && otp === mock) {
    await prisma.otpCode.deleteMany({ where: { phone } });
    return { ok: true };
  }

  const record = await prisma.otpCode.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return { ok: false, error: "OTP expired or not found. Please request a new one." };
  }

  if (Date.now() > record.expiresAt.getTime()) {
    await prisma.otpCode.deleteMany({ where: { phone } });
    return { ok: false, error: "OTP has expired. Please request a new one." };
  }

  if (record.code !== otp) {
    return { ok: false, error: "Invalid OTP. Please try again." };
  }

  await prisma.otpCode.deleteMany({ where: { phone } });
  return { ok: true };
}
