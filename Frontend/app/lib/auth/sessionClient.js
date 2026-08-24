export function parseSessionToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const user = JSON.parse(json);
    if (!user?.phone) {
      return null;
    }
    return { phone: user.phone, name: user.name || "" };
  } catch {
    return null;
  }
}

export function maskPhone(phone) {
  const normalized = String(phone || "").replace(/\D/g, "").slice(-10);
  if (normalized.length !== 10) {
    return phone;
  }
  return `+91 *****${normalized.slice(-4)}`;
}
