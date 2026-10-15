import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

export type EasebuzzEnv = "test" | "prod";

export type InitiateHashParts = {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  udf6?: string;
  udf7?: string;
  udf8?: string;
  udf9?: string;
  udf10?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export function getEasebuzzCredentials() {
  return {
    key: requireEnv("EASEBUZZ_KEY"),
    salt: requireEnv("EASEBUZZ_SALT"),
    env: (process.env.EASEBUZZ_ENV?.trim().toLowerCase() === "prod"
      ? "prod"
      : "test") as EasebuzzEnv,
  };
}

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (!url) {
    throw new Error("Missing required env: NEXT_PUBLIC_SITE_URL");
  }
  return url;
}

export function getBaseUrl(env: EasebuzzEnv = getEasebuzzCredentials().env): string {
  return env === "prod" ? "https://pay.easebuzz.in" : "https://testpay.easebuzz.in";
}

function sha512Hex(input: string): string {
  return createHash("sha512").update(input, "utf8").digest("hex").toLowerCase();
}

function safeEqualHex(a: string, b: string): boolean {
  const left = Buffer.from(a.toLowerCase(), "utf8");
  const right = Buffer.from(b.toLowerCase(), "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function sanitizeName(value: string): string {
  return String(value || "")
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export function sanitizeProductInfo(value: string): string {
  return String(value || "")
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100) || "Trip booking";
}

export function sanitizePhone(value: string): string {
  const digits = String(value || "").replace(/\D+/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

/** Easebuzz UDF fields: letters/numbers only (no hyphens/UUID punctuation). */
export function sanitizeUdf(value: string, maxLen = 255): string {
  return String(value || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, maxLen);
}

export function formatAmount(amount: number | string): string {
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("Invalid payment amount");
  }
  return n.toFixed(2);
}

export function generateRequestHash(p: InitiateHashParts, salt?: string): string {
  const merchantSalt = salt ?? getEasebuzzCredentials().salt;
  const parts = [
    p.key,
    p.txnid,
    p.amount,
    p.productinfo,
    p.firstname,
    p.email,
    p.udf1 ?? "",
    p.udf2 ?? "",
    p.udf3 ?? "",
    p.udf4 ?? "",
    p.udf5 ?? "",
    p.udf6 ?? "",
    p.udf7 ?? "",
    p.udf8 ?? "",
    p.udf9 ?? "",
    p.udf10 ?? "",
    merchantSalt,
  ];
  return sha512Hex(parts.join("|"));
}

export function verifyResponseHash(
  body: Record<string, string>,
  salt?: string,
): boolean {
  const merchantSalt = salt ?? getEasebuzzCredentials().salt;
  const key = body.key ?? getEasebuzzCredentials().key;
  const received = String(body.hash || "").trim();
  if (!received) return false;

  const sequence = [
    merchantSalt,
    body.status ?? "",
    body.udf10 ?? "",
    body.udf9 ?? "",
    body.udf8 ?? "",
    body.udf7 ?? "",
    body.udf6 ?? "",
    body.udf5 ?? "",
    body.udf4 ?? "",
    body.udf3 ?? "",
    body.udf2 ?? "",
    body.udf1 ?? "",
    body.email ?? "",
    body.firstname ?? "",
    body.productinfo ?? "",
    body.amount ?? "",
    body.txnid ?? "",
    key,
  ].join("|");

  return safeEqualHex(sha512Hex(sequence), received);
}

export function generateTxnid(prefix = "DS"): string {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  const raw = `${prefix}${Date.now()}${rand}`.replace(/[^a-zA-Z0-9]/g, "");
  return raw.slice(0, 40);
}

/** Transaction Status / Retrieve API — hash: key|txnid|salt */
export function generateTransactionStatusHash(
  key: string,
  txnid: string,
  salt?: string,
): string {
  const merchantSalt = salt ?? getEasebuzzCredentials().salt;
  return sha512Hex([key, txnid, merchantSalt].join("|"));
}

export type TransactionStatusResult = {
  ok: boolean;
  status?: string;
  easepayid?: string | null;
  mode?: string | null;
  amount?: string | null;
  raw: unknown;
  error?: string;
};

export async function fetchTransactionStatus(
  txnid: string,
): Promise<TransactionStatusResult> {
  const { key, salt, env } = getEasebuzzCredentials();
  const hash = generateTransactionStatusHash(key, txnid, salt);
  const url = `${getBaseUrl(env)}/transaction/v2/retrieve`;

  const body = new URLSearchParams({
    key,
    txnid,
    hash,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const raw = await response.json().catch(() => null);
  if (!response.ok || !raw) {
    return {
      ok: false,
      error: `Status API HTTP ${response.status}`,
      raw,
    };
  }

  const msg = raw as Record<string, unknown>;
  const msgStatus = String(msg.status ?? "");
  const data = (msg.msg ?? msg.data ?? msg) as Record<string, unknown>;
  const txnStatus = String(
    data?.status ?? data?.txn_status ?? msgStatus ?? "",
  ).toLowerCase();

  return {
    ok: true,
    status: txnStatus,
    easepayid: data?.easepayid != null ? String(data.easepayid) : null,
    mode: data?.mode != null ? String(data.mode) : null,
    amount: data?.amount != null ? String(data.amount) : null,
    raw,
  };
}

export async function initiateEasebuzzPayment(fields: {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  udf1?: string;
  hash: string;
}): Promise<{ ok: true; checkoutUrl: string } | { ok: false; error: string }> {
  const { env } = getEasebuzzCredentials();
  const base = getBaseUrl(env);
  // Only send required fields + non-empty udf1. Empty udf2–5 keys can trigger
  // "Parameter validation failed" on some Easebuzz setups.
  const body = new URLSearchParams({
    key: fields.key,
    txnid: fields.txnid,
    amount: fields.amount,
    productinfo: fields.productinfo,
    firstname: fields.firstname,
    email: fields.email,
    phone: fields.phone,
    surl: fields.surl,
    furl: fields.furl,
    hash: fields.hash,
  });
  if (fields.udf1) {
    body.set("udf1", fields.udf1);
  }

  console.error("Easebuzz initiate request (safe)", {
    env,
    base,
    txnid: fields.txnid,
    amount: fields.amount,
    productinfo: fields.productinfo,
    firstname: fields.firstname,
    email: fields.email,
    phone: fields.phone,
    surl: fields.surl,
    furl: fields.furl,
    udf1: fields.udf1 || "",
    keyLen: fields.key.length,
  });

  const response = await fetch(`${base}/payment/initiateLink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const rawText = await response.text();
  type EasebuzzInitiatePayload = {
    status?: number | string;
    data?: string | Record<string, unknown>;
    error?: string | string[];
    msg?: string;
    message?: string;
  };
  let payload: EasebuzzInitiatePayload | null = null;
  try {
    payload = JSON.parse(rawText) as EasebuzzInitiatePayload;
  } catch {
    payload = null;
  }

  if (!payload) {
    console.error("Easebuzz initiate non-JSON response", {
      httpStatus: response.status,
      bodyPreview: rawText.slice(0, 300),
    });
    return {
      ok: false,
      error: `Easebuzz initiate failed (HTTP ${response.status}). Check EASEBUZZ_ENV and keys.`,
    };
  }

  // Never log salt/hash — only safe fields for debugging.
  console.error("Easebuzz initiate response", {
    httpStatus: response.status,
    status: payload.status,
    error: payload.error,
    msg: payload.msg,
    message: payload.message,
    data: payload.data,
  });

  const statusNum = Number(payload.status);
  // Success: status === 1 and data is the access_key
  if (statusNum === 1 && typeof payload.data === "string" && payload.data) {
    return { ok: true, checkoutUrl: `${base}/pay/${payload.data}` };
  }

  const errorField = Array.isArray(payload.error)
    ? payload.error.filter(Boolean).join("; ")
    : payload.error;

  // On failure Easebuzz often puts the reason in `data` (string or object).
  let dataError = "";
  if (statusNum !== 1 && payload.data != null) {
    dataError =
      typeof payload.data === "string"
        ? payload.data
        : JSON.stringify(payload.data);
  }

  return {
    ok: false,
    error:
      dataError ||
      (typeof errorField === "string" && errorField) ||
      payload.msg ||
      payload.message ||
      `Unable to start Easebuzz checkout (status=${String(payload.status ?? "unknown")})`,
  };
}
