/**
 * Phase 3 connectivity checks (safe logging — never prints secret values).
 * Run from Frontend/: node scripts/phase3-connectivity.mjs
 *
 * Covers: env presence, DB, Easebuzz hash round-trip, initiateLink (test),
 * local booking→initiate HTTP flow, callback hash reject + success/fail paths.
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

const ROOT = process.cwd();
loadEnvFile(path.join(ROOT, ".env"));
loadEnvFile(path.join(ROOT, ".env.local"));

const results = [];
function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}
function info(msg) {
  console.log(`INFO  ${msg}`);
}

function present(name) {
  const v = process.env[name]?.trim();
  return Boolean(v);
}

function sha512Hex(input) {
  return createHash("sha512").update(input, "utf8").digest("hex").toLowerCase();
}

function safeEqualHex(a, b) {
  const left = Buffer.from(a.toLowerCase(), "utf8");
  const right = Buffer.from(b.toLowerCase(), "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function requestHash({ key, salt, txnid, amount, productinfo, firstname, email, udf1 = "" }) {
  return sha512Hex(
    [key, txnid, amount, productinfo, firstname, email, udf1, "", "", "", "", "", "", "", "", "", salt].join("|"),
  );
}

function responseHash({ key, salt, status, txnid, amount, productinfo, firstname, email, udf1 = "" }) {
  return sha512Hex(
    [
      salt,
      status,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      udf1,
      email,
      firstname,
      productinfo,
      amount,
      txnid,
      key,
    ].join("|"),
  );
}

async function main() {
  info("Checking env presence (names/lengths only)");
  const required = [
    "DATABASE_URL",
    "EASEBUZZ_KEY",
    "EASEBUZZ_SALT",
    "NEXT_PUBLIC_SITE_URL",
  ];
  for (const name of required) {
    if (present(name)) {
      pass(`env:${name}`, `len=${process.env[name].trim().length}`);
    } else {
      fail(`env:${name}`, "missing");
    }
  }
  const easeEnv = (process.env.EASEBUZZ_ENV || "test").toLowerCase();
  if (easeEnv === "test") pass("env:EASEBUZZ_ENV", "test");
  else fail("env:EASEBUZZ_ENV", `expected test for Phase 3, got ${easeEnv}`);

  // DB ping via Prisma dynamic import
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const tripCount = await prisma.trip.count();
    pass("db:ping", `trip.count=${tripCount}`);
    var prismaRef = prisma;
  } catch (e) {
    fail("db:ping", String(e?.message || e).slice(0, 120));
    prismaRef = null;
  }

  const key = process.env.EASEBUZZ_KEY?.trim();
  const salt = process.env.EASEBUZZ_SALT?.trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  // Hash round-trip (synthetic response)
  if (key && salt) {
    const sample = {
      key,
      salt,
      txnid: `DSTEST${Date.now()}`,
      amount: "1.00",
      productinfo: "Phase3 connectivity",
      firstname: "Test User",
      email: "phase3@example.com",
      udf1: "abc123",
    };
    const req = requestHash(sample);
    const resOk = responseHash({ ...sample, status: "success" });
    const resFail = responseHash({ ...sample, status: "failure" });
    if (req.length === 128 && resOk.length === 128) {
      pass("easebuzz:hash-shapes", "request+response sha512 hex");
    } else {
      fail("easebuzz:hash-shapes", `req=${req.length} res=${resOk.length}`);
    }
    if (safeEqualHex(resOk, responseHash({ ...sample, status: "success" }))) {
      pass("easebuzz:hash-verify-success-stable");
    } else {
      fail("easebuzz:hash-verify-success-stable");
    }
    if (!safeEqualHex(resOk, resFail)) {
      pass("easebuzz:hash-success-vs-failure-differ");
    } else {
      fail("easebuzz:hash-success-vs-failure-differ");
    }
    // Tampered hash must fail
    const tampered = resOk.slice(0, -1) + (resOk.endsWith("a") ? "b" : "a");
    if (!safeEqualHex(resOk, tampered)) {
      pass("easebuzz:hash-rejects-tamper");
    } else {
      fail("easebuzz:hash-rejects-tamper");
    }

    // Live initiateLink against test gateway
    const base =
      easeEnv === "prod" ? "https://pay.easebuzz.in" : "https://testpay.easebuzz.in";
    const txnid = `DSCONN${Date.now()}`;
    const amount = "1.00";
    const productinfo = "Phase3 probe";
    const firstname = "Phase Three";
    const email = "phase3probe@example.com";
    const phone = "9990022835";
    const surl = `${siteUrl}/api/payments/easebuzz/callback`;
    const furl = surl;
    const hash = requestHash({
      key,
      salt,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1: "",
    });
    const body = new URLSearchParams({
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
    });
    try {
      const res = await fetch(`${base}/payment/initiateLink`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const text = await res.text();
      let payload = null;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }
      const statusNum = Number(payload?.status);
      if (statusNum === 1 && typeof payload?.data === "string" && payload.data) {
        pass(
          "easebuzz:initiateLink",
          `checkout access_key received (env=${easeEnv}, http=${res.status})`,
        );
        globalThis.__phase3CheckoutHint = `${base}/pay/${payload.data}`;
      } else {
        fail(
          "easebuzz:initiateLink",
          `status=${payload?.status} err=${String(payload?.error_desc || payload?.data || payload?.error || text).slice(0, 160)}`,
        );
      }
    } catch (e) {
      fail("easebuzz:initiateLink", String(e?.message || e).slice(0, 120));
    }
  }

  // Local HTTP flow if server is up
  const baseLocal = siteUrl || "http://localhost:3000";
  let serverUp = false;
  try {
    const health = await fetch(baseLocal + "/", { redirect: "manual" });
    serverUp = health.status > 0;
    pass("http:site", `status=${health.status}`);
  } catch (e) {
    fail("http:site", `server not reachable at ${baseLocal}`);
  }

  if (serverUp && prismaRef) {
    try {
      const trip = await prismaRef.trip.findFirst({
        where: { published: true, price: { gt: 0 } },
        select: { slug: true, price: true, earlyBirdPrice: true, id: true, title: true, shortName: true },
      });
      if (!trip) {
        fail("http:booking", "no published payable trip");
      } else {
        const bookRes = await fetch(`${baseLocal}/api/payments/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tripSlug: trip.slug,
            firstname: "Phase Three",
            email: "phase3e2e@example.com",
            phone: "9990022835",
          }),
        });
        const bookJson = await bookRes.json().catch(() => ({}));
        if (!bookRes.ok || !bookJson.bookingId) {
          fail("http:booking", `status=${bookRes.status} ${JSON.stringify(bookJson).slice(0, 120)}`);
        } else {
          pass("http:booking", `bookingId created for slug=${trip.slug}`);

          // Try live initiate (may fail if merchant key invalid for test env)
          const initRes = await fetch(`${baseLocal}/api/payments/easebuzz/initiate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: bookJson.bookingId }),
          });
          const initJson = await initRes.json().catch(() => ({}));
          if (initRes.ok && initJson.checkoutUrl) {
            pass("http:initiate", `txnid=${initJson.txnid}`);
          } else {
            fail(
              "http:initiate",
              `status=${initRes.status} ${JSON.stringify(initJson).slice(0, 160)} — fix EASEBUZZ_KEY/SALT for test env`,
            );
          }

          // Local Payment rows so callback hash tests work even when initiateLink fails
          async function seedPayment(bookingId, txnPrefix) {
            const booking = await prismaRef.booking.findUnique({ where: { id: bookingId } });
            const txnid = `${txnPrefix}${Date.now()}`.replace(/[^a-zA-Z0-9]/g, "").slice(0, 40);
            await prismaRef.payment.create({
              data: {
                txnid,
                bookingId,
                amount: booking.amount,
                status: "PENDING",
              },
            });
            return { txnid, booking };
          }

          const seeded = await seedPayment(bookJson.bookingId, "DSCB");
          const amountStr = Number(seeded.booking.amount).toFixed(2);
          const firstname = "Phase Three";
          const email = "phase3e2e@example.com";
          const productinfo = seeded.booking.productinfo;
          const udf1 = String(bookJson.bookingId).replace(/[^a-zA-Z0-9]/g, "");

          // Bad hash → failed page
          const badFd = new URLSearchParams({
            txnid: seeded.txnid,
            status: "success",
            amount: amountStr,
            hash: "0".repeat(128),
            key,
            email,
            firstname,
            productinfo,
            udf1,
          });
          const badCb = await fetch(`${baseLocal}/api/payments/easebuzz/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: badFd,
            redirect: "manual",
          });
          const badLoc = badCb.headers.get("location") || "";
          if (badCb.status === 303 && badLoc.includes("/payment/failed")) {
            pass("http:callback-rejects-bad-hash", `status=${badCb.status}`);
          } else {
            fail(
              "http:callback-rejects-bad-hash",
              `status=${badCb.status} loc=${badLoc.slice(0, 80)}`,
            );
          }

          // Valid SUCCESS hash → success page + booking.paid
          const successHash = responseHash({
            key,
            salt,
            status: "success",
            txnid: seeded.txnid,
            amount: amountStr,
            productinfo,
            firstname,
            email,
            udf1,
          });
          const okFd = new URLSearchParams({
            key,
            txnid: seeded.txnid,
            status: "success",
            amount: amountStr,
            productinfo,
            firstname,
            email,
            udf1,
            easepayid: "PHASE3TEST",
            mode: "TEST",
            hash: successHash,
          });
          const okCb = await fetch(`${baseLocal}/api/payments/easebuzz/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: okFd,
            redirect: "manual",
          });
          const okLoc = okCb.headers.get("location") || "";
          const paidBooking = await prismaRef.booking.findUnique({
            where: { id: bookJson.bookingId },
            select: { paid: true },
          });
          if (
            okCb.status === 303 &&
            okLoc.includes("/payment/success") &&
            paidBooking?.paid
          ) {
            pass("http:callback-success", "paid=true");
          } else {
            fail(
              "http:callback-success",
              `status=${okCb.status} paid=${paidBooking?.paid} loc=${okLoc.slice(0, 100)}`,
            );
          }

          // FAILURE path on a fresh booking+payment
          const book2 = await fetch(`${baseLocal}/api/payments/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tripSlug: trip.slug,
              firstname: "Phase Fail",
              email: "phase3fail@example.com",
              phone: "9990022836",
            }),
          });
          const book2Json = await book2.json();
          if (!book2.ok || !book2Json.bookingId) {
            fail("http:callback-failure", "could not create failure booking");
          } else {
            const seededFail = await seedPayment(book2Json.bookingId, "DSFL");
            const amt2 = Number(seededFail.booking.amount).toFixed(2);
            const udfFail = String(book2Json.bookingId).replace(/[^a-zA-Z0-9]/g, "");
            const failHash = responseHash({
              key,
              salt,
              status: "failure",
              txnid: seededFail.txnid,
              amount: amt2,
              productinfo: seededFail.booking.productinfo,
              firstname: "Phase Fail",
              email: "phase3fail@example.com",
              udf1: udfFail,
            });
            const failFd = new URLSearchParams({
              key,
              txnid: seededFail.txnid,
              status: "failure",
              amount: amt2,
              productinfo: seededFail.booking.productinfo,
              firstname: "Phase Fail",
              email: "phase3fail@example.com",
              udf1: udfFail,
              hash: failHash,
            });
            const failCb = await fetch(`${baseLocal}/api/payments/easebuzz/callback`, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: failFd,
              redirect: "manual",
            });
            const failLoc = failCb.headers.get("location") || "";
            const pay2After = await prismaRef.payment.findUnique({
              where: { txnid: seededFail.txnid },
            });
            if (
              failCb.status === 303 &&
              failLoc.includes("/payment/failed") &&
              pay2After?.status === "FAILED"
            ) {
              pass("http:callback-failure", "status=FAILED");
            } else {
              fail(
                "http:callback-failure",
                `http=${failCb.status} db=${pay2After?.status} loc=${failLoc.slice(0, 80)}`,
              );
            }
          }
        }
      }
    } catch (e) {
      fail("http:flow", String(e?.message || e).slice(0, 160));
    }
  }

  // Optional: other integrations presence
  for (const name of [
    "SMSALERT_API_KEY",
    "GOOGLE_PLACES_API_KEY",
    "CRON_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "ADMIN_AUTH_SECRET",
  ]) {
    if (present(name)) pass(`env:${name}`, "present");
    else fail(`env:${name}`, "missing");
  }

  if (prismaRef) await prismaRef.$disconnect().catch(() => undefined);

  const failed = results.filter((r) => !r.ok);
  console.log("\n--- summary ---");
  console.log(`passed=${results.filter((r) => r.ok).length} failed=${failed.length}`);
  if (failed.length) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
