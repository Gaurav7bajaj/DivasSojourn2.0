import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF, safetyNoticeBullets } from "../../data/paymentData";

const JUMP_LINKS = [
  { href: "#methods", label: "Payment methods" },
  { href: "#schedule", label: "Payment schedule" },
  { href: "#notes", label: "Important notes" },
];

export default function PaymentsHeader() {
  return (
    <header className="bg-[#0B0B0C] px-6 pt-16 md:px-12 xl:px-24">
      <div className="mx-auto grid max-w-[1280px] items-start gap-10 lg:grid-cols-[1fr_500px] lg:gap-16">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]"
          >
            <Link href="/" className="transition hover:text-[#D6AE3C]">
              Home
            </Link>
            <span className="mx-2 text-white/30" aria-hidden="true">
              /
            </span>
            <span className="text-[#FBF8F1]">Payments</span>
          </nav>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Payments
            </p>
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-[1.08] text-[#FBF8F1]">
            Pay{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              securely
            </em>
          </h1>

          <p className="mt-5 max-w-xl font-[family-name:var(--font-dm-sans)] text-[18px] leading-[1.55] text-[#D9D3C6]">
            Choose how you&apos;d like to pay, then check the payment schedule for your trip below.
            Questions? Call us on {PHONE_DISPLAY} before you pay.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {JUMP_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex h-11 items-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.55)] px-5 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <aside
          role="note"
          className="rounded-[24px] border-[1.5px] border-[rgba(214,174,60,0.55)] bg-[#17140C] p-7"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgba(214,174,60,0.16)] text-[#D6AE3C]">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="font-[family-name:var(--font-dm-sans)] text-[20px] font-bold leading-snug text-[#FBF8F1]">
              Pay only to the official accounts on this page
            </h2>
          </div>

          <ul className="mt-5 space-y-3.5">
            {safetyNoticeBullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D6AE3C]"
                  aria-hidden="true"
                />
                <span className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.55] text-[#D9D3C6]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>

          <a
            href={PHONE_HREF}
            className="mt-6 inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
          >
            Call {PHONE_DISPLAY}
          </a>
        </aside>
      </div>
    </header>
  );
}
