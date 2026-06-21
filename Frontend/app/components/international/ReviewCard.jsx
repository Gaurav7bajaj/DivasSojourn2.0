import Image from "next/image";
import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  return (
    <article className="rounded-3xl border border-[#D4AF37]/30 bg-[#1A1A1A] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_12px_28px_rgba(212,175,55,0.2)]">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#D4AF37]">
          <Image
            src={review.image}
            alt={`${review.name}, ${review.badge}`}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">{review.name}</h3>
          <p className="font-semibold text-[#D4AF37]">{review.destination}</p>
          <p className="text-sm text-white">{review.badge}</p>
        </div>
      </div>
      <div className="mt-5 flex gap-1 text-[#D4AF37]" aria-label={`${review.rating} star review`}>
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} className="h-5 w-5 fill-current" aria-hidden="true" />
        ))}
      </div>
      <p className="mt-4 leading-7 text-white">&quot;{review.review}&quot;</p>
      <p className="mt-5 text-sm text-white">{review.date}</p>
    </article>
  );
}
