import Image from "next/image";
import PersonalizedTripForm from "../components/personalize-trip/PersonalizedTripForm";

const pageUrl = "https://divassojourn.com/personalize-trip";
const heroImage =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=85";

export const metadata = {
  title: "Personalize Your Trip | Divas Sojourn",
  description:
    "Share your travel idea and preferences. Divas Sojourn will design a personalised women-focused trip tailored to how you want to travel.",
  keywords: [
    "personalised trip",
    "custom women travel",
    "bespoke itinerary",
    "women only private trip",
    "Divas Sojourn custom travel",
  ],
  alternates: {
    canonical: "/personalize-trip",
  },
  openGraph: {
    title: "Personalize Your Trip | Divas Sojourn",
    description:
      "Tell us your destination dreams, style and budget — we craft a special personalised trip for you.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: heroImage,
        width: 1200,
        height: 630,
        alt: "Personalised women travel planning with Divas Sojourn",
      },
    ],
  },
};

const highlights = [
  {
    title: "Built Around You",
    text: "Destinations, pace, stays and experiences shaped by your preferences — not a fixed group template.",
  },
  {
    title: "Women-First Planning",
    text: "Safety, comfort and community remain at the centre of every itinerary we design.",
  },
  {
    title: "End-to-End Support",
    text: "From first idea to departure day, our team stays with you through planning and travel.",
  },
];

export default function PersonalizeTripPage() {
  return (
    <main className="bg-[#1A1A1A]">
      <section className="relative min-h-[52vh] overflow-hidden md:min-h-[62vh]">
        <Image
          src={heroImage}
          alt="Personalised trip planning for women travelers"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#1A1A1A]" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-4xl flex-col items-center justify-center px-4 text-center md:min-h-[62vh]">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#D4AF37]">
            Bespoke Journeys
          </p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-6xl">Personalize Your Trip</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 md:text-lg">
            Have a destination dream, a celebration to plan, or a travel style that needs its own
            itinerary? Tell us how you want to travel — we will create a special trip just for you.
          </p>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#D4AF37]/25 bg-[#0F0F0F] p-6 text-white"
            >
              <h2 className="text-xl font-black text-[#D4AF37]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/75">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <PersonalizedTripForm />
    </main>
  );
}
