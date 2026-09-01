import Link from "next/link";
import { FaqAccordion, FaqHero } from "../components/faqs";
import ShortContactForm from "../components/international/ShortContactForm";
import { faqItems } from "../data/faqs";

export const metadata = {
  title: "FAQs | Divas Sojourn",
  description:
    "Find answers about safety, solo travel, room sharing, age limits, visas, payments, and group sizes for women-only trips with Divas Sojourn.",
  keywords: [
    "Divas Sojourn FAQs",
    "women only travel questions",
    "solo women travel India",
    "is it safe to travel alone",
    "ladies travel club",
  ],
  alternates: {
    canonical: "/faqs",
  },
  openGraph: {
    title: "FAQs | Divas Sojourn",
    description:
      "Everything you need to know about travelling with Divas Sojourn — safety, solo travel, visas, payments and more.",
    url: "https://divassojourn.com/faqs",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question || item.heading,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqsPage() {
  return (
    <main className="bg-[#F5F5F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqHero />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 text-sm text-[#555555]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#0F9B9B]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-black text-[#D4AF37]">FAQs</li>
            </ol>
          </nav>

          <p className="mb-6 text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">
            Common Questions
          </p>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      <ShortContactForm
        pageLabel="FAQs"
        storageKey="divasFaqLeads"
        eyebrow="Still Have Questions?"
        title="Reach Out to Us"
      />
    </main>
  );
}
