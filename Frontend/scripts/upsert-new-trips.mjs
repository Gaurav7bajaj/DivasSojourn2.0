import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const ROOT = process.cwd();
const trips = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "new-trips-rich.json"), "utf8"));

// Patch incomplete highlights (PDF says SPECIAL ATTRACTION singular)
const highlightPatches = {
  "tripura-mizoram-2027": [
    "Solomon’s Temple, Aizawl",
    "Falkawn Traditional Village",
    "Mizoram State Museum",
    "Aizawl Skywalk",
    "Maa Tripureswari Temple",
    "Neermahal Water Palace",
    "Sipahijala Wildlife Sanctuary",
    "Unakoti Rock Carvings",
    "Jampui Hills",
    "Dumboor Lake",
    "Chabimura Rock Carvings",
  ],
  "gateway-to-ladakh-2027": [
    "Shanti Stupa",
    "Leh Palace",
    "Hall of Fame",
    "Pathar Sahib Gurudwara",
    "Magnetic Hills",
    "Sangam of Indus & Zanskar",
    "Spituk Monastery",
    "Nubra Valley (Hundar)",
    "Diskit Monastery",
    "Pangong Lake",
    "Ranchos School",
    "Leh Market",
    "Shey Monastery",
  ],
};

for (const t of trips) {
  if (highlightPatches[t.slug] && (!t.highlights || t.highlights.length === 0)) {
    t.highlights = highlightPatches[t.slug];
    t.overview = `Join Divas Sojourn on ${t.title}, featuring ${t.highlights.slice(0, 5).join(", ")}.`;
  }
  if (t.slug === "mauritius-bliss-2027" && (!t.accommodations || t.accommodations.length === 0)) {
    t.accommodations = [
      {
        destination: "Mauritius",
        hotel: "Outrigger / Similar (5 Star Luxury Beach Resort)",
        category: "5 Star",
        nights: 5,
      },
    ];
  }
  // Cap noisy Ujjain inclusions if extractor grabbed too much
  if (t.slug === "ujjain-2027" && t.inclusions.length > 20) {
    t.inclusions = t.inclusions.slice(0, 15);
  }
  if (t.slug === "ujjain-2027" && t.exclusions.length > 20) {
    t.exclusions = t.exclusions.slice(0, 15);
  }
}

const stubs = [
  {
    slug: "taiwan-cherry-blossom-2027",
    title: "Cherry Blossom in Taiwan",
    shortName: "Taiwan Cherry Blossom",
    destination: "International",
    startDate: "2027-02-20",
    endDate: "2027-02-25",
    dates: "20th – 25th February 2027",
    duration: "05 Nights / 06 Days",
    nights: 5,
    days: 6,
    pickupLocation: "Taipei Airport",
    dropLocation: "Taipei Airport",
    route: "Taiwan",
    price: 150000,
    earlyBirdPrice: 140000,
    overview: "Cherry blossom season in Taiwan. Full itinerary in progress — enquire to join the early bird list.",
    highlights: ["Cherry Blossom Season", "Taiwan City & Nature Highlights"],
    notes: ["Itinerary in progress"],
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    slug: "russia-northern-lights-2027",
    title: "Northern Lights in Russia",
    shortName: "Russia Northern Lights 2027",
    destination: "International",
    startDate: "2027-03-19",
    endDate: "2027-03-26",
    dates: "19th – 26th March 2027",
    duration: "07 Nights / 08 Days",
    nights: 7,
    days: 8,
    pickupLocation: "Moscow Airport",
    dropLocation: "Moscow Airport",
    route: "Russia - Northern Lights",
    price: 372999,
    earlyBirdPrice: 362999,
    overview: "Chase the Northern Lights in Russia on this women-only Divas Sojourn departure.",
    highlights: ["Northern Lights", "Russia City & Arctic Experience"],
    notes: [],
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    slug: "china-unveiled-2027",
    title: "China Unveiled",
    shortName: "China Unveiled",
    destination: "International",
    startDate: "2027-05-01",
    endDate: "2027-05-09",
    dates: "01st – 09th May 2027",
    duration: "08 Nights / 09 Days",
    nights: 8,
    days: 9,
    pickupLocation: "To be announced",
    dropLocation: "To be announced",
    route: "China",
    price: 0,
    earlyBirdPrice: null,
    overview: "China Unveiled — itinerary and pricing coming soon. Register your interest with Divas Sojourn.",
    highlights: ["Coming soon"],
    notes: ["Itinerary in progress", "Price coming soon"],
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    slug: "croatia-slovenia-2027",
    title: "Croatia & Slovenia",
    shortName: "Croatia & Slovenia",
    destination: "International",
    startDate: "2027-06-05",
    endDate: "2027-06-12",
    dates: "05th – 12th June 2027",
    duration: "07 Nights / 08 Days",
    nights: 7,
    days: 8,
    pickupLocation: "To be announced",
    dropLocation: "To be announced",
    route: "Croatia - Slovenia",
    price: 0,
    earlyBirdPrice: null,
    overview: "Croatia & Slovenia — itinerary and pricing coming soon.",
    highlights: ["Coming soon"],
    notes: ["Itinerary in progress", "Price coming soon"],
    image: "https://images.unsplash.com/photo-1555990793-da11153b2473?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1555990793-da11153b2473?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    slug: "spiti-mystique-2027",
    title: "Spiti Mystique",
    shortName: "Spiti Mystique",
    destination: "India",
    startDate: "2027-06-12",
    endDate: "2027-06-19",
    dates: "12th – 19th June 2027",
    duration: "07 Nights / 08 Days",
    nights: 7,
    days: 8,
    pickupLocation: "To be announced",
    dropLocation: "To be announced",
    route: "Spiti Valley",
    price: 0,
    earlyBirdPrice: null,
    overview: "Spiti Mystique — itinerary and pricing coming soon.",
    highlights: ["Coming soon"],
    notes: ["Itinerary in progress", "Price coming soon"],
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    slug: "scotland-reverie-2027",
    title: "Scotland Reverie",
    shortName: "Scotland Reverie",
    destination: "International",
    startDate: "2027-07-10",
    endDate: "2027-07-18",
    dates: "10th – 18th July 2027",
    duration: "08 Nights / 09 Days",
    nights: 8,
    days: 9,
    pickupLocation: "To be announced",
    dropLocation: "To be announced",
    route: "Scotland",
    price: 0,
    earlyBirdPrice: null,
    overview: "Scotland Reverie — itinerary and pricing coming soon.",
    highlights: ["Coming soon"],
    notes: ["Itinerary in progress", "Price coming soon"],
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=85",
    ],
  },
];

const FINANCIAL = {
  company: "Divas Sojourn",
  accountNo: "034063200000551",
  bankName: "Yes Bank",
  ifsc: "YESB0000340",
  phonePay: "9990022835",
  upi: "pooja243273-1@oksbi",
};

const CANCEL = [
  "https://divassojourn.com/terms-condition/",
  "https://divassojourn.com/terms.html",
  "https://divassojourn.com/privacy-policy/",
];

function normalizeTrip(raw) {
  const { textFile, pdfPublicPath, sourcePdf, ...rest } = raw;
  return {
    id: undefined,
    title: rest.title,
    shortName: rest.shortName,
    slug: rest.slug,
    destination: rest.destination,
    image: rest.image || "",
    galleryImages: rest.galleryImages || [],
    pdfPath: rest.pdfPublicPath || pdfPublicPath || null,
    sourcePdf: rest.sourcePdf || sourcePdf || null,
    dates: rest.dates || "",
    startDate: rest.startDate,
    endDate: rest.endDate,
    duration: rest.duration || "",
    nights: rest.nights || 0,
    days: rest.days || 0,
    pickupLocation: rest.pickupLocation || "",
    dropLocation: rest.dropLocation || "",
    route: rest.route || "",
    price: rest.price ?? 0,
    currency: rest.currency || "INR",
    earlyBirdPrice: rest.earlyBirdPrice ?? null,
    singleSupplement: rest.singleSupplement ?? null,
    singleOccupancyPrice: rest.singleOccupancyPrice ?? null,
    soldOut: false,
    overview: rest.overview || "",
    highlights: rest.highlights || [],
    paymentConditions:
      rest.paymentConditions ||
      "50% at time of booking and remaining balance prior to arrival.",
    notes: rest.notes || [],
    itinerary: rest.itinerary || [],
    accommodations: rest.accommodations || [],
    inclusions: rest.inclusions || [],
    exclusions: rest.exclusions || [],
    womenJoiningFrom: [],
    financialDetails: rest.financialDetails || FINANCIAL,
    cancellationLinks: rest.cancellationLinks || CANCEL,
    published: true,
  };
}

function stubToTrip(s) {
  return normalizeTrip({
    ...s,
    pdfPublicPath: null,
    sourcePdf: null,
    currency: "INR",
    inclusions: [],
    exclusions: [],
    itinerary: [],
    accommodations: [],
    paymentConditions: "Details will be shared once the itinerary is published.",
    financialDetails: FINANCIAL,
    cancellationLinks: CANCEL,
  });
}

// Copy PDFs into public folders
const srcDir = path.join(ROOT, "new trips details");
for (const t of trips) {
  if (!t.sourcePdf || !t.pdfPublicPath) continue;
  const src = path.join(srcDir, t.sourcePdf);
  const dest = path.join(ROOT, "public", t.pdfPublicPath.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log("Copied PDF →", t.pdfPublicPath);
  } else {
    console.warn("Missing PDF source:", t.sourcePdf);
  }
}

const all = [...trips.map(normalizeTrip), ...stubs.map(stubToTrip)];

for (const trip of all) {
  const { id: _ignore, ...data } = trip;
  const existing = await prisma.trip.findUnique({ where: { slug: data.slug } });
  if (existing) {
    await prisma.trip.update({
      where: { slug: data.slug },
      data,
    });
    console.log("Updated", data.slug);
  } else {
    await prisma.trip.create({
      data: { id: randomUUID(), ...data },
    });
    console.log("Created", data.slug);
  }
}

const shown = await prisma.trip.findMany({
  where: { published: true, startDate: { gte: "2026-09-30", lte: "2027-09-30" } },
  orderBy: { startDate: "asc" },
  select: { destination: true, title: true, startDate: true, endDate: true, price: true, earlyBirdPrice: true },
});
console.log("\n=== PUBLIC WINDOW TRIPS ===");
for (const r of shown) {
  console.log(
    `${r.startDate} | ${r.destination.padEnd(13)} | ₹${r.price}${r.earlyBirdPrice ? ` (EB ${r.earlyBirdPrice})` : ""} | ${r.title}`,
  );
}
console.log("Total in window:", shown.length);

await prisma.$disconnect();
