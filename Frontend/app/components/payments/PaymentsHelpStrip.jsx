import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_URL } from "../../data/paymentData";

export default function PaymentsHelpStrip() {
  return (
    <section
      className="bg-[#0B0B0C] px-6 pb-20 pt-8 md:px-12 md:pb-24 xl:px-24"
      aria-labelledby="payments-help-heading"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 rounded-[24px] border border-[rgba(214,174,60,0.28)] bg-[#121215] px-8 py-9 md:flex-row md:items-center md:px-11">
        <div className="max-w-xl">
          <h2
            id="payments-help-heading"
            className="font-[family-name:var(--font-playfair)] text-[28px] font-semibold leading-tight text-[#FBF8F1] md:text-[32px]"
          >
            Not sure which applies{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              to your trip?
            </em>
          </h2>
          <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6]">
            Our team will confirm your amount and due dates before you pay.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
          >
            WhatsApp us
          </a>
          <a
            href={PHONE_HREF}
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
