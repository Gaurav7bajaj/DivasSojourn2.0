/** Browser event so Navbar/footer refresh after OTP login or logout. */
export const TRAVELER_AUTH_EVENT = "divas:traveler-auth";

/**
 * @param {{ traveler?: { fullName?: string; email?: string } | null; signedOut?: boolean }} [detail]
 */
export function notifyTravelerAuthChanged(detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TRAVELER_AUTH_EVENT, { detail }));
}
