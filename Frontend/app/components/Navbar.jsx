"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { navLinks, tripMenus } from "../data/mockData";

export default function Navbar({ indiaTrips = [], internationalTrips = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInternationalOpen, setIsInternationalOpen] = useState(false);
  const [isIndiaOpen, setIsIndiaOpen] = useState(false);
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 bg-[#000000] text-white shadow-xl"
      style={{ backgroundColor: "#000000" }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center gap-3 py-3 pl-4 pr-4 lg:pl-5 lg:pr-6"
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

        <div
          className="hidden min-w-0 flex-1 items-center justify-between px-4 text-sm font-medium xl:flex lg:px-6"
          style={{ color: "#FFFFFF" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap transition hover:text-[#D4AF37]"
              style={{ color: "#FFFFFF" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 xl:ml-0">
          <Link
            href="tel:+919990022835"
            className="hidden items-center gap-2 rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-bold text-[#0F0F0F] transition-all duration-300 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)] lg:flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            +91-99900 22835
          </Link>
          <div className="hidden items-center gap-2 lg:flex">
            {clerkEnabled ? (
              <>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="rounded-full border border-[#D4AF37]/50 px-4 py-2 text-sm font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/" fallbackRedirectUrl="/">
                    <button
                      type="button"
                      className="rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-bold text-[#0F0F0F] transition hover:bg-[#E8C547]"
                    >
                      Sign up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton afterSignOutUrl="/" />
                </Show>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-full border border-[#D4AF37]/50 px-4 py-2 text-sm font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-bold text-[#0F0F0F] transition hover:bg-[#E8C547]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="rounded-full border border-white/15 p-2 text-white xl:hidden"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
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
                    {internationalTrips.map((destination) => (
                      <Link
                        key={destination.slug}
                        href={`/international-trips/${destination.slug}`}
                        className="rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-[#F5E6D3] hover:text-[#1A1A1A]"
                      >
                        {destination.name || destination.shortName}
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
                    {indiaTrips.map((trip) => (
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
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-1 text-sm font-semibold text-white transition hover:text-[#D4AF37]"
                style={{ color: "#FFFFFF" }}
              >
                {item.label}
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
                      {internationalTrips.map((destination) => (
                        <Link
                          key={destination.slug}
                          href={`/international-trips/${destination.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="rounded-xl px-3 py-2 transition hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                        >
                          {destination.name || destination.shortName}
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
                      {indiaTrips.map((trip) => (
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
          <div className="flex flex-col gap-3">
            {clerkEnabled ? (
              <>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center rounded-full border border-[#D4AF37]/50 px-4 py-3 text-sm font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/" fallbackRedirectUrl="/">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center rounded-full bg-[#D4AF37] px-4 py-3 text-sm font-bold text-[#0F0F0F] transition hover:bg-[#E8C547]"
                    >
                      Sign up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <div className="flex items-center justify-center rounded-xl border border-white/10 p-4">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </Show>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-full border border-[#D4AF37]/50 px-4 py-3 text-sm font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-[#D4AF37] px-4 py-3 text-sm font-bold text-[#0F0F0F] transition hover:bg-[#E8C547]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>        </div>
      )}
    </header>
  );
}
