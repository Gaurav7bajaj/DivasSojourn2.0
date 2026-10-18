import FaqsClient from "../components/faqs/FaqsClient";
import { getPublishedFaqs } from "../lib/data/faqs";

export const revalidate = 3600;

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

export default async function FaqsPage() {
  const faqItems = await getPublishedFaqs();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="bg-[#0B0B0C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqsClient items={faqItems} />
    </main>
  );
}
