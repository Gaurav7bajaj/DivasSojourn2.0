"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BlogCoverImage from "./BlogCoverImage";
import {
  badgePair,
  formatReadingLabel,
  matchesSearch,
  resolveTopic,
  topicChipLabel,
} from "./blogListingUtils";

const PAGE_SIZE = 9;
const ALL_DEST = "all";
const ALL_TOPIC = "all";

function Chip({ pressed, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex h-[42px] shrink-0 items-center rounded-full px-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold transition ${
        pressed
          ? "bg-[#D6AE3C] text-[#1A1405]"
          : "border border-[rgba(245,241,232,0.2)] text-[#D6AE3C] hover:border-[#D6AE3C] hover:text-[#E6BF4C]"
      }`}
    >
      {children}
    </button>
  );
}

function LatestCard({ blog }) {
  const { destination, topic } = badgePair(blog);
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex gap-3.5 rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[#141417] p-3 transition hover:border-[#D6AE3C]"
    >
      <BlogCoverImage
        src={blog.image}
        alt={blog.title}
        className="h-[120px] w-[120px] shrink-0 rounded-xl"
        imageClassName="transition duration-500 group-hover:scale-105"
        sizes="120px"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5">
        <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.12em] text-[#D6AE3C]">
          {destination}
        </span>
        <h3 className="line-clamp-3 font-[family-name:var(--font-playfair)] text-[16px] font-bold leading-snug text-[#FBF8F1]">
          {blog.title}
        </h3>
        <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#8F897D]">
          <time dateTime={blog.datePublished}>{blog.date}</time>
          {" · "}
          {formatReadingLabel(blog.readingTime)}
        </p>
        <span className="sr-only">{topic}</span>
      </div>
    </Link>
  );
}

function ArticleCard({ blog }) {
  const { destination, topic } = badgePair(blog);
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[#141417] transition duration-300 hover:-translate-y-1 hover:border-[#D6AE3C]"
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

function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const onSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      return;
    }
    // TODO: wire to newsletter provider (Mailchimp / Beehiiv / etc.) when available.
    setStatus("success");
    setEmail("");
  };

  return (
    <section
      className="mt-24 grid gap-8 rounded-[28px] border border-[rgba(214,174,60,0.3)] bg-[#121215] px-6 py-10 md:px-[52px] md:py-11 lg:grid-cols-[1fr_520px] lg:items-center"
      aria-labelledby="blog-newsletter-heading"
    >
      <div>
        <h2
          id="blog-newsletter-heading"
          className="font-[family-name:var(--font-playfair)] text-[clamp(1.75rem,3vw,2.375rem)] font-semibold leading-tight text-[#FBF8F1]"
        >
          Get new stories <em className="italic text-[#E2BB4D]">in your inbox</em>
        </h2>
        <p className="mt-3 max-w-xl font-[family-name:var(--font-dm-sans)] text-[16px] leading-7 text-[#D9D3C6]">
          One email a month — new guides, upcoming departures and community moments. No spam.
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="blog-newsletter-email">
          Email address
        </label>
        <input
          id="blog-newsletter-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="you@email.com"
          autoComplete="email"
          className="h-14 min-h-11 flex-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0F0F12] px-5 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1] outline-none placeholder:text-[#8F897D] focus:border-[#D6AE3C] focus:ring-2 focus:ring-[#D6AE3C]/35"
        />
        <button
          type="submit"
          className="inline-flex h-14 min-h-11 shrink-0 items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
        >
          Subscribe
        </button>
      </form>
      {status === "success" ? (
        <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#D6AE3C] lg:col-span-2" role="status">
          Thanks — you&apos;re on the list.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-red-300 lg:col-span-2" role="alert">
          Please enter a valid email address.
        </p>
      ) : null}
    </section>
  );
}

export default function BlogsListingClient({ blogs }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const qParam = searchParams.get("q") || "";
  const destParam = searchParams.get("destination") || "";
  const topicParam = searchParams.get("topic") || "";

  const [searchInput, setSearchInput] = useState(qParam);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  const destinations = useMemo(() => {
    const set = new Set();
    blogs.forEach((blog) => {
      if (blog.destination && blog.destination !== "All Destinations") {
        set.add(blog.destination);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  const topics = useMemo(() => {
    const set = new Set();
    blogs.forEach((blog) => {
      set.add(resolveTopic(blog));
    });
    return Array.from(set).sort((a, b) =>
      topicChipLabel(a).localeCompare(topicChipLabel(b)),
    );
  }, [blogs]);

  const selectedDestination = useMemo(() => {
    if (!destParam) return ALL_DEST;
    const match = destinations.find((d) => d.toLowerCase() === destParam.toLowerCase());
    return match || ALL_DEST;
  }, [destParam, destinations]);

  const selectedTopic = useMemo(() => {
    if (!topicParam) return ALL_TOPIC;
    const byValue = topics.find((t) => t.toLowerCase() === topicParam.toLowerCase());
    if (byValue) return byValue;
    const byLabel = topics.find(
      (t) => topicChipLabel(t).toLowerCase() === topicParam.toLowerCase(),
    );
    return byLabel || ALL_TOPIC;
  }, [topicParam, topics]);

  const updateParams = useCallback(
    (patch) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (!value || value === ALL_DEST || value === ALL_TOPIC) params.delete(key);
        else params.set(key, value);
      });
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      setVisibleCount(PAGE_SIZE);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      const next = searchInput.trim();
      const current = (searchParams.get("q") || "").trim();
      if (next === current) return;
      updateParams({ q: next || null });
    }, 300);
    return () => clearTimeout(handle);
  }, [searchInput, searchParams, updateParams]);

  const featuredPost = useMemo(() => {
    return blogs.find((blog) => blog.featured) || blogs[0] || null;
  }, [blogs]);

  const latestPosts = useMemo(() => {
    return blogs
      .filter((blog) => !featuredPost || blog.slug !== featuredPost.slug)
      .slice(0, 3);
  }, [blogs, featuredPost]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const destinationMatches =
        selectedDestination === ALL_DEST ||
        blog.destination === selectedDestination ||
        (blog.categories || []).includes(selectedDestination);
      const topic = resolveTopic(blog);
      const topicMatches = selectedTopic === ALL_TOPIC || topic === selectedTopic;
      const searchMatches = matchesSearch(blog, qParam);
      return destinationMatches && topicMatches && searchMatches;
    });
  }, [blogs, qParam, selectedDestination, selectedTopic]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedDestination, selectedTopic, qParam]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredBlogs.length;
  const featuredBadges = featuredPost ? badgePair(featuredPost) : null;

  const clearFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="bg-[#0B0B0C] text-[#FBF8F1]">
      {/* Header */}
      <header className="flex flex-col gap-10 px-5 pb-10 pt-16 md:px-12 xl:flex-row xl:items-end xl:justify-between xl:px-24 xl:pb-10 xl:pt-16">
        <div className="max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#D6AE3C]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#C9C3B6]" aria-current="page">
                Blogs
              </li>
            </ol>
          </nav>
          <div className="mt-5 h-0.5 w-9 bg-[#D6AE3C]" aria-hidden="true" />
          <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
            The Divas Journal
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-[1.05] text-[#FBF8F1]">
            Travel stories <em className="italic text-[#E2BB4D]">&amp; guides</em>
          </h1>
          <p className="mt-4 max-w-xl font-[family-name:var(--font-dm-sans)] text-[18px] leading-8 text-[#D9D3C6]">
            Destination guides, packing lists and real stories from our community of women travellers.
          </p>
        </div>

        <div className="w-full xl:w-[440px]">
          <label
            htmlFor="blog-search"
            className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
          >
            Search articles
          </label>
          <div className="flex h-14 items-center gap-3 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#141417] px-5 transition focus-within:border-[#D6AE3C] focus-within:ring-2 focus-within:ring-[#D6AE3C]/35">
            <Search className="h-5 w-5 shrink-0 text-[#D6AE3C]" aria-hidden="true" />
            <input
              id="blog-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={'Try "Spiti", "packing", "Japan"…'}
              className="w-full bg-transparent font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1] outline-none placeholder:text-[#8F897D]"
            />
          </div>
        </div>
      </header>

      {/* Featured + Latest */}
      <section
        className="grid gap-6 px-5 md:px-12 xl:grid-cols-[2fr_1fr] xl:gap-6 xl:px-24"
        aria-labelledby="featured-blog-heading"
      >
        <h2 id="featured-blog-heading" className="sr-only">
          Featured and latest posts
        </h2>

        {featuredPost ? (
          <Link
            href={`/blogs/${featuredPost.slug}`}
            className="group relative block h-[420px] overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.08)] transition hover:border-[#D6AE3C] md:h-[520px]"
          >
            <BlogCoverImage
              src={featuredPost.image}
              alt={featuredPost.title}
              className="absolute inset-0 h-full w-full"
              imageClassName="transition duration-700 group-hover:scale-105"
              sizes="(max-width: 1280px) 100vw, 66vw"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,10,0.95)] via-[rgba(8,8,10,0.45)] to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#D6AE3C] px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A1405]">
                  Editor&apos;s Pick
                </span>
                <span className="rounded-full border border-[#D6AE3C] bg-[rgba(8,8,10,0.75)] px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.12em] text-[#D6AE3C]">
                  {featuredBadges.destination} · {featuredBadges.topic}
                </span>
              </div>
              <h3 className="mt-4 max-w-[720px] font-[family-name:var(--font-playfair)] text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-tight text-[#FBF8F1]">
                {featuredPost.title}
              </h3>
              <p className="mt-3 max-w-2xl line-clamp-2 font-[family-name:var(--font-dm-sans)] text-[16px] leading-7 text-[#D9D3C6]">
                {featuredPost.excerpt}
              </p>
              <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]">
                <time dateTime={featuredPost.datePublished}>{featuredPost.date}</time>
                {" · By "}
                {featuredPost.author}
                {" · "}
                {formatReadingLabel(featuredPost.readingTime)}
              </p>
              <span className="mt-3 inline-flex font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#D6AE3C] transition group-hover:text-[#E6BF4C]">
                Read the guide →
              </span>
            </div>
          </Link>
        ) : null}

        <aside className="flex flex-col gap-3">
          <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.2em] text-[#8F897D]">
            Latest
          </p>
          <div className="flex flex-col gap-3">
            {latestPosts.map((blog) => (
              <LatestCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </aside>
      </section>

      {/* Filters */}
      <section
        className="mt-16 border-y border-[rgba(255,255,255,0.08)] px-5 py-[18px] md:px-12 xl:mt-[72px] xl:px-24"
        aria-label="Filter articles"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <span className="w-[110px] shrink-0 font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.14em] text-[#8F897D]">
              Destination
            </span>
            <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip
                pressed={selectedDestination === ALL_DEST}
                onClick={() => updateParams({ destination: null })}
              >
                All destinations
              </Chip>
              {destinations.map((destination) => (
                <Chip
                  key={destination}
                  pressed={selectedDestination === destination}
                  onClick={() => updateParams({ destination })}
                >
                  {destination}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
              <span className="w-[110px] shrink-0 font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.14em] text-[#8F897D]">
                Topic
              </span>
              <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <Chip
                  pressed={selectedTopic === ALL_TOPIC}
                  onClick={() => updateParams({ topic: null })}
                >
                  All topics
                </Chip>
                {topics.map((topic) => (
                  <Chip
                    key={topic}
                    pressed={selectedTopic === topic}
                    onClick={() => updateParams({ topic: topicChipLabel(topic) })}
                  >
                    {topicChipLabel(topic)}
                  </Chip>
                ))}
              </div>
            </div>
            <p className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D] lg:text-right">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-5 pb-8 pt-10 md:px-12 xl:px-24" aria-label="All articles">
        {visibleBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {visibleBlogs.map((blog) => (
              <ArticleCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-[#D6AE3C]/60 bg-[#121215] px-6 py-16 text-center">
            <p className="font-[family-name:var(--font-playfair)] text-[22px] text-[#FBF8F1]">
              No articles match these filters yet.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex h-11 min-h-11 items-center rounded-full border border-[#D6AE3C] px-6 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition hover:bg-[rgba(214,174,60,0.12)]"
            >
              Clear filters
            </button>
          </div>
        )}

        {canLoadMore ? (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="inline-flex h-12 min-h-11 items-center rounded-full border border-[#D6AE3C] px-8 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition hover:bg-[rgba(214,174,60,0.12)] hover:text-[#E6BF4C]"
            >
              Load more articles
            </button>
          </div>
        ) : null}

        <NewsletterStrip />
      </section>
    </div>
  );
}
