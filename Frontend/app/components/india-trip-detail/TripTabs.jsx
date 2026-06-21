"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { useState } from "react";

const tabs = ["Overview & Highlights", "Itinerary", "Inclusions", "Exclusions", "Gallery", "Other Info"];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export default function TripTabs({ trip }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openDay, setOpenDay] = useState(1);

  return (
    <section className="overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-[#F9F9F9] text-[#1A1A1A] shadow-2xl">
      <div className="flex gap-1 overflow-x-auto border-b border-[#D4AF37]/20 bg-[#FFF8E1] px-4 pt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 px-4 py-3 text-xs font-black uppercase tracking-wide transition ${
              activeTab === tab
                ? "border-[#0F9B9B] bg-white text-[#0F0F0F]"
                : "border-transparent text-[#555555] hover:border-[#D4AF37]/50 hover:text-[#1A1A1A]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6">
        {activeTab === "Overview & Highlights" ? <Overview trip={trip} /> : null}
        {activeTab === "Itinerary" ? (
          <Itinerary trip={trip} openDay={openDay} setOpenDay={setOpenDay} />
        ) : null}
        {activeTab === "Inclusions" ? (
          <BulletList title="What's Included" items={trip.inclusions} icon="check" />
        ) : null}
        {activeTab === "Exclusions" ? (
          <BulletList title="What's Not Included" items={trip.exclusions} icon="x" />
        ) : null}
        {activeTab === "Gallery" ? <Gallery trip={trip} /> : null}
        {activeTab === "Other Info" ? <OtherInfo trip={trip} /> : null}
      </div>
    </section>
  );
}

function Overview({ trip }) {
  return (
    <div className="border-l-4 border-[#D4AF37] pl-5">
      <h2 className="text-2xl font-black">Overview & Highlights</h2>
      <div className="mt-5 rounded-2xl border border-[#D4AF37]/25 bg-white p-5">
        <h3 className="font-black text-[#1A1A1A]">Route</h3>
        <p className="mt-2 leading-7 text-[#333333]">{trip.route}</p>
      </div>
      <div className="mt-6">
        <h3 className="font-black">Overview</h3>
        <p className="mt-2 leading-8 text-[#333333]">{trip.overview}</p>
      </div>
      <div className="mt-6">
        <h3 className="font-black">Highlights</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {trip.highlights.map((highlight) => (
            <p key={highlight} className="rounded-2xl border border-[#D4AF37]/25 bg-white px-4 py-3 text-sm font-semibold shadow-sm">
              {highlight}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Itinerary({ trip, openDay, setOpenDay }) {
  return (
    <div>
      <h2 className="text-2xl font-black">Detailed Itinerary</h2>
      <div className="mt-5 space-y-4">
        {trip.itinerary.map((day) => {
          const isOpen = openDay === day.day;
          return (
            <article key={day.day} className="overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-white">
              <button
                type="button"
                onClick={() => setOpenDay(isOpen ? null : day.day)}
                className="flex w-full items-center justify-between gap-4 bg-[#1A1A1A] px-5 py-4 text-left text-white"
                aria-expanded={isOpen}
              >
                <span>
                  <span className="block text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">
                    Day {day.day}
                  </span>
                  <span className="mt-1 block text-lg font-black">{day.title}</span>
                </span>
                <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-black text-[#0F0F0F]">
                  {isOpen ? "Hide" : "Expand"}
                </span>
              </button>
              <div className={`grid transition-all ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="space-y-4 p-5">
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                      <InfoPill label="Date" value={day.date} />
                      <InfoPill label="Hotel" value={day.hotel} />
                      <InfoPill label="Meal" value={day.meals} />
                    </div>
                    <p className="leading-8 text-[#333333]">{day.description}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <p className="rounded-2xl bg-[#F5E6D3]/55 p-3">
      <span className="block text-xs font-black uppercase tracking-wide text-[#777777]">{label}</span>
      <span className="mt-1 block font-bold text-[#1A1A1A]">{value}</span>
    </p>
  );
}

function BulletList({ title, items, icon }) {
  const Icon = icon === "check" ? Check : X;
  const color = icon === "check" ? "text-[#0F9B9B]" : "text-[#B54848]";

  return (
    <div>
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <p key={item} className="flex gap-3 rounded-2xl border border-[#E0E0E0] bg-white p-4 text-sm leading-6">
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} aria-hidden="true" />
            <span>{item}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function Gallery({ trip }) {
  const galleryImages = trip.galleryImages?.length ? trip.galleryImages : [trip.image];

  return (
    <div>
      <h2 className="text-2xl font-black">Gallery</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((image, index) => (
          <a
            key={image}
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-2xl"
          >
            <Image
              src={image}
              alt={`${trip.title} gallery image ${index + 1}`}
              width={640}
              height={448}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="aspect-[10/7] w-full object-cover transition duration-500 group-hover:scale-110"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

function OtherInfo({ trip }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-black">Accommodation</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E0E0E0] bg-white">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-[#1A1A1A] text-white">
              <tr>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Hotel / Similar</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Nights</th>
              </tr>
            </thead>
            <tbody>
              {trip.accommodations.map((stay) => (
                <tr key={`${stay.destination}-${stay.hotel}`} className="border-t border-[#E0E0E0]">
                  <td className="px-4 py-3 font-bold">{stay.destination}</td>
                  <td className="px-4 py-3">{stay.hotel}</td>
                  <td className="px-4 py-3">{stay.category || "As mentioned"}</td>
                  <td className="px-4 py-3">{String(stay.nights).padStart(2, "0")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-[#D4AF37]/25 bg-white p-5">
        <h2 className="text-2xl font-black">Pricing</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoPill label="Regular Price" value={`Rs. ${currencyFormatter.format(trip.price)}/- per person`} />
          {trip.earlyBirdPrice ? (
            <InfoPill
              label="Early Bird Discount"
              value={`Rs. ${currencyFormatter.format(trip.earlyBirdPrice)}/- per person`}
            />
          ) : null}
          {trip.singleOccupancyPrice ? (
            <InfoPill
              label="Single Occupancy"
              value={`Rs. ${currencyFormatter.format(trip.singleOccupancyPrice)}/- per person`}
            />
          ) : null}
          {trip.singleSupplement ? (
            <InfoPill
              label="Single Room Supplement"
              value={`Rs. ${currencyFormatter.format(trip.singleSupplement)}/- extra`}
            />
          ) : null}
        </div>
        <p className="mt-5 leading-7 text-[#333333]">
          <span className="font-black">Payment Conditions:</span> {trip.paymentConditions}
        </p>
      </section>

      <section className="rounded-2xl border border-[#D4AF37]/25 bg-white p-5">
        <h2 className="text-2xl font-black">Financial Details</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(trip.financialDetails).map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-[#F5E6D3]/45 p-3">
              <dt className="text-xs font-black uppercase tracking-wide text-[#777777]">{key}</dt>
              <dd className="mt-1 font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-[#D4AF37]/25 bg-white p-5">
        <h2 className="text-2xl font-black">Important Notes</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7">
          {trip.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <div className="mt-5">
          <p className="font-black">Cancellation Policy</p>
          {trip.cancellationLinks.map((link) => (
            <a
              key={link}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm font-bold text-[#0F9B9B] underline-offset-4 hover:underline"
            >
              {link}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
