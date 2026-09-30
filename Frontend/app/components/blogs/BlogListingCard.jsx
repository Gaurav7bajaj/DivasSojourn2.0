import Link from "next/link";
import BlogCoverImage from "./BlogCoverImage";
import { badgePair, formatReadingLabel } from "./blogListingUtils";

export default function BlogListingCard({ blog }) {
  const { destination, topic } = badgePair(blog);

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[#141417] transition duration-300 hover:-translate-y-1 hover:border-[#D6AE3C]"
      aria-label={`Read ${blog.title}`}
    >
      <div className="relative h-[230px] shrink-0 overflow-hidden">
        <BlogCoverImage
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 h-full w-full"
          imageClassName="transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full border border-[rgba(214,174,60,0.55)] bg-[rgba(8,8,10,0.72)] px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.12em] text-[#D6AE3C] backdrop-blur-sm">
          {destination} · {topic}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-[22px]">
        <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]">
          <time dateTime={blog.datePublished}>{blog.date}</time>
          {" · "}
          {formatReadingLabel(blog.readingTime)}
        </p>
        <h3 className="line-clamp-3 min-h-[2.6em] font-[family-name:var(--font-playfair)] text-[22px] font-semibold leading-snug text-[#FBF8F1]">
          {blog.title}
        </h3>
        <span className="mt-auto font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition group-hover:text-[#E6BF4C]">
          Read article →
        </span>
      </div>
    </Link>
  );
}
