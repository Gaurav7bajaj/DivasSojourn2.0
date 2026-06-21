"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function FeaturedBlog({ blogs }) {
  const featuredBlogs = blogs.filter((blog) => blog.featured);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBlog = featuredBlogs[activeIndex] || blogs[0];

  const goToBlog = (direction) => {
    setActiveIndex((index) => {
      if (direction === "previous") {
        return index === 0 ? featuredBlogs.length - 1 : index - 1;
      }

      return (index + 1) % featuredBlogs.length;
    });
  };

  if (!activeBlog) {
    return null;
  }

  return (
    <section className="bg-[#1A1A1A] px-4 pb-12" aria-labelledby="featured-blog-heading">
      <div className="mx-auto max-w-7xl">
        <h2 id="featured-blog-heading" className="sr-only">
          Featured Blog
        </h2>
        <article className="grid overflow-hidden rounded-[2rem] border border-[#D4AF37]/30 bg-[#F9F9F9] p-4 shadow-2xl md:grid-cols-2 md:p-6">
          <Link href={`/blogs/${activeBlog.slug}`} className="relative min-h-[260px] overflow-hidden rounded-3xl">
            <Image
              src={activeBlog.image}
              alt={activeBlog.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </Link>

          <div className="flex flex-col justify-center p-4 md:p-8">
            <div className="flex flex-wrap gap-2">
              {(activeBlog.categories || [activeBlog.category]).slice(0, 2).map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-[#1A1A1A] px-3 py-1 text-xs font-black uppercase tracking-wide text-white"
                >
                  {category}
                </span>
              ))}
            </div>
            <Link href={`/blogs/${activeBlog.slug}`}>
              <h3 className="mt-5 text-3xl font-black leading-tight text-[#1A1A1A] md:text-4xl">
                {activeBlog.title}
              </h3>
            </Link>
            <p className="mt-4 leading-7 text-[#333333]">{activeBlog.excerpt}</p>
            <p className="mt-5 text-sm font-semibold text-[#666666]">
              <time dateTime={activeBlog.datePublished}>{activeBlog.date}</time> | Written by{" "}
              {activeBlog.author}
            </p>
            <Link
              href={`/blogs/${activeBlog.slug}`}
              className="mt-5 inline-flex items-center gap-2 font-black text-[#D4AF37] transition hover:text-[#1A1A1A]"
            >
              {activeBlog.readingTime} read
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            {featuredBlogs.length > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => goToBlog("previous")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#1A1A1A] transition hover:bg-[#D4AF37]"
                  aria-label="Show previous featured blog"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => goToBlog("next")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#1A1A1A] transition hover:bg-[#D4AF37]"
                  aria-label="Show next featured blog"
                >
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
