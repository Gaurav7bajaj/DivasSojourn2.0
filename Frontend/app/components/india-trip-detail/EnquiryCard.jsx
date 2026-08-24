"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { useState } from "react";
import { formatDualPrice } from "../../utils/formatPrice";

export default function EnquiryCard({ trip }) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const phoneIsValid = /^[0-9]{10}$/.test(formData.phone);

    if (!formData.name.trim() || !phoneIsValid || !formData.email.includes("@")) {
      setStatus("Please enter a valid name, 10 digit phone number and email.");
      return;
    }

    const leads = JSON.parse(window.localStorage.getItem("divasIndiaTripLeads") || "[]");
    window.localStorage.setItem(
      "divasIndiaTripLeads",
      JSON.stringify([...leads, { ...formData, trip: trip.title, createdAt: new Date().toISOString() }]),
    );
    setStatus("Thanks. Our team will call you back shortly.");
    setFormData({ name: "", phone: "", email: "" });
  };

  return (
    <aside className="space-y-5 min-[900px]:sticky min-[900px]:top-32">
      <section className="rounded-3xl border border-[#D4AF37]/25 bg-[#F9F9F9] p-5 text-[#1A1A1A] shadow-2xl">
        <p className="flex gap-2 rounded-2xl bg-[#FFF8E1] p-3 text-xs font-semibold leading-5 text-[#555555]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
          Partial payment will be enabled on final payment page.
        </p>
        <p className="mt-5 text-sm font-semibold text-[#555555]">Starting from</p>
        <p className="mt-1 text-4xl font-black text-[#D4AF37]">
          {formatDualPrice(trip.earlyBirdPrice || trip.price)}
        </p>
        <p className="text-sm font-semibold text-[#555555]">per person</p>
        <Link
          href={`/payments?trip=${trip.slug}`}
          className="mt-5 inline-flex w-full justify-center rounded-full bg-[#0F9B9B] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#0d8585]"
        >
          Book Now
        </Link>
      </section>

      <section className="rounded-3xl border border-[#D4AF37]/25 bg-[#F9F9F9] p-5 text-[#1A1A1A] shadow-2xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">Enquiry Form</p>
        <h2 className="mt-2 text-2xl font-black">Wanderlust Calling?</h2>
        <p className="mt-1 text-sm font-semibold text-[#555555]">Allow Us to Call You Back!</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-black">
            Full Name*
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Smith"
              className="mt-2 w-full rounded-2xl border border-[#D4AF37]/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
              required
            />
          </label>
          <label className="block text-sm font-black">
            Phone No.*
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your 10 digit number"
              inputMode="numeric"
              maxLength={10}
              className="mt-2 w-full rounded-2xl border border-[#D4AF37]/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
              required
            />
          </label>
          <label className="block text-sm font-black">
            Email ID*
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="mt-2 w-full rounded-2xl border border-[#D4AF37]/25 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-[#0F9B9B] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#0d8585]"
          >
            Get Callback
          </button>
          {status ? <p className="text-sm font-semibold text-[#1A1A1A]">{status}</p> : null}
        </form>
      </section>
    </aside>
  );
}
