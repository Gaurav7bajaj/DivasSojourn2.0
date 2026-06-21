import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogCard({ blog }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#1A1A1A] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_12px_28px_rgba(212,175,55,0.2)]">
      <Link href={`/blogs/${blog.slug}`} aria-label={`Read ${blog.title}`}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-6">
          <span className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">
            {blog.category}
          </span>
          <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight text-white">{blog.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white">{blog.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-white">
            <span>By {blog.author}</span>
            <span aria-hidden="true">|</span>
            <time dateTime={blog.datePublished}>{blog.date}</time>
            <span aria-hidden="true">|</span>
            <span>{blog.readingTime} read</span>
          </div>
          <span className="mt-5 inline-flex items-center gap-2 font-bold text-[#D4AF37] transition group-hover:text-white">
            Read More
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
