import Image from "next/image";
import Link from "next/link";
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

const heroPoints = [
  {
    lead: "Built around you",
    text: " — destinations, pace, stays and experiences shaped by your preferences.",
  },
  {
    lead: "Women-first planning",
    text: " — safety, comfort and community at the centre of every itinerary.",
  },
  {
    lead: "End-to-end support",
    text: " — from first idea to departure day, our team stays with you.",
  },
];

export default function PersonalizeTripPage() {
  return (
    <main className="bg-[#0B0B0C]">
      <section className="bg-[#0B0B0C] px-5 pb-10 pt-10 md:px-12 md:pb-10 md:pt-16 xl:px-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
          {/* Image first on mobile */}
          <div className="relative order-1 h-[260px] overflow-hidden rounded-[28px] border border-[rgba(214,174,60,0.22)] lg:order-2 lg:h-[560px]">
            <Image
              src={heroImage}
              alt="Personalised trip planning for women travelers"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 460px"
              className="object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-[rgba(214,174,60,0.35)] bg-[rgba(12,12,14,0.86)] p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(214,174,60,0.14)] text-[#D6AE3C]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
                <div>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#FBF8F1]">
                    Takes about 2 minutes
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
                    3 quick steps · no payment needed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 flex flex-col gap-5 lg:order-1">
            <nav
              className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]"
              aria-label="Breadcrumb"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="transition hover:text-[#D6AE3C]">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-[#D6AE3C]">Personalize Trip</li>
              </ol>
            </nav>

            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Bespoke journeys
              </p>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,6vw,4.75rem)] font-semibold leading-none tracking-[-0.015em] text-[#FBF8F1]">
              Personalize{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                your trip
              </em>
            </h1>

            <p className="max-w-[580px] font-[family-name:var(--font-dm-sans)] text-[17px] leading-[1.55] text-[#D9D3C6] md:text-[19px]">
              Have a destination dream, a celebration to plan, or a travel style that needs its own
              itinerary? Tell us how you want to travel — we will create a special trip just for
              you.
            </p>

            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {heroPoints.map((point) => (
                <li key={point.lead} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(214,174,60,0.16)] text-[#D6AE3C]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-snug text-[#D9D3C6]">
                    <strong className="font-bold text-[#FBF8F1]">{point.lead}</strong>
                    {point.text}
                  </p>
                </li>
              ))}
            </ul>

            <div>
              <a
                href="#planner"
                className="inline-flex h-[54px] items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
              >
                Start planning →
              </a>
            </div>
          </div>
        </div>
      </section>

      <PersonalizedTripForm />
    </main>
  );
}
