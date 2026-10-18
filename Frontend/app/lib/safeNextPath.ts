/** Allow only same-origin relative paths (block open redirects). Empty string if invalid and no fallback needed. */
export function safeNextPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  return trimmed;
}
