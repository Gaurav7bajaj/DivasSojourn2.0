/**
 * Initials from traveler name, or email local-part if no name.
 * Never uses UI label text (e.g. "Sign In").
 */
export function initialsFromTraveler(traveler) {
  const name = String(traveler?.fullName || "").trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
  }

  const email = String(traveler?.email || "").trim();
  if (email.includes("@")) {
    const local = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    if (local.length >= 2) return local.slice(0, 2).toUpperCase();
    if (local.length === 1) return `${local}${local}`.toUpperCase();
  }

  return "";
}
