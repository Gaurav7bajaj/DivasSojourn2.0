import { importantNoteCards } from "../../data/paymentData";

export default function PaymentNotesSection() {
  return (
    <section
      id="notes"
      className="scroll-mt-28 bg-[#0B0B0C] px-6 py-16 md:px-12 md:py-24 xl:px-24"
      aria-labelledby="payment-notes-heading"
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[420px_1fr] lg:gap-14">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Please Note
            </p>
          </div>
          <h2
            id="payment-notes-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[32px] font-semibold leading-tight text-[#FBF8F1] md:text-[36px]"
          >
            Good to know{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              before you pay
            </em>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {importantNoteCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-white/[0.08] bg-[#141417] p-5"
            >
              <h3 className="font-[family-name:var(--font-dm-sans)] text-[17px] font-bold text-[#FBF8F1]">
                {card.title}
              </h3>
              <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.55] text-[#D9D3C6]">
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
