/**
 * Notify the team when a customer shares details on the site
 * (forms, login, itinerary unlock, bookings).
 * Uses Resend when RESEND_API_KEY is set; otherwise no-ops (data still saved).
 */

export const DEFAULT_NOTIFY_EMAIL = "pooja.divassojourn@gmail.com";

export type EnquiryEmailPayload = {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  page?: string;
  interestedIn?: string;
  travelDate?: string;
  travelers?: string;
  formType?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getNotifyTo(): string {
  return (
    process.env.ENQUIRY_NOTIFY_EMAIL?.trim() ||
    DEFAULT_NOTIFY_EMAIL
  );
}

function getFrom(): string {
  return (
    process.env.ENQUIRY_FROM_EMAIL?.trim() ||
    "Divas Sojourn <onboarding@resend.dev>"
  );
}

function isPlaceholderEmail(email: string | undefined): boolean {
  if (!email) return true;
  return (
    email.endsWith("@tailored.divassojourn.local") ||
    email.endsWith("@leads.divassojourn.local")
  );
}

function buildBodies(enquiry: EnquiryEmailPayload) {
  const kind = enquiry.formType || "enquiry";
  const lines = [
    `New lead (${kind})`,
    `Page / source: ${enquiry.page || "—"}`,
    `Full name: ${enquiry.name}`,
    `Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email && !isPlaceholderEmail(enquiry.email) ? enquiry.email : "—"}`,
    `Travelers: ${enquiry.travelers || "—"}`,
    `Travel date: ${enquiry.travelDate || "—"}`,
    `Interested in: ${enquiry.interestedIn || "—"}`,
    "",
    "Details:",
    enquiry.message || "(none)",
    "",
    enquiry.id ? `Record ID: ${enquiry.id}` : "",
  ].filter(Boolean);

  const text = lines.join("\n");

  const emailDisplay =
    enquiry.email && !isPlaceholderEmail(enquiry.email) ? enquiry.email : "—";

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a1a">
      <h2 style="margin:0 0 12px">New customer lead</h2>
      <p style="margin:0 0 16px;color:#555">From <strong>${escapeHtml(enquiry.page || "website")}</strong> · ${escapeHtml(kind)}</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:6px 0;color:#666;width:140px">Full name</td><td style="padding:6px 0"><strong>${escapeHtml(enquiry.name)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0"><a href="tel:${escapeHtml(enquiry.phone)}"><strong>${escapeHtml(enquiry.phone)}</strong></a></td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0">${
          emailDisplay !== "—"
            ? `<a href="mailto:${escapeHtml(emailDisplay)}">${escapeHtml(emailDisplay)}</a>`
            : "—"
        }</td></tr>
        <tr><td style="padding:6px 0;color:#666">Travelers</td><td style="padding:6px 0">${escapeHtml(enquiry.travelers || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Travel date</td><td style="padding:6px 0">${escapeHtml(enquiry.travelDate || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Interested in</td><td style="padding:6px 0">${escapeHtml(enquiry.interestedIn || "—")}</td></tr>
      </table>
      <div style="margin-top:16px;padding:12px;background:#f6f4ef;border-radius:8px;white-space:pre-wrap">${escapeHtml(enquiry.message || "(none)")}</div>
      ${enquiry.id ? `<p style="margin-top:16px;font-size:12px;color:#888">Record ID: ${escapeHtml(enquiry.id)}</p>` : ""}
    </div>
  `.trim();

  return { text, html };
}

/**
 * Fire-and-forget friendly: returns ok/error but never throws to callers.
 * Persistence must not depend on mail delivery.
 */
export async function sendEnquiryNotificationEmail(
  enquiry: EnquiryEmailPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = getNotifyTo();
  const from = getFrom();

  if (!apiKey) {
    console.warn(
      "Lead email skipped: RESEND_API_KEY is not set. Lead was still saved.",
    );
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const subjectPage = enquiry.page || "Website";
  const subject = `New lead — ${subjectPage} — ${enquiry.name}`.slice(0, 200);
  const { text, html } = buildBodies(enquiry);

  const replyTo =
    enquiry.email && !isPlaceholderEmail(enquiry.email)
      ? enquiry.email
      : undefined;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Resend lead email failed", response.status, body.slice(0, 300));
      return { ok: false, error: `Resend HTTP ${response.status}` };
    }

    return { ok: true };
  } catch (error) {
    console.error("Resend lead email error", error);
    return { ok: false, error: "Failed to send lead email" };
  }
}

/** Traveler account login / OTP verify — name + phone (+ email if any). */
export async function sendLoginNotificationEmail(input: {
  fullName: string;
  phone: string;
  email?: string;
  source?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  return sendEnquiryNotificationEmail({
    name: input.fullName,
    phone: input.phone,
    email: input.email || "",
    page: input.source || "Account login",
    formType: "login",
    message: `Customer signed in with OTP.\nFull name: ${input.fullName}\nPhone: ${input.phone}${
      input.email ? `\nEmail: ${input.email}` : ""
    }`,
  });
}
