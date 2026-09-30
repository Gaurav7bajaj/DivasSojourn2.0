import Image from "next/image";
import { Star } from "lucide-react";
import { travelerReviews } from "../../data/travelerReviews";

/**
 * Trip stories / video testimonials.
 * filterByTrip is accepted for future trip-tagged content; falls back to featured reviews.
 */
export default function VideoTestimonials({
  filterByTrip,
  limit = 3,
  titleLead = "Hear it from",
  titleEm = "our Divas",
}) {
  const all = Array.isArray(travelerReviews) ? travelerReviews : [];
  const tripFiltered = filterByTrip
    ? all.filter(
        (review) =>
          String(review.tripId || "") === String(filterByTrip) ||
          String(review.tripSlug || "") === String(filterByTrip),
      )
    : [];
  const reviews = (tripFiltered.length ? tripFiltered : all).slice(0, limit);

  if (!reviews.length) return null;

  return (
    <section id="stories" className="scroll-mt-40" aria-labelledby="trip-stories-heading">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-[2px] w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
        <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
          Stories
        </p>
      </div>
      <h2
        id="trip-stories-heading"
        className="font-[family-name:var(--font-playfair)] text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-tight text-[#FBF8F1]"
      >
        {titleLead} <em className="italic text-[#E2BB4D]">{titleEm}</em>
      </h2>

      <div className="mt-8 grid items-stretch gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#141417]"
          >
            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-[#18181C]">
              {review.image ? (
                <Image
                  src={review.image}
                  alt={review.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover object-center"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-5">
              <div className="mb-3 flex gap-1 text-[#D6AE3C]" aria-label={`${review.rating || 5} stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-3.5 w-3.5 ${
                      index < (review.rating || 5) ? "fill-[#D6AE3C]" : "text-[#8F897D]"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="line-clamp-5 flex-1 font-[family-name:var(--font-dm-sans)] text-[14px] leading-6 text-[#D9D3C6]">
                {review.review}
              </p>
              <div className="mt-4 border-t border-white/8 pt-3">
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#FBF8F1]">
                  {review.name}
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#8F897D]">
                  {[review.destination, review.badge].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
