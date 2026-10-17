export default function LegalPage({ title, children }) {
  return (
    <main className="bg-[#0B0B0C] text-white">
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
          Divas Sojourn
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-white md:text-5xl">
          {title}
        </h1>
        <div className="mt-10 space-y-10 text-[15px] leading-7 text-white/80">
          {children}
        </div>
      </section>
    </main>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-wide text-[#D4AF37]">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
