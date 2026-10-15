import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^"|"$/g, ""),
      ];
    }),
);

const key = env.EASEBUZZ_KEY;
const salt = env.EASEBUZZ_SALT;
const envName = env.EASEBUZZ_ENV || "test";
console.log({
  keyLen: key?.length ?? 0,
  saltLen: salt?.length ?? 0,
  envName,
});

function makeHash(fields) {
  return createHash("sha512")
    .update(
      [
        key,
        fields.txnid,
        fields.amount,
        fields.productinfo,
        fields.firstname,
        fields.email,
        fields.udf1 || "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        salt,
      ].join("|"),
      "utf8",
    )
    .digest("hex")
    .toLowerCase();
}

async function tryInit(label, fields) {
  const hash = makeHash(fields);
  const body = new URLSearchParams({ key, ...fields, hash });
  if (!fields.udf1) body.delete("udf1");
  const base =
    envName === "prod" ? "https://pay.easebuzz.in" : "https://testpay.easebuzz.in";
  const res = await fetch(`${base}/payment/initiateLink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  console.log(label, {
    http: res.status,
    status: json.status,
    data: json.data,
    error: json.error,
    msg: json.msg,
  });
}

const txn = `T${Date.now().toString(36).toUpperCase()}`;

await tryInit("1-minimal-https", {
  txnid: txn,
  amount: "1.00",
  productinfo: "Test",
  firstname: "Gaurav",
  email: "test@example.com",
  phone: "9876543210",
  surl: "https://example.com/success",
  furl: "https://example.com/failure",
});

await tryInit("2-localhost-surl", {
  txnid: `${txn}A`,
  amount: "1.00",
  productinfo: "Test",
  firstname: "Gaurav",
  email: "test@example.com",
  phone: "9876543210",
  surl: "http://localhost:3000/api/payments/easebuzz/callback",
  furl: "http://localhost:3000/api/payments/easebuzz/callback",
});

await tryInit("3-app-like", {
  txnid: `${txn}B`,
  amount: "51500.00",
  productinfo: "Rameshwaram booking",
  firstname: "Gaurav Bajaj",
  email: "gauravbajaj0425@gmail.com",
  phone: "9310141567",
  surl: "http://localhost:3000/api/payments/easebuzz/callback",
  furl: "http://localhost:3000/api/payments/easebuzz/callback",
  udf1: "3cfa896fc5644d7c8dd7fcfd788f7bc9",
});

// Try production host in case keys are live keys labeled as test by mistake.
{
  const fields = {
    txnid: `${txn}C`,
    amount: "1.00",
    productinfo: "Test",
    firstname: "Gaurav",
    email: "test@example.com",
    phone: "9876543210",
    surl: "https://example.com/success",
    furl: "https://example.com/failure",
  };
  const hash = makeHash(fields);
  const body = new URLSearchParams({ key, ...fields, hash });
  const res = await fetch("https://pay.easebuzz.in/payment/initiateLink", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });
  const json = await res.json().catch(async () => ({ raw: await res.text() }));
  console.log("4-prod-host", {
    http: res.status,
    status: json.status,
    data: json.data,
    error: json.error,
  });
}
