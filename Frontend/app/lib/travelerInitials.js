/**
 * Initials from first + last name (e.g. "Suhaan Malhotra" → "SM").
 * Never uses UI label text (e.g. "Sign In").
 */
export function initialsFromTraveler(traveler) {
  const name = String(traveler?.fullName || "").trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0][0] || "";
      const last = parts[parts.length - 1][0] || "";
      return `${first}${last}`.toUpperCase();
    }
    // Single word only — wait for a last name when possible; show one letter.
    return (parts[0][0] || "").toUpperCase();
  }

  const email = String(traveler?.email || "").trim();
  if (email.includes("@")) {
    const local = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    if (local.length >= 2) return local.slice(0, 2).toUpperCase();
    if (local.length === 1) return local.toUpperCase();
  }

  return "";
}

/** Combine first + last into a single fullName for APIs / DB. */
export function joinFullName(firstName, lastName) {
  return [String(firstName || "").trim(), String(lastName || "").trim()]
    .filter(Boolean)
    .join(" ");
}
