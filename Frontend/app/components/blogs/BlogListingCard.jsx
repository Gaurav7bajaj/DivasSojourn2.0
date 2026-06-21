import Image from "next/image";
import Link from "next/link";

export default function BlogListingCard({ blog }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_14px_28px_rgba(212,175,55,0.18)]">
      <Link href={`/blogs/${blog.slug}`} aria-label={`Read ${blog.title}`}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
          />
          <span className="absolute left-3 top-3 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#1A1A1A]">
            {blog.category}
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold text-[#666666]">
            <time dateTime={blog.datePublished}>{blog.date}</time> | {blog.readingTime} read
          </p>
          <h3 className="mt-3 line-clamp-3 text-lg font-black leading-7 text-[#1A1A1A]">
            {blog.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}
