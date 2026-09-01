/**
 * SMS Alert OTP helpers (server-only).
 * Docs: POST https://www.smsalert.co.in/api/mverify.json
 */

const SMSALERT_BASE = "https://www.smsalert.co.in/api/mverify.json";

const DEFAULT_TEMPLATE =
  'Your Divas Sojourn OTP is [otp length="6" retry="3" validity="10"]';

type SmsAlertConfig =
  | { apiKey: string; sender: string; template: string }
  | { error: string };

export type SmsAlertResult = {
  ok: boolean;
  message: string;
  raw?: unknown;
};

function getConfig(): SmsAlertConfig {
  const apiKey = process.env.SMSALERT_API_KEY?.trim();
  const sender = process.env.SMSALERT_SENDER?.trim();
  const template = process.env.SMSALERT_OTP_TEMPLATE?.trim() || DEFAULT_TEMPLATE;

  if (!apiKey) {
    return { error: "SMS Alert is not configured (missing SMSALERT_API_KEY)." };
  }
  if (!sender) {
    return { error: "SMS Alert is not configured (missing SMSALERT_SENDER)." };
  }
  if (!template.includes("[otp")) {
    return { error: "SMSALERT_OTP_TEMPLATE must include an [otp] tag." };
  }

  return { apiKey, sender, template };
}

function parseSmsAlertBody(body: unknown): SmsAlertResult {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Unexpected response from SMS provider.", raw: body };
  }

  const record = body as { status?: string; description?: { desc?: string } | string };
  const status = String(record.status || "").toLowerCase();
  const desc =
    typeof record.description === "string"
      ? record.description
      : record.description?.desc || "";

  // SMS Alert sometimes returns status "success" with a failure message in desc.
  const lowerDesc = desc.toLowerCase();
  const looksFailed =
    lowerDesc.includes("does not match") ||
    lowerDesc.includes("invalid") ||
    lowerDesc.includes("expired") ||
    lowerDesc.includes("failed") ||
    lowerDesc.includes("error");

  if (status === "error" || (status === "success" && looksFailed && lowerDesc.includes("does not match"))) {
    return {
      ok: false,
      message: desc || "SMS Alert request failed.",
      raw: body,
    };
  }

  if (status === "success" || status === "ok") {
    // For validate: success + "Code does not match" is failure (handled above).
    // For generate: success with a normal desc is ok.
    if (looksFailed && !lowerDesc.includes("sent") && !lowerDesc.includes("otp")) {
      return { ok: false, message: desc || "SMS Alert request failed.", raw: body };
    }
    return { ok: true, message: desc || "OK", raw: body };
  }

  if (desc) {
    return { ok: status !== "error", message: desc, raw: body };
  }

  return { ok: false, message: "Unexpected response from SMS provider.", raw: body };
}

async function postSmsAlert(params: Record<string, string>): Promise<SmsAlertResult> {
  const url = new URL(SMSALERT_BASE);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await response.text();
    let json: unknown = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      return {
        ok: false,
        message: text || `SMS Alert HTTP ${response.status}`,
        raw: text,
      };
    }

    const parsed = parseSmsAlertBody(json);
    if (!response.ok && parsed.ok) {
      return { ok: false, message: parsed.message || `SMS Alert HTTP ${response.status}`, raw: json };
    }
    return parsed;
  } catch {
    return { ok: false, message: "Unable to reach SMS Alert. Please try again." };
  }
}

/** Normalize to digits; strip leading 91 if 12 digits (common India format). */
export function toSmsAlertMobile(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  return digits;
}

export async function sendOtp(mobile: string): Promise<SmsAlertResult> {
  const config = getConfig();
  if ("error" in config) {
    return { ok: false, message: config.error };
  }

  const mobileno = toSmsAlertMobile(mobile);
  if (mobileno.length < 10) {
    return { ok: false, message: "Enter a valid mobile number." };
  }

  return postSmsAlert({
    apikey: config.apiKey,
    sender: config.sender,
    mobileno,
    template: config.template,
  });
}

export async function validateOtp(mobile: string, code: string): Promise<SmsAlertResult> {
  const config = getConfig();
  if ("error" in config) {
    return { ok: false, message: config.error };
  }

  const mobileno = toSmsAlertMobile(mobile);
  const otp = code.replace(/\D/g, "");
  if (mobileno.length < 10) {
    return { ok: false, message: "Enter a valid mobile number." };
  }
  if (otp.length < 3 || otp.length > 8) {
    return { ok: false, message: "Enter a valid OTP." };
  }

  const result = await postSmsAlert({
    apikey: config.apiKey,
    mobileno,
    code: otp,
  });

  // Tighten validate: require success and no mismatch language
  if (result.ok) {
    const msg = result.message.toLowerCase();
    if (msg.includes("does not match") || msg.includes("invalid") || msg.includes("expired")) {
      return { ok: false, message: result.message || "Invalid OTP.", raw: result.raw };
    }
  }

  return result;
}
