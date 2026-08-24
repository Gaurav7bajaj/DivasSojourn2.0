"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Trip, TripAccommodation, TripItineraryDay } from "@/app/lib/data/types";
import { slugify } from "@/app/lib/slugify";

type TripFormProps = {
  mode: "create" | "edit";
  initial?: Trip | null;
};

const emptyDay = (): TripItineraryDay => ({
  day: 1,
  date: "",
  title: "",
  location: "",
  hotel: "",
  meals: "",
  description: "",
});

const emptyStay = (): TripAccommodation => ({
  destination: "",
  hotel: "",
  category: "",
  nights: 1,
});

function linesToArray(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function TripForm({ mode, initial }: TripFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [shortName, setShortName] = useState(initial?.shortName || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [destination, setDestination] = useState<"India" | "International">(
    initial?.destination || "India",
  );
  const [published, setPublished] = useState(initial?.published ?? true);
  const [soldOut, setSoldOut] = useState(initial?.soldOut ?? false);
  const [image, setImage] = useState(initial?.image || "");
  const [galleryImages, setGalleryImages] = useState<string[]>(initial?.galleryImages || []);
  const [pdfPath, setPdfPath] = useState(initial?.pdfPath || "");
  const [sourcePdf, setSourcePdf] = useState(initial?.sourcePdf || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dates, setDates] = useState(initial?.dates || "");
  const [startDate, setStartDate] = useState(initial?.startDate || "");
  const [endDate, setEndDate] = useState(initial?.endDate || "");
  const [duration, setDuration] = useState(initial?.duration || "");
  const [nights, setNights] = useState(String(initial?.nights ?? ""));
  const [days, setDays] = useState(String(initial?.days ?? ""));
  const [pickupLocation, setPickupLocation] = useState(initial?.pickupLocation || "");
  const [dropLocation, setDropLocation] = useState(initial?.dropLocation || "");
  const [route, setRoute] = useState(initial?.route || "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [earlyBirdPrice, setEarlyBirdPrice] = useState(
    initial?.earlyBirdPrice != null ? String(initial.earlyBirdPrice) : "",
  );
  const [singleSupplement, setSingleSupplement] = useState(
    initial?.singleSupplement != null ? String(initial.singleSupplement) : "",
  );
  const [singleOccupancyPrice, setSingleOccupancyPrice] = useState(
    initial?.singleOccupancyPrice != null ? String(initial.singleOccupancyPrice) : "",
  );
  const [currency, setCurrency] = useState(initial?.currency || "INR");
  const [overview, setOverview] = useState(initial?.overview || "");
  const [highlightsText, setHighlightsText] = useState((initial?.highlights || []).join("\n"));
  const [inclusionsText, setInclusionsText] = useState((initial?.inclusions || []).join("\n"));
  const [exclusionsText, setExclusionsText] = useState((initial?.exclusions || []).join("\n"));
  const [notesText, setNotesText] = useState((initial?.notes || []).join("\n"));
  const [cancellationText, setCancellationText] = useState(
    (initial?.cancellationLinks || []).join("\n"),
  );
  const [paymentConditions, setPaymentConditions] = useState(initial?.paymentConditions || "");
  const [itinerary, setItinerary] = useState<TripItineraryDay[]>(
    initial?.itinerary?.length ? initial.itinerary : [emptyDay()],
  );
  const [accommodations, setAccommodations] = useState<TripAccommodation[]>(
    initial?.accommodations?.length ? initial.accommodations : [emptyStay()],
  );
  const [financial, setFinancial] = useState({
    company: initial?.financialDetails?.company || "",
    accountNo: initial?.financialDetails?.accountNo || "",
    bankName: initial?.financialDetails?.bankName || "",
    ifsc: initial?.financialDetails?.ifsc || "",
    phonePay: initial?.financialDetails?.phonePay || "",
    upi: initial?.financialDetails?.upi || "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Derived at render/submit time instead of synced via a useEffect+setState
  // (calling setState synchronously inside an effect is flagged by
  // react-hooks/set-state-in-effect and fails `next build`'s lint step).
  const displaySlug = slugTouched ? slug : slugify(title);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

    try {
      const payload = {
        title,
        shortName,
        slug: displaySlug,
        destination,
        published,
        soldOut,
        image,
        galleryImages,
        pdfPath,
        sourcePdf,
        dates,
        startDate,
        endDate,
        duration,
        nights: nights === "" ? undefined : Number(nights),
        days: days === "" ? undefined : Number(days),
        pickupLocation,
        dropLocation,
        route,
        price: price === "" ? 0 : Number(price),
        currency,
        earlyBirdPrice: earlyBirdPrice === "" ? null : Number(earlyBirdPrice),
        singleSupplement: singleSupplement === "" ? null : Number(singleSupplement),
        singleOccupancyPrice: singleOccupancyPrice === "" ? null : Number(singleOccupancyPrice),
        overview,
        highlights: linesToArray(highlightsText),
        inclusions: linesToArray(inclusionsText),
        exclusions: linesToArray(exclusionsText),
        notes: linesToArray(notesText),
        cancellationLinks: linesToArray(cancellationText),
        paymentConditions,
        itinerary,
        accommodations,
        financialDetails: financial,
      };

      const formData = new FormData();
      formData.set("payload", JSON.stringify(payload));
      if (coverFile) formData.set("coverImage", coverFile);
      if (galleryFiles) {
        Array.from(galleryFiles).forEach((file) => formData.append("galleryImages", file));
      }
      if (pdfFile) formData.set("pdf", pdfFile);

      const response = await fetch(
        mode === "create" ? "/api/admin/trips" : `/api/admin/trips/${initial?.id}`,
        { method: mode === "create" ? "POST" : "PUT", body: formData },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to save trip.");
        return;
      }

      setStatus(mode === "create" ? "Trip created." : "Trip updated.");
      router.push("/admin/trips");
      router.refresh();
    } catch {
      setError("Unable to save trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">{mode === "create" ? "Add Trip" : "Edit Trip"}</h1>
        <Link href="/admin/trips" className="text-sm font-bold text-[#0F9B9B] hover:underline">
          Back to list
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-black">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            Destination*
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value as "India" | "International")}
              className={inputClass}
            >
              <option value="India">India</option>
              <option value="International">International</option>
            </select>
          </label>
          <label className="block text-sm font-bold">
            Short name*
            <input required value={shortName} onChange={(e) => setShortName(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-bold sm:col-span-2">
            Title*
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-bold sm:col-span-2">
            Slug*
            <input
              required
              value={displaySlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={inputClass}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-6 text-sm font-bold">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={soldOut} onChange={(e) => setSoldOut(e.target.checked)} />
            Sold out
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-black">Media</h2>
        <label className="block text-sm font-bold">
          Cover image
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm" />
        </label>
        {image ? <p className="text-xs text-[#666666]">Current: {image}</p> : null}
        <label className="block text-sm font-bold">
          Gallery images (add more)
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => setGalleryFiles(e.target.files)} className="mt-2 block w-full text-sm" />
        </label>
        {galleryImages.length ? (
          <div className="flex flex-wrap gap-2">
            {galleryImages.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setGalleryImages((prev) => prev.filter((item) => item !== url))}
                className="rounded-full bg-[#F5F5F5] px-3 py-1 text-xs font-semibold hover:bg-red-50 hover:text-red-600"
                title="Remove from gallery"
              >
                Remove image
              </button>
            ))}
          </div>
        ) : null}
        <label className="block text-sm font-bold">
          Trip PDF (optional)
          <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm" />
        </label>
        {pdfPath ? <p className="text-xs text-[#666666]">Current PDF: {sourcePdf || pdfPath}</p> : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-black">Schedule & logistics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">Start date*<input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold">End date*<input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold">Dates label<input value={dates} onChange={(e) => setDates(e.target.value)} className={inputClass} placeholder="15 Jul – 20 Jul 2026" /></label>
          <label className="block text-sm font-bold">Duration label<input value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} placeholder="05 Nights / 06 Days" /></label>
          <label className="block text-sm font-bold">Nights<input type="number" min="0" value={nights} onChange={(e) => setNights(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold">Days<input type="number" min="0" value={days} onChange={(e) => setDays(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold">Pickup<input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold">Drop<input value={dropLocation} onChange={(e) => setDropLocation(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold sm:col-span-2">Route<input value={route} onChange={(e) => setRoute(e.target.value)} className={inputClass} /></label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-black">Pricing</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">Price (INR)<input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold">Early bird<input type="number" value={earlyBirdPrice} onChange={(e) => setEarlyBirdPrice(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold">Single supplement<input type="number" value={singleSupplement} onChange={(e) => setSingleSupplement(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold">Single occupancy<input type="number" value={singleOccupancyPrice} onChange={(e) => setSingleOccupancyPrice(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-bold">Currency<input value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass} /></label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-black">Overview & lists</h2>
        <label className="block text-sm font-bold">Overview<textarea rows={4} value={overview} onChange={(e) => setOverview(e.target.value)} className={inputClass} /></label>
        <label className="block text-sm font-bold">Highlights (one per line)<textarea rows={4} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} className={inputClass} /></label>
        <label className="block text-sm font-bold">Inclusions (one per line)<textarea rows={4} value={inclusionsText} onChange={(e) => setInclusionsText(e.target.value)} className={inputClass} /></label>
        <label className="block text-sm font-bold">Exclusions (one per line)<textarea rows={4} value={exclusionsText} onChange={(e) => setExclusionsText(e.target.value)} className={inputClass} /></label>
        <label className="block text-sm font-bold">Notes (one per line)<textarea rows={3} value={notesText} onChange={(e) => setNotesText(e.target.value)} className={inputClass} /></label>
        <label className="block text-sm font-bold">Payment conditions<textarea rows={2} value={paymentConditions} onChange={(e) => setPaymentConditions(e.target.value)} className={inputClass} /></label>
        <label className="block text-sm font-bold">Cancellation links (one per line)<textarea rows={2} value={cancellationText} onChange={(e) => setCancellationText(e.target.value)} className={inputClass} /></label>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Itinerary</h2>
          <button type="button" className="text-sm font-bold text-[#0F9B9B]" onClick={() => setItinerary((prev) => [...prev, { ...emptyDay(), day: prev.length + 1 }])}>
            Add day
          </button>
        </div>
        {itinerary.map((day, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-black/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black">Day {day.day || index + 1}</p>
              <button type="button" className="text-xs font-bold text-red-600" onClick={() => setItinerary((prev) => prev.filter((_, i) => i !== index))}>
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Day number" type="number" value={day.day} onChange={(e) => setItinerary((prev) => prev.map((item, i) => (i === index ? { ...item, day: Number(e.target.value) } : item)))} className={inputClass} />
              <input placeholder="Date label" value={day.date} onChange={(e) => setItinerary((prev) => prev.map((item, i) => (i === index ? { ...item, date: e.target.value } : item)))} className={inputClass} />
              <input placeholder="Title" value={day.title} onChange={(e) => setItinerary((prev) => prev.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)))} className={`${inputClass} sm:col-span-2`} />
              <input placeholder="Location" value={day.location || ""} onChange={(e) => setItinerary((prev) => prev.map((item, i) => (i === index ? { ...item, location: e.target.value } : item)))} className={inputClass} />
              <input placeholder="Hotel" value={day.hotel || ""} onChange={(e) => setItinerary((prev) => prev.map((item, i) => (i === index ? { ...item, hotel: e.target.value } : item)))} className={inputClass} />
              <input placeholder="Meals" value={day.meals || ""} onChange={(e) => setItinerary((prev) => prev.map((item, i) => (i === index ? { ...item, meals: e.target.value } : item)))} className={inputClass} />
              <textarea placeholder="Description" rows={3} value={day.description || ""} onChange={(e) => setItinerary((prev) => prev.map((item, i) => (i === index ? { ...item, description: e.target.value } : item)))} className={`${inputClass} sm:col-span-2`} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Accommodations</h2>
          <button type="button" className="text-sm font-bold text-[#0F9B9B]" onClick={() => setAccommodations((prev) => [...prev, emptyStay()])}>
            Add stay
          </button>
        </div>
        {accommodations.map((stay, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-black/10 p-4 sm:grid-cols-2">
            <input placeholder="Destination" value={stay.destination} onChange={(e) => setAccommodations((prev) => prev.map((item, i) => (i === index ? { ...item, destination: e.target.value } : item)))} className={inputClass} />
            <input placeholder="Hotel" value={stay.hotel} onChange={(e) => setAccommodations((prev) => prev.map((item, i) => (i === index ? { ...item, hotel: e.target.value } : item)))} className={inputClass} />
            <input placeholder="Category" value={stay.category || ""} onChange={(e) => setAccommodations((prev) => prev.map((item, i) => (i === index ? { ...item, category: e.target.value } : item)))} className={inputClass} />
            <input placeholder="Nights" type="number" value={stay.nights} onChange={(e) => setAccommodations((prev) => prev.map((item, i) => (i === index ? { ...item, nights: Number(e.target.value) } : item)))} className={inputClass} />
            <button type="button" className="text-left text-xs font-bold text-red-600 sm:col-span-2" onClick={() => setAccommodations((prev) => prev.filter((_, i) => i !== index))}>
              Remove stay
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-black">Financial details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["company", "accountNo", "bankName", "ifsc", "phonePay", "upi"] as const).map((key) => (
            <label key={key} className="block text-sm font-bold capitalize">
              {key}
              <input
                value={financial[key]}
                onChange={(e) => setFinancial((prev) => ({ ...prev, [key]: e.target.value }))}
                className={inputClass}
              />
            </label>
          ))}
        </div>
      </section>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      {status ? <p className="text-sm font-semibold text-[#0F9B9B]">{status}</p> : null}

      <button type="submit" disabled={loading} className="rounded-full bg-[#0F9B9B] px-6 py-3 text-sm font-black text-white hover:bg-[#0d8585] disabled:opacity-60">
        {loading ? "Saving..." : mode === "create" ? "Create trip" : "Save changes"}
      </button>
    </form>
  );
}
