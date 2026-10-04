/** Shared phone helpers for OTP / SMS Alert. */

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidPhone(phone: string): boolean {
  const digits = normalizePhone(phone);
  // Accept 10-digit Indian mobiles, or 11–15 with country code
  return digits.length >= 10 && digits.length <= 15;
}
