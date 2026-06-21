"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, Clock, MapPin, Phone, X } from "lucide-react";

const TABS = ["Overview", "Itinerary", "Gallery"];

export default function TripDetailModal({ trip, onClose }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedDay, setExpandedDay] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleInquiry = () => {
    const message = `Hi, I'm interested in the luxury trip: *${trip.title}* (${trip.duration}).%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0A%0ACould you share more details?`;
    window.open(`https://wa.me/919990022835?text=${message}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={trip.title}
    >
      <div className="relative mx-auto my-4 w-full max-w-4xl rounded-3xl border border-white/10 bg-[#1A1A1A] shadow-2xl md:my-8">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-[#D4AF37] hover:text-[#0F0F0F]"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header image */}
        <div className="relative h-[250px] w-full overflow-hidden rounded-t-3xl md:h-[350px]">
          <Image
            src={trip.image}
            alt={trip.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <h2 className="text-2xl font-black text-white md:text-4xl">
              {trip.title}
            </h2>
          </div>
        </div>

        {/* Trip info bar */}
        <div className="flex flex-wrap gap-4 border-b border-white/10 px-6 py-4 text-sm text-white/60 md:gap-8 md:px-8">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            <span>{trip.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            <span>{trip.pickup}</span>
          </div>
          {trip.drop !== trip.pickup && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <span>Drop: {trip.drop}</span>
            </div>
          )}
          <div className="ml-auto text-lg font-bold text-[#D4AF37]">
            ₹{trip.price.toLocaleString("en-IN")}
            <span className="ml-1 text-xs font-normal text-white/40">/person</span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-white/10 px-6 md:px-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "text-[#D4AF37]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-6 py-6 md:px-8">
          {/* Overview */}
          {activeTab === "Overview" && (
            <div className="space-y-4">
              <p className="leading-7 text-white/70">{trip.overview}</p>
              <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#0F0F0F] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">
                  Highlights
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {trip.itinerary.map((day) => (
                    <li key={day.day} className="flex items-center gap-2 text-sm text-white/60">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                      Day {day.day}: {day.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Itinerary */}
          {activeTab === "Itinerary" && (
            <div className="space-y-3">
              {trip.itinerary.map((day) => (
                <div
                  key={day.day}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F0F] transition-colors hover:border-[#D4AF37]/30"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedDay(expandedDay === day.day ? null : day.day)
                    }
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    aria-expanded={expandedDay === day.day}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-xs font-bold text-[#D4AF37]">
                        {day.day}
                      </span>
                      <span className="font-semibold text-white">
                        {day.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${
                        expandedDay === day.day ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {expandedDay === day.day && (
                    <div className="border-t border-white/5 px-5 pb-4 pt-3">
                      <p className="leading-7 text-white/60">
                        {day.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Gallery */}
          {activeTab === "Gallery" && (
            <div className="grid grid-cols-2 gap-4">
              {trip.gallery.map((src, i) => (
                <div
                  key={src}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 ${
                    i === 0 ? "col-span-2 h-[250px] md:h-[350px]" : "h-[180px] md:h-[220px]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${trip.title} gallery image ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inquiry form inside modal */}
        <div className="border-t border-white/10 px-6 py-6 md:px-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">
            Interested? Connect with us
          </h3>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-[#0F0F0F] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]/50 transition"
            />
            <input
              type="tel"
              placeholder="+91 Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-[#0F0F0F] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]/50 transition"
            />
            <button
              type="button"
              onClick={handleInquiry}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#0F0F0F] transition-all duration-300 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
