"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONTACT,
  WHATSAPP_THANK_YOU_MESSAGE,
} from "../constants";
import { LEAD_TRIP_STORAGE_KEY, trackWomenTripsEvent } from "../lib/tracking";

function waLink(message: string) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function ThankYouClient() {
  const [tripName, setTripName] = useState("");

  useEffect(() => {
    let trip = "";
    try {
      trip = sessionStorage.getItem(LEAD_TRIP_STORAGE_KEY) || "";
      sessionStorage.removeItem(LEAD_TRIP_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setTripName(trip);
    trackWomenTripsEvent("women_trips_lead", {
      trip_name: trip || "unknown",
      page: "women-trips-thank-you",
    });
  }, []);

  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0C] text-[#FBF8F1] font-[family-name:var(--font-dm-sans)]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4 sm:px-6">
          <Image
            src="/divas-sojourn-logo.png"
            alt="Divas Sojourn"
            width={140}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-xl rounded-[1.5rem] border border-[rgba(214,174,60,0.4)] bg-[#161616] px-6 py-10 text-center sm:px-10">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#D6AE3C] text-2xl font-black text-[#1A1405]">
            ✓
          </span>
          <h1 className="mt-6 font-[family-name:var(--font-playfair)] text-[2rem] font-medium leading-tight sm:text-[2.4rem]">
            Thank you! Your enquiry is <em className="italic text-[#D6AE3C]">in.</em>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#C9C3B6]">
            Our travel team will contact you on WhatsApp shortly with the itinerary and price. Want
            answers faster? Message us now.
          </p>
          {tripName ? (
            <p className="mt-3 text-sm text-[#8F897D]">Trip interest: {tripName}</p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={waLink(WHATSAPP_THANK_YOU_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWomenTripsEvent("women_trips_whatsapp_click", { location: "thank_you" })
              }
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#D6AE3C] px-6 text-sm font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Chat on WhatsApp →
            </a>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              onClick={() =>
                trackWomenTripsEvent("women_trips_call_click", { location: "thank_you" })
              }
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
            >
              Call {CONTACT.phoneDisplay}
            </a>
          </div>

          <p className="mt-8 text-sm text-[#8F897D]">
            Meanwhile, browse{" "}
            <Link href="/" className="text-[#D6AE3C] underline underline-offset-2">
              all our upcoming trips
            </Link>
            .
          </p>

          {/*
            Google Ads conversion placeholder:
            Set NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID and
            NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL in env.
            Fired via trackWomenTripsEvent('women_trips_lead') above when both are set.
          */}
        </div>
      </main>

      <footer className="border-t border-white/10 px-4 py-5 text-center text-sm text-[#8F897D]">
        © {year} Divas Sojourn · {CONTACT.location} ·{" "}
        <Link href="/privacy-policy" className="text-[#D6AE3C] underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
