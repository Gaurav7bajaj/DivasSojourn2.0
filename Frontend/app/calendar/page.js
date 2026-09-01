import TripCalendar from "../components/calendar/TripCalendar";
import ShortContactForm from "../components/international/ShortContactForm";
import { getPublishedTrips } from "../lib/data/trips";

export const dynamic = "force-dynamic";

const pageUrl = "https://divassojourn.com/calendar";
const heroImage =
  "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1600&q=85";

export const metadata = {
  title: "Women Travel Calendar 2026 | Group Trip Schedules",
  description:
    "Plan your next adventure with the Divas Sojourn group trip calendar. Browse upcoming women-only tours, dates, schedules, and book your spot today.",
  keywords: [
    "women travel calendar",
    "trip schedules 2026",
    "women group trip dates",
    "upcoming women tours",
    "solo women travel schedule",
    "Divas Sojourn dates",
  ],
  alternates: {
    canonical: "/calendar",
  },
  openGraph: {
    title: "Women-Only Group Trip Calendar 2026 | Divas Sojourn",
    description:
      "Explore upcoming travel dates and schedules for secure and community-led group trips designed for women.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: heroImage,
        width: 1200,
        height: 630,
        alt: "Women travelers enjoying a destination together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Women-Only Group Trip Calendar 2026 | Divas Sojourn",
    description:
      "View scheduled group travel dates for women travelers across India and abroad.",
    images: [heroImage],
  },
};

export default async function CalendarPage() {
  const trips = await getPublishedTrips();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://divassojourn.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calendar",
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero Header Section */}
      <section className="relative h-[250px] w-full overflow-hidden sm:h-[350px] md:h-[400px]">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }}>
          {/* Layer Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/50 to-black/30" />
        </div>

        {/* Hero Title Container */}
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Divas Sojourn Calendar
            </h1>
            <p className="mt-3 text-sm text-white/80 sm:text-base md:text-lg max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Plan your next dream getaway. Browse our comprehensive list of scheduled women-only trips, choose your dates, and travel with like-minded divas.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Calendar Section */}
      <section className="bg-[#1A1A1A] relative z-10 -mt-4 rounded-t-3xl pt-4">
        <TripCalendar trips={trips} />
      </section>

      <ShortContactForm pageLabel="Calendar" storageKey="divasCalendarLeads" />
    </main>
  );
}
