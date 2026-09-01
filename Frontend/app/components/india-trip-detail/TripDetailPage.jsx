import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Plane, Star } from "lucide-react";
import ShortContactForm from "../international/ShortContactForm";
import EnquiryCard from "./EnquiryCard";
import JourneyFrames from "./JourneyFrames";
import SimilarTrips from "./SimilarTrips";
import TripHero from "./TripHero";
import TripTabs from "./TripTabs";

export default function TripDetailPage({
  trip,
  similarTrips,
  basePath = "/india-trips",
  baseLabel = "India Trips",
}) {
  return (
    <main className="bg-[#F5F5F5]">
      <TripHero trip={trip} />

      <section className="border-b border-[#E8E8E8] bg-white px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 text-sm text-[#555555]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#0F9B9B]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={basePath} className="transition hover:text-[#0F9B9B]">
                  {baseLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-black text-[#D4AF37]">{trip.shortName}</li>
            </ol>
          </nav>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickBadge
              icon={<MapPin />}
              label="Route"
              value={trip.route || `${trip.pickupLocation} - ${trip.dropLocation}`}
            />
            <QuickBadge icon={<Clock3 />} label="Duration" value={`${trip.nights}N / ${trip.days}D`} />
            <QuickBadge icon={<Plane />} label="Departure" value={trip.pickupLocation} />
            <QuickBadge icon={<CalendarDays />} label="Dates" value={trip.dates} />
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-4 py-10">
        <div className="mx-auto grid max-w-7xl items-start gap-7 min-[900px]:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <TripTabs trip={trip} />
          <EnquiryCard trip={trip} />
        </div>
      </section>

      <ReviewsNotice />
      <JourneyFrames trip={trip} />
      <SimilarTrips trips={similarTrips} basePath={basePath} />
      <ShortContactForm
        pageLabel={trip.shortName || trip.title}
        storageKey="divasTripDetailLeads"
        eyebrow="Planning This Trip?"
        title="Reach Out to Us"
      />
    </main>
  );
}

function QuickBadge({ icon, label, value }) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-[#D4AF37]/20 bg-[#FFF8E1]/40 px-5 py-4 shadow-sm">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0F9B9B] text-white">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-black uppercase tracking-wide text-[#D4AF37]">{label}</span>
        <span className="mt-1 block text-sm font-bold leading-6 text-[#1A1A1A]">{value}</span>
      </span>
    </article>
  );
}

function ReviewsNotice() {
  return (
    <section className="bg-white px-4 py-14 text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">Traveler Stories</p>
        <h2 className="mt-2 text-3xl font-black md:text-5xl">Hear from our travelers</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            "Trip-specific reviews will be added after this departure is completed.",
            "Every itinerary is led and coordinated by the Divas Sojourn team.",
            "Real traveler experiences will appear here once available.",
          ].map((text) => (
            <article key={text} className="rounded-3xl border border-[#D4AF37]/25 bg-[#F9F9F9] p-6 shadow-lg">
              <div className="mb-4 flex gap-1 text-[#D4AF37]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-[#D4AF37]" aria-hidden="true" />
                ))}
              </div>
              <p className="leading-7 text-[#333333]">{text}</p>
              <p className="mt-4 font-black">Divas Sojourn</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
