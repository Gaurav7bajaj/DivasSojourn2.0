/** Client-safe helpers to export enquiry / lead rows as CSV for admin download. */

export type EnquiryExportRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  page: string;
  interestedIn: string;
  travelDate: string;
  travelers: string;
  formType: string;
  read: boolean;
  createdAt: string;
  /** Stable display number (oldest lead = 1). */
  leadNumber?: number;
};

/** Column order puts the most useful contact fields first. */
const CSV_HEADERS = [
  "Lead #",
  "Name",
  "Phone",
  "Email",
  "Created at",
  "Status",
  "Form type",
  "Page / source",
  "Interested in",
  "Travel date",
  "Travelers",
  "Message",
  "Record ID",
] as const;

/**
 * Assign stable lead numbers: oldest enquiry = #1, newest = highest.
 * Expects `enquiries` newest-first (API order).
 */
export function assignLeadNumbers<T extends { id: string }>(
  enquiries: T[],
): Map<string, number> {
  const map = new Map<string, number>();
  const total = enquiries.length;
  enquiries.forEach((enquiry, index) => {
    map.set(enquiry.id, total - index);
  });
  return map;
}

const EMPTY = "—";

function isPlaceholderEmail(email: string | undefined): boolean {
  if (!email) return true;
  return (
    email.endsWith("@tailored.divassojourn.local") ||
    email.endsWith("@leads.divassojourn.local")
  );
}

export function formTypeLabel(formType: string): string {
  if (formType === "contact") return "Full contact form";
  if (formType === "itinerary") return "Itinerary unlock";
  if (formType === "short") return "Short form";
  return formType || "Enquiry";
}

function displayEmail(email: string): string {
  return email && !isPlaceholderEmail(email) ? email : EMPTY;
}

/** Keep each lead on a single CSV row (no mid-cell line breaks). */
function flattenText(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" | ")
    .replace(/\s+/g, " ")
    .trim();
}

function cell(value: string | undefined | null): string {
  const flat = flattenText(value ?? "");
  return flat || EMPTY;
}

function formatCreatedAt(value: string): string {
  if (!value) return EMPTY;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return cell(value);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function rowValues(enquiry: EnquiryExportRow): string[] {
  return [
    enquiry.leadNumber != null ? String(enquiry.leadNumber) : EMPTY,
    cell(enquiry.name),
    cell(enquiry.phone),
    displayEmail(enquiry.email),
    formatCreatedAt(enquiry.createdAt),
    enquiry.read ? "Read" : "Unread",
    formTypeLabel(enquiry.formType),
    cell(enquiry.page),
    cell(enquiry.interestedIn),
    cell(enquiry.travelDate),
    cell(enquiry.travelers),
    cell(enquiry.message),
    cell(enquiry.id),
  ];
}

/** UTF-8 CSV with BOM so Excel opens ₹ and other characters correctly. */
export function enquiriesToCsv(enquiries: EnquiryExportRow[]): string {
  const lines = [
    CSV_HEADERS.join(","),
    ...enquiries.map((enquiry) => rowValues(enquiry).map(escapeCsvCell).join(",")),
  ];
  return `\uFEFF${lines.join("\r\n")}`;
}

function slugPart(value: string, fallback: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || fallback;
}

export function enquiryCsvFilename(enquiry: EnquiryExportRow): string {
  const date = enquiry.createdAt
    ? new Date(enquiry.createdAt).toISOString().slice(0, 10)
    : "lead";
  const prefix =
    enquiry.leadNumber != null ? `lead-${enquiry.leadNumber}` : "lead";
  return `${prefix}-${slugPart(enquiry.name, "enquiry")}-${date}.csv`;
}

export function allEnquiriesCsvFilename(count: number): string {
  const date = new Date().toISOString().slice(0, 10);
  return `divas-leads-${count}-${date}.csv`;
}

export function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/csv;charset=utf-8",
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
