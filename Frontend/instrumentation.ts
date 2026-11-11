export async function register() {
  // Node runtime only — Edge middleware cannot use this env assert path.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Prefer IPv4 so Easebuzz sees Railway static IPv4s (whitelist is IPv4-only).
    const dns = await import("node:dns");
    dns.setDefaultResultOrder("ipv4first");

    const { assertCriticalEnv } = await import("./app/lib/env");
    assertCriticalEnv();
  }
}
