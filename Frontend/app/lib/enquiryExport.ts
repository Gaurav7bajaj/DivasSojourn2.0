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
};

const CSV_HEADERS = [
  "Created at",
  "Status",
  "Form type",
  "Page / source",
  "Name",
  "Email",
  "Phone",
  "Interested in",
  "Travel date",
  "Travelers",
  "Message",
  "Record ID",
] as const;

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
  return email && !isPlaceholderEmail(email) ? email : "";
}

function escapeCsvCell(value: string): string {
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

function rowValues(enquiry: EnquiryExportRow): string[] {
  return [
    enquiry.createdAt ? new Date(enquiry.createdAt).toISOString() : "",
    enquiry.read ? "Read" : "Unread",
    formTypeLabel(enquiry.formType),
    enquiry.page || "",
    enquiry.name || "",
    displayEmail(enquiry.email),
    enquiry.phone || "",
    enquiry.interestedIn || "",
    enquiry.travelDate || "",
    enquiry.travelers || "",
    enquiry.message || "",
    enquiry.id || "",
  ];
}

/** UTF-8 CSV with BOM so Excel opens special characters correctly. */
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
  return `lead-${slugPart(enquiry.name, "enquiry")}-${date}.csv`;
}

export function allEnquiriesCsvFilename(count: number): string {
  const date = new Date().toISOString().slice(0, 10);
  return `divas-leads-${count}-${date}.csv`;
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv;charset=utf-8"): void {
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
