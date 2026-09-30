import TravelSavingClient from "../components/travel-saving-plan/TravelSavingClient";
import { travelSavingFaqs, travelSavingIntro } from "../data/travelSavingPlan";

export const metadata = {
  title: "Travel Saving Plan | Divas Sojourn",
  description: travelSavingIntro.paragraphs.join(" "),
  keywords: [
    "travel saving plan",
    "monthly travel savings",
    "women only travel packages",
    "Divas Sojourn savings",
    "solo women travel India",
  ],
  alternates: {
    canonical: "/travel-saving-plan",
  },
  openGraph: {
    title: "Divas Sojourn Travel Saving Plan",
    description:
      "A simple monthly savings scheme for women who love to travel. Save consistently and unlock bonus travel value.",
    url: "https://divassojourn.com/travel-saving-plan",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: travelSavingFaqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function TravelSavingPlanPage() {
  return (
    <main className="bg-[#0B0B0C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <TravelSavingClient />
    </main>
  );
}
