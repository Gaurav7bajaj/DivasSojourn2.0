import { Star } from "lucide-react";
import { reviews } from "../../data/mockData";

const platformLogos = {
  Google: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  ),
  TripAdvisor: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="#00AF87" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 6 6 0 0 0 6-5.998 5.982 5.982 0 0 0-1.957-4.432L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM12 6.255c1.531 0 3.063.303 4.504.903C13.943 8.138 12 10.43 12 13.1c0-2.671-1.942-4.962-4.504-5.942A11.72 11.72 0 0 1 12 6.256zM6.002 9.157a4.059 4.059 0 1 1 0 8.118 4.059 4.059 0 0 1 0-8.118zm11.992.002a4.057 4.057 0 1 1 .003 8.115 4.057 4.057 0 0 1-.003-8.115zm-11.992 1.93a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256zm11.992 0a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256z" />
    </svg>
  ),
  Facebook: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};

export default function ReviewsSection() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-10" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="sr-only">
        Customer reviews
      </h2>
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.platform}
            className="rounded-3xl border border-[#D4AF37]/30 bg-[#1A1A1A] p-6 text-center shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_8px_20px_rgba(212,175,55,0.2)]"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
              {platformLogos[review.platform]}
            </div>
            <h3 className="text-lg font-bold text-white">{review.platform} Reviews</h3>
            <div
              className="mt-2 flex items-center justify-center gap-1 text-[#D4AF37]"
              aria-label={`${review.rating} star rating`}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
              ))}
              <span className="ml-2 font-bold text-white">{review.rating.toFixed(1)}</span>
            </div>
            <p className="mt-2 text-sm text-white">
              ({review.count.toLocaleString("en-IN")} reviews)
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
