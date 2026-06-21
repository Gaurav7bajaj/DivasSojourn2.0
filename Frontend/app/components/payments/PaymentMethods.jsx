import { paymentMethods } from "../../data/paymentData";

export default function PaymentMethods() {
  return (
    <div className="space-y-5">
      {paymentMethods.map((method) => (
        <article
          key={method.id}
          className="rounded-2xl border border-[#D4AF37]/20 bg-[#F9F9F9] p-6 text-[#1A1A1A] shadow-lg"
        >
          <span className="inline-flex rounded-full bg-[#1A1A1A] px-4 py-1.5 text-xs font-black uppercase tracking-wide text-white">
            {method.label}
          </span>
          <dl className="mt-4 space-y-3">
            {method.details.map((detail) => (
              <div key={detail.key} className="grid gap-1 sm:grid-cols-[180px_1fr]">
                <dt className="text-sm font-black text-[#1A1A1A]">{detail.key}:</dt>
                <dd
                  className={`break-words text-sm leading-6 text-[#333333] ${
                    detail.monospace ? "font-mono" : ""
                  }`}
                >
                  {detail.href ? (
                    <a
                      href={detail.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#0F9B9B] underline-offset-4 hover:underline"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}
