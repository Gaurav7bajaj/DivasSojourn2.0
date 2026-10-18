/**
 * Fail-fast checks for critical server env vars.
 * Called from instrumentation.ts on Node startup (not Edge).
 * Does not log or return secret values — only names of missing keys.
 */

const ALWAYS_REQUIRED = ["DATABASE_URL"] as const;

const PRODUCTION_REQUIRED = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_AUTH_SECRET",
  "EASEBUZZ_KEY",
  "EASEBUZZ_SALT",
  "NEXT_PUBLIC_SITE_URL",
] as const;

export function assertCriticalEnv(): void {
  const required: string[] = [...ALWAYS_REQUIRED];
  if (process.env.NODE_ENV === "production") {
    required.push(...PRODUCTION_REQUIRED);
  }

  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length === 0) return;

  const message = `Missing required environment variable(s): ${missing.join(", ")}`;
  console.error(message);

  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }
}
