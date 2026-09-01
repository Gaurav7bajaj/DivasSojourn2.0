"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

export default function LockedItinerary() {
  return (
    <div className="rounded-3xl border border-[#D4AF37]/25 bg-white p-8 text-center shadow-lg">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8E1] text-[#D4AF37]">
        <Lock className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-2xl font-black text-[#1A1A1A]">Sign in to view itinerary</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#555555] md:text-base">
        The full day-by-day itinerary is available for signed-in members only. Please sign up or log in
        to continue.
      </p>
      <Link
        href="/sign-up"
        className="mt-6 inline-flex rounded-full bg-[#0F9B9B] px-6 py-3 text-sm font-black text-white transition hover:bg-[#0d8585]"
      >
        Sign up / Login
      </Link>
    </div>
  );
}
