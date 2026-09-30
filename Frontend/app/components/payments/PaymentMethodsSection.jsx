import { paymentMethods } from "../../data/paymentData";
import CopyButton from "./CopyButton";

export default function PaymentMethodsSection() {
  return (
    <section
      id="methods"
      className="scroll-mt-28 bg-[#0B0B0C] px-6 py-16 md:px-12 md:py-24 xl:px-24"
      aria-labelledby="payment-methods-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
          <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
            How to Pay
          </p>
        </div>
        <h2
          id="payment-methods-heading"
          className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]"
        >
          Payment{" "}
          <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
            methods
          </em>
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {paymentMethods.map((method) => (
            <article
              key={method.id}
              className="relative flex flex-col rounded-[24px] border border-white/[0.08] bg-[#141417] p-7"
            >
              {method.badge ? (
                <span className="absolute right-5 top-5 rounded-full bg-[rgba(214,174,60,0.16)] px-3 py-1 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-wide text-[#D6AE3C]">
                  {method.badge}
                </span>
              ) : null}

              <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.16em] text-[#D6AE3C]">
                {method.tag}
              </p>
              <h3 className="mt-3 pr-16 font-[family-name:var(--font-dm-sans)] text-[20px] font-bold leading-snug text-[#FBF8F1]">
                {method.title}
              </h3>
              <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.5] text-[#C9C3B6]">
                {method.subtitle}
              </p>

              <dl className="mt-6 flex flex-1 flex-col">
                {method.details.map((detail) => (
                  <div
                    key={detail.key}
                    className="flex items-start justify-between gap-3 border-t border-white/[0.08] py-3"
                  >
                    <div className="min-w-0">
                      <dt className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#8F897D]">
                        {detail.key}
                      </dt>
                      <dd
                        className={`mt-1 break-all font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold leading-snug text-[#FBF8F1] ${
                          detail.monospace ? "font-mono" : ""
                        }`}
                      >
                        {detail.href ? (
                          <a
                            href={detail.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition hover:text-[#D6AE3C]"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          detail.value
                        )}
                      </dd>
                    </div>
                    <CopyButton value={detail.value} fieldLabel={detail.key} />
                  </div>
                ))}
              </dl>

              {method.href || method.details.some((d) => d.href) ? (
                <a
                  href={method.details.find((d) => d.href)?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
                >
                  Open payment link →
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
