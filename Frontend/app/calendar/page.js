import { Suspense } from "react";
import TripCalendar from "../components/calendar/TripCalendar";
import CalendarHero from "../components/calendar/CalendarHero";
import ShortContactForm from "../components/international/ShortContactForm";
import { getPublishedTrips } from "../lib/data/trips";
import { calendarHeroImages } from "../data/heroImages";

export const dynamic = "force-dynamic";

const pageUrl = "https://divassojourn.com/calendar";
const heroImage = `https://divassojourn.com${(calendarHeroImages[0]?.src || "/heroes/calendar/calendarHero1.webp").split("?")[0]}`;

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
    <main className="min-h-screen bg-[#0B0B0C] text-[#FBF8F1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <CalendarHero />

      <Suspense
        fallback={
          <div className="px-5 py-16 font-[family-name:var(--font-dm-sans)] text-[#C9C3B6] md:px-12 xl:px-24">
            Loading calendar…
          </div>
        }
      >
        <TripCalendar trips={trips} />
      </Suspense>

      <ShortContactForm pageLabel="Calendar" storageKey="divasCalendarLeads" />
    </main>
  );
}
