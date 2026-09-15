import { travelerReviews } from "../../data/travelerReviews";
import ReviewCard from "./ReviewCard";

export default function TravelerReviews({
  reviews = travelerReviews,
  title = "Hear From Travelers Like You",
  subtitle = "Real Stories From Our Community",
  mapsUri = null,
}) {
  return (
    <section className="bg-[#1A1A1A] px-4 py-16" aria-labelledby="traveler-reviews-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="traveler-reviews-heading" className="text-3xl font-black text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-3 text-lg font-semibold text-white">{subtitle}</p>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {mapsUri ? (
          <p className="mt-8 text-center text-xs text-white/60">
            Reviews from Google.{" "}
            <a
              href={mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#D4AF37] underline-offset-2 hover:underline"
            >
              See all reviews on Google
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
