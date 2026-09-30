"use client";

import Link from "next/link";
import { Minus, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { faqItems } from "../../data/faqs";

const WHATSAPP_URL = "https://wa.me/919990022835";
const PHONE_DISPLAY = "+91-99900 22835";
const PHONE_HREF = "tel:+919990022835";
const POPULAR = ["Safety", "Room sharing", "Payments"];
const ALL_TOPIC = "all";

function useDebouncedValue(value, delay = 150) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function buildTopics(items) {
  const counts = new Map();
  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) || 0) + 1);
  }
  return [
    { id: ALL_TOPIC, label: "All questions", count: items.length },
    ...Array.from(counts.entries()).map(([label, count]) => ({
      id: label,
      label,
      count,
    })),
  ];
}

function topicTagLabel(category) {
  return category.toUpperCase();
}

export default function FaqsClient() {
  const searchId = useId();
  const topics = useMemo(() => buildTopics(faqItems), []);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(ALL_TOPIC);
  const [openId, setOpenId] = useState(faqItems[0]?.id ?? null);
  const [hashHandled, setHashHandled] = useState(false);
  const itemRefs = useRef({});
  const debouncedQuery = useDebouncedValue(query, 150);
  const trimmedQuery = debouncedQuery.trim();
  const isSearching = trimmedQuery.length > 0;

  const filteredItems = useMemo(() => {
    let list = faqItems;
    if (isSearching) {
      const q = trimmedQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      );
    } else if (topic !== ALL_TOPIC) {
      list = list.filter((item) => item.category === topic);
    }
    return list;
  }, [isSearching, trimmedQuery, topic]);

  useEffect(() => {
    if (!filteredItems.length) {
      setOpenId(null);
      return;
    }
    setOpenId((current) =>
      filteredItems.some((item) => item.id === current) ? current : filteredItems[0].id,
    );
  }, [filteredItems]);

  useEffect(() => {
    if (hashHandled || typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) {
      setHashHandled(true);
      return;
    }
    const match = faqItems.find((item) => item.id === hash);
    if (match) {
      setTopic(ALL_TOPIC);
      setQuery("");
      setOpenId(match.id);
      window.requestAnimationFrame(() => {
        itemRefs.current[match.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
    setHashHandled(true);
  }, [hashHandled]);

  const selectTopic = useCallback((nextTopic) => {
    setTopic(nextTopic);
    setQuery("");
  }, []);

  const onSearchChange = (value) => {
    setQuery(value);
    setTopic(ALL_TOPIC);
  };

  const fillPopular = (term) => {
    setQuery(term);
    setTopic(ALL_TOPIC);
  };

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const listTitle = isSearching
    ? "Search results"
    : topic === ALL_TOPIC
      ? "All questions"
      : topic;

  return (
    <>
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-[#0B0B0C] px-6 pb-10 pt-16 md:px-12 md:pb-14 md:pt-16 xl:px-24">
        <div className="mx-auto grid max-w-[1280px] items-end gap-10 lg:grid-cols-[1fr_520px] lg:gap-16">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]"
            >
              <Link href="/" className="transition hover:text-[#D6AE3C]">
                Home
              </Link>
              <span className="mx-2 text-white/30" aria-hidden="true">
                /
              </span>
              <span className="text-[#FBF8F1]">FAQs</span>
            </nav>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Got Questions?
              </p>
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[40px] font-semibold leading-[1.08] text-[#FBF8F1] md:text-[clamp(2.75rem,5vw,4.5rem)]">
              Frequently asked{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                questions
              </em>
            </h1>

            <p className="mt-5 max-w-xl font-[family-name:var(--font-dm-sans)] text-[18px] leading-[1.55] text-[#D9D3C6]">
              Everything you need to know before you travel with us — from safety and room sharing
              to visas and payments.
            </p>
          </div>

          <div>
            <label
              htmlFor={searchId}
              className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#C9C3B6]"
            >
              Search the FAQs
            </label>
            <div className="relative mt-2">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#D6AE3C]"
                aria-hidden="true"
              />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={'Try "visa", "room", "payment"…'}
                className="h-14 w-full rounded-full border border-[rgba(255,255,255,0.14)] bg-[#141417] py-3 pl-14 pr-5 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1] outline-none transition placeholder:text-[#8F897D] focus:border-[#D6AE3C] focus:ring-2 focus:ring-[#D6AE3C]/35"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]">
                Popular:
              </span>
              {POPULAR.map((term, index) => (
                <span key={term} className="inline-flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fillPopular(term)}
                    className="min-h-11 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
                  >
                    {term}
                  </button>
                  {index < POPULAR.length - 1 ? (
                    <span className="text-[#8F897D]" aria-hidden="true">
                      ·
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <section className="bg-[#0B0B0C] px-6 pb-0 pt-10 md:px-12 md:pt-12 xl:px-24">
        <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[280px_1fr] lg:gap-14">
          {/* Topics — chips on mobile, sticky sidebar on desktop */}
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-3 hidden font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.2em] text-[#8F897D] lg:block">
              Topics
            </p>
            <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:rounded-[20px] lg:border lg:border-white/[0.08] lg:bg-[#121215] lg:p-3 lg:px-3">
              {topics.map((item) => {
                const isActive = !isSearching && topic === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => selectTopic(item.id)}
                    className={`inline-flex h-11 shrink-0 items-center justify-between gap-3 rounded-xl px-4 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold transition lg:w-full ${
                      isActive
                        ? "bg-[rgba(214,174,60,0.14)] text-[#ECC95E]"
                        : "bg-[#141417] text-[#C9C3B6] hover:text-[#FBF8F1] lg:bg-transparent"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`text-[12px] tabular-nums ${
                        isActive ? "text-[#ECC95E]" : "text-[#8F897D]"
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div>
            <div className="mb-6 flex flex-wrap items-baseline gap-3">
              <h2 className="font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-[#FBF8F1] md:text-[32px]">
                {listTitle}
              </h2>
              <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#8F897D]">
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "question" : "questions"}
              </p>
            </div>

            {filteredItems.length === 0 ? (
              <div
                className="rounded-[18px] border border-dashed border-[rgba(214,174,60,0.55)] px-6 py-10 text-center"
                role="status"
              >
                <p className="font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.6] text-[#D9D3C6]">
                  No questions match &ldquo;{trimmedQuery}&rdquo;. Try another word, or ask us
                  directly below.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredItems.map((item) => {
                  const isOpen = openId === item.id;
                  const panelId = `faq-panel-${item.id}`;
                  const buttonId = `faq-button-${item.id}`;

                  return (
                    <article
                      key={item.id}
                      id={item.id}
                      ref={(node) => {
                        itemRefs.current[item.id] = node;
                      }}
                      className={`overflow-hidden rounded-[18px] border bg-[#141417] transition-colors duration-200 ${
                        isOpen
                          ? "border-[rgba(214,174,60,0.55)]"
                          : "border-white/[0.08] hover:border-[rgba(214,174,60,0.35)]"
                      }`}
                    >
                      <h3 className="m-0">
                        <button
                          type="button"
                          id={buttonId}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => toggle(item.id)}
                          className="flex w-full min-h-[72px] items-start gap-3 px-5 py-[18px] text-left md:items-center md:gap-4 md:px-6 md:pr-[22px] md:pl-6"
                        >
                          <span className="hidden w-24 shrink-0 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#D6AE3C] md:block">
                            {topicTagLabel(item.category)}
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col gap-2">
                            <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#D6AE3C] md:hidden">
                              {topicTagLabel(item.category)}
                            </span>
                            <span className="font-[family-name:var(--font-dm-sans)] text-[17px] font-semibold leading-snug text-[#FBF8F1] md:text-[18px]">
                              {item.question}
                            </span>
                          </span>
                          <span
                            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D6AE3C] text-[#D6AE3C] md:mt-0"
                            aria-hidden="true"
                          >
                            {isOpen ? (
                              <Minus className="h-4 w-4" strokeWidth={2.5} />
                            ) : (
                              <Plus className="h-4 w-4" strokeWidth={2.5} />
                            )}
                          </span>
                        </button>
                      </h3>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-200 motion-safe:ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.7] text-[#D9D3C6] md:px-[84px] md:pb-6 md:pl-[138px] md:pr-[84px]">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="bg-[#0B0B0C] px-6 pb-20 pt-16 md:px-12 md:pb-24 md:pt-24 xl:px-24"
        aria-labelledby="faq-cta-heading"
      >
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 rounded-[28px] border border-[rgba(214,174,60,0.28)] bg-[#121215] px-6 py-10 md:grid-cols-[1fr_auto] md:gap-12 md:px-12 md:py-11">
          <div>
            <h2
              id="faq-cta-heading"
              className="font-[family-name:var(--font-playfair)] text-[32px] font-semibold leading-tight text-[#FBF8F1] md:text-[40px]"
            >
              Still have{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                questions?
              </em>
            </h2>
            <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[17px] leading-[1.55] text-[#D9D3C6]">
              Talk to a real person from our team — we&apos;re happy to help.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={PHONE_HREF}
              className="inline-flex h-14 items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] px-6 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
            >
              Call {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] px-6 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
            >
              WhatsApp us
            </a>
            <Link
              href="/about-us#reach-out"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#D6AE3C] px-6 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Send a message →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
