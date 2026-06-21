"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { useState } from "react";
import { indiaTripsData } from "../data/indiaTrips";
import { internationalDestinations } from "../data/internationalTrips";
import { curatedEscapes } from "../data/curatedEscapes";
import { navLinks, tripMenus } from "../data/mockData";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInternationalOpen, setIsInternationalOpen] = useState(false);
  const [isIndiaOpen, setIsIndiaOpen] = useState(false);
  const [isCuratedOpen, setIsCuratedOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 bg-[#000000] text-white shadow-xl"
      style={{ backgroundColor: "#000000" }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center gap-4 bg-[#000000] px-4 py-3 lg:px-8"
        aria-label="Primary navigation"
        style={{ backgroundColor: "#000000" }}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label="Divas Sojourn home">
          <Image
            src="/divas-sojourn-logo.png"
            alt="Divas Sojourn"
            width={220}
            height={54}
            priority
            className="h-12 w-auto object-contain"
            style={{ width: "auto" }}
          />
        </Link>

        <label className="hidden min-w-64 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2 text-sm text-[#1A1A1A] md:flex lg:max-w-sm">
          <Search className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
          <span className="sr-only">Search destinations</span>
          <input
            type="search"
            placeholder="Where do you want to go?"
            className="w-full bg-transparent outline-none placeholder:text-neutral-500"
          />
        </label>

        <div className="ml-auto hidden items-center gap-5 text-sm font-medium xl:flex" style={{ color: "#FFFFFF" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#D4AF37]"
              style={{ color: "#FFFFFF" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="tel:+919990022835"
          className="hidden items-center gap-2 rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-bold text-[#0F0F0F] transition-all duration-300 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)] lg:flex"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          +91-99900 22835
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="ml-auto rounded-full border border-white/15 p-2 text-white xl:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <nav
        className="hidden border-t border-[#D4AF37]/20 bg-[#000000] px-4 py-3 md:block"
        aria-label="Trip categories"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="mx-auto flex max-w-7xl justify-center gap-10" style={{ color: "#FFFFFF" }}>
          {tripMenus.map((item) =>
            item.href === "/international-trips" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="relative flex items-center gap-1 text-sm font-semibold text-white transition hover:text-[#D4AF37]"
                  style={{ color: "#FFFFFF" }}
                >
                  {item.label}
                  <ChevronDown
                    className="h-4 w-4 transition group-hover:rotate-180"
                    aria-hidden="true"
                  />
                  <span className="absolute mt-8 h-0.5 w-0 bg-[#D4AF37] transition-all group-hover:w-32" />
                </Link>

                <div className="invisible absolute left-1/2 top-full w-[620px] -translate-x-1/2 translate-y-3 rounded-3xl border-l-4 border-t-4 border-[#D4AF37] bg-[#F9F9F9] p-4 text-[#333333] opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-5 group-hover:opacity-100">
                  <div className="grid grid-cols-3 gap-2">
                    {internationalDestinations.map((destination) => (
                      <Link
                        key={destination.slug}
                        href={`/international-trips/${destination.slug}`}
                        className="rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-[#F5E6D3] hover:text-[#1A1A1A]"
                      >
                        {destination.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : item.href === "/india-trips" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="relative flex items-center gap-1 text-sm font-semibold text-white transition hover:text-[#D4AF37]"
                  style={{ color: "#FFFFFF" }}
                >
                  {item.label}
                  <ChevronDown
                    className="h-4 w-4 transition group-hover:rotate-180"
                    aria-hidden="true"
                  />
                  <span className="absolute mt-8 h-0.5 w-0 bg-[#D4AF37] transition-all group-hover:w-24" />
                </Link>

                <div className="invisible absolute left-1/2 top-full w-[720px] -translate-x-1/2 translate-y-3 rounded-3xl border-l-4 border-t-4 border-[#D4AF37] bg-[#F9F9F9] p-4 text-[#333333] opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-5 group-hover:opacity-100">
                  <div className="grid grid-cols-3 gap-2">
                    {indiaTripsData.map((trip) => (
                      <Link
                        key={trip.slug}
                        href={`/india-trips/${trip.slug}`}
                        className="rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-[#F5E6D3] hover:text-[#1A1A1A]"
                      >
                        {trip.shortName}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : item.href === "/curated-escapes" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="relative flex items-center gap-1 text-sm font-semibold text-white transition hover:text-[#D4AF37]"
                  style={{ color: "#FFFFFF" }}
                >
                  {item.label}
                  <ChevronDown
                    className="h-4 w-4 transition group-hover:rotate-180"
                    aria-hidden="true"
                  />
                  <span className="absolute mt-8 h-0.5 w-0 bg-[#D4AF37] transition-all group-hover:w-28" />
                </Link>

                <div className="invisible absolute left-1/2 top-full w-[640px] -translate-x-1/2 translate-y-3 rounded-3xl border-l-4 border-t-4 border-[#D4AF37] bg-[#F9F9F9] p-4 text-[#333333] opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-5 group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-2">
                    {curatedEscapes.map((escape) => (
                      <Link
                        key={escape.slug}
                        href={`/curated-escapes/${escape.slug}`}
                        className="rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-[#F5E6D3] hover:text-[#1A1A1A]"
                      >
                        {escape.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-1 text-sm font-semibold text-white transition hover:text-[#D4AF37]"
                style={{ color: "#FFFFFF" }}
              >
                {item.label}
                <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" aria-hidden="true" />
                <span className="absolute mt-8 h-0.5 w-0 bg-[#D4AF37] transition-all group-hover:w-24" />
              </Link>
            ),
          )}
        </div>
      </nav>

      {isOpen && (
        <div
          className="space-y-5 border-t border-white/10 bg-[#000000] px-4 py-5 xl:hidden"
          style={{ backgroundColor: "#000000" }}
        >
          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2 text-sm text-[#1A1A1A]">
            <Search className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            <span className="sr-only">Search destinations</span>
            <input
              type="search"
              placeholder="Where do you want to go?"
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
            />
          </label>

          <div className="grid gap-3 text-sm font-medium text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-3 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                {link.label}
              </Link>
            ))}

            {tripMenus.map((link) =>
              link.href === "/international-trips" ? (
                <div key={link.href} className="rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsInternationalOpen((value) => !value)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:text-[#D4AF37]"
                    aria-expanded={isInternationalOpen}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition ${isInternationalOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isInternationalOpen && (
                    <div className="grid gap-2 border-t border-white/10 bg-black p-3 sm:grid-cols-2">
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl px-3 py-2 text-[#D4AF37]"
                      >
                        View all International Trips
                      </Link>
                      {internationalDestinations.map((destination) => (
                        <Link
                          key={destination.slug}
                          href={`/international-trips/${destination.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="rounded-xl px-3 py-2 transition hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                        >
                          {destination.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.href === "/india-trips" ? (
                <div key={link.href} className="rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsIndiaOpen((value) => !value)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:text-[#D4AF37]"
                    aria-expanded={isIndiaOpen}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition ${isIndiaOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isIndiaOpen && (
                    <div className="grid gap-2 border-t border-white/10 bg-black p-3 sm:grid-cols-2">
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl px-3 py-2 text-[#D4AF37]"
                      >
                        View all India Trips
                      </Link>
                      {indiaTripsData.map((trip) => (
                        <Link
                          key={trip.slug}
                          href={`/india-trips/${trip.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="rounded-xl px-3 py-2 transition hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                        >
                          {trip.shortName}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.href === "/curated-escapes" ? (
                <div key={link.href} className="rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCuratedOpen((value) => !value)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:text-[#D4AF37]"
                    aria-expanded={isCuratedOpen}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition ${isCuratedOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isCuratedOpen && (
                    <div className="grid gap-2 border-t border-white/10 bg-black p-3 sm:grid-cols-2">
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl px-3 py-2 text-[#D4AF37]"
                      >
                        View all Curated Escapes
                      </Link>
                      {curatedEscapes.map((escape) => (
                        <Link
                          key={escape.slug}
                          href={`/curated-escapes/${escape.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="rounded-xl px-3 py-2 transition hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                        >
                          {escape.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <Link
            href="tel:+919990022835"
            className="flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-4 py-3 text-sm font-bold text-[#0F0F0F]"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            +91-99900 22835
          </Link>
        </div>
      )}
    </header>
  );
}
