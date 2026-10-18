export async function register() {
  // Node runtime only — Edge middleware cannot use this env assert path.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertCriticalEnv } = await import("./app/lib/env");
    assertCriticalEnv();
  }
}
