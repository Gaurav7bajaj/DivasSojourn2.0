/**
 * Re-parse PDF text into richer trip JSON with itinerary / inclusions / accommodations.
 * Writes scripts/new-trips-rich.json
 */
import fs from "fs";
import path from "path";

const TEXT_DIR = path.join(process.cwd(), "scripts", "pdf-text");
const OUT = path.join(process.cwd(), "scripts", "new-trips-rich.json");

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

const META = [
  {
    textFile: "DS_29_Dec-03_Jan_Vietnam_Wonders_Trip_2026.txt",
    sourcePdf: "DS 29 Dec-03 Jan Vietnam Wonders Trip 2026.pdf",
    slug: "vietnam-wonders-2026",
    title: "Vietnam Wonders",
    shortName: "Vietnam Wonders",
    destination: "International",
    startDate: "2026-12-29",
    endDate: "2027-01-03",
    dates: "29th Dec 2026 – 03rd Jan 2027",
    duration: "05 Nights / 06 Days",
    nights: 5,
    days: 6,
    pickupLocation: "Hanoi Airport",
    dropLocation: "Da Nang Airport",
    route: "Hanoi - Ha Long Bay - Da Nang - Hoi An",
    price: 187999,
    earlyBirdPrice: null,
    singleSupplement: 55000,
    pdfPublicPath: "/international-trip-pdfs/vietnam-wonders-2026.pdf",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_04-10_Jan_Gujarat_Glory-_Rann_of_Kutch_Dholavira_Rani_Ka_Vav_2027.txt",
    sourcePdf: "DS 04-10 Jan Gujarat Glory- Rann of Kutch, Dholavira & Rani Ka Vav 2027.pdf",
    slug: "rann-of-kutch-2027",
    title: "Gujarat Glory - Rann of Kutch, Dholavira & Rani Ka Vav",
    shortName: "Rann of Kutch",
    destination: "India",
    startDate: "2027-01-04",
    endDate: "2027-01-10",
    dates: "04th – 10th January 2027",
    duration: "06 Nights / 07 Days",
    nights: 6,
    days: 7,
    pickupLocation: "Ahmedabad Airport",
    dropLocation: "Ahmedabad Airport",
    route: "Ahmedabad - Bhuj - Mandvi - Rann of Kutch - Dholavira - Rani Ka Vav - Ahmedabad",
    price: 52444,
    earlyBirdPrice: 50444,
    singleSupplement: 21000,
    pdfPublicPath: "/india-trip-pdfs/rann-of-kutch-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b8f57c20?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b8f57c20?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_12-17_Jan_Sri_Lanka-Soul_-2027.txt",
    sourcePdf: "DS 12-17 Jan Sri Lanka-Soul -2027.pdf",
    slug: "sri-lanka-soul-2027",
    title: "Sri Lanka Soul",
    shortName: "Sri Lanka Soul",
    destination: "International",
    startDate: "2027-01-12",
    endDate: "2027-01-17",
    dates: "12th – 17th January 2027",
    duration: "05 Nights / 06 Days",
    nights: 5,
    days: 6,
    pickupLocation: "Colombo Airport",
    dropLocation: "Colombo Airport",
    route: "Sigiriya - Kandy - Nuwara Eliya - Ella - Yala - Galle - Bentota",
    price: 118000,
    earlyBirdPrice: 113000,
    singleSupplement: null,
    pdfPublicPath: "/international-trip-pdfs/sri-lanka-soul-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1566296314734-4b0c0b8b0b0b?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1588598198322-b68e3c0c0b0b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1588666309992-0c0b0b0b0b0b?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_23-26_Jan_Pondicherry_Mahabalipuram_Trip_-2027.txt",
    sourcePdf: "DS 23-26 Jan Pondicherry & Mahabalipuram Trip -2027.pdf",
    slug: "pondicherry-mahabalipuram-2027",
    title: "Pondicherry & Mahabalipuram",
    shortName: "Pondicherry & Mahabalipuram",
    destination: "India",
    startDate: "2027-01-23",
    endDate: "2027-01-26",
    dates: "23rd – 26th January 2027",
    duration: "03 Nights / 04 Days",
    nights: 3,
    days: 4,
    pickupLocation: "Chennai Airport",
    dropLocation: "Chennai Airport",
    route: "Chennai - Pondicherry - Mahabalipuram - Chennai",
    price: 29900,
    earlyBirdPrice: 27900,
    singleSupplement: 10000,
    pdfPublicPath: "/india-trip-pdfs/pondicherry-mahabalipuram-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b8f57c20?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_06-10_February_Shree_Jagannath_Puri_2027.txt",
    sourcePdf: "DS 06-10 February Shree Jagannath Puri 2027.pdf",
    slug: "jagannath-puri-2027",
    title: "Shree Jagannath Puri",
    shortName: "Jagannath Puri",
    destination: "India",
    startDate: "2027-02-06",
    endDate: "2027-02-10",
    dates: "06th – 10th February 2027",
    duration: "04 Nights / 05 Days",
    nights: 4,
    days: 5,
    pickupLocation: "Bhubaneswar Airport",
    dropLocation: "Bhubaneswar Airport",
    route: "Bhubaneswar - Puri - Konark - Chilika - Bhubaneswar",
    price: 38500,
    earlyBirdPrice: 36500,
    singleSupplement: null,
    pdfPublicPath: "/india-trip-pdfs/jagannath-puri-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b8f57c20?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_17-21_Feb_Divine_Trail-_Varanasi_Prayagraj_Ayodhya_-2027.txt",
    sourcePdf: "DS 17-21 Feb Divine Trail- Varanasi, Prayagraj & Ayodhya  -2027.pdf",
    slug: "varanasi-prayagraj-ayodhya-2027",
    title: "Divine Trail - Varanasi, Prayagraj & Ayodhya",
    shortName: "Varanasi Prayagraj Ayodhya",
    destination: "India",
    startDate: "2027-02-17",
    endDate: "2027-02-21",
    dates: "17th – 21st February 2027",
    duration: "04 Nights / 05 Days",
    nights: 4,
    days: 5,
    pickupLocation: "Varanasi Airport",
    dropLocation: "Lucknow Airport / Ayodhya",
    route: "Varanasi - Prayagraj - Ayodhya",
    price: 43666,
    earlyBirdPrice: 41666,
    singleSupplement: null,
    pdfPublicPath: "/india-trip-pdfs/varanasi-prayagraj-ayodhya-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_06-10_March_Mahakal_Ujjain_Journey_-_2027.txt",
    sourcePdf: "DS 06-10 March Mahakal Ujjain Journey - 2027.pdf",
    slug: "ujjain-2027",
    title: "Mahakal Ujjain Journey",
    shortName: "Ujjain",
    destination: "India",
    startDate: "2027-03-06",
    endDate: "2027-03-10",
    dates: "06th – 10th March 2027",
    duration: "04 Nights / 05 Days",
    nights: 4,
    days: 5,
    pickupLocation: "Indore Airport",
    dropLocation: "Indore Airport",
    route: "Indore - Ujjain - Omkareshwar - Indore",
    price: 33900,
    earlyBirdPrice: 31900,
    singleSupplement: null,
    pdfPublicPath: "/india-trip-pdfs/ujjain-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b8f57c20?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_20-28_March_Tripura_Mizoram_2027.txt",
    sourcePdf: "DS 20-28 March Tripura & Mizoram  2027.pdf",
    slug: "tripura-mizoram-2027",
    title: "Tripura & Mizoram",
    shortName: "Tripura & Mizoram",
    destination: "India",
    startDate: "2027-03-20",
    endDate: "2027-03-28",
    dates: "20th – 28th March 2027",
    duration: "08 Nights / 09 Days",
    nights: 8,
    days: 9,
    pickupLocation: "Agartala Airport",
    dropLocation: "Aizawl Airport",
    route: "Agartala - Tripura - Mizoram - Aizawl",
    price: 59500,
    earlyBirdPrice: 56500,
    singleSupplement: null,
    pdfPublicPath: "/india-trip-pdfs/tripura-mizoram-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_17-24_April_Georgia_Armenia_2027.txt",
    sourcePdf: "DS 17-24 April Georgia & Armenia 2027.pdf",
    slug: "georgia-armenia-2027",
    title: "Georgia & Armenia",
    shortName: "Georgia & Armenia 2027",
    destination: "International",
    startDate: "2027-04-17",
    endDate: "2027-04-24",
    dates: "17th – 24th April 2027",
    duration: "07 Nights / 08 Days",
    nights: 7,
    days: 8,
    pickupLocation: "Tbilisi Airport",
    dropLocation: "Yerevan Airport",
    route: "Tbilisi - Kazbegi - Yerevan",
    price: 139500,
    earlyBirdPrice: 134500,
    singleSupplement: null,
    pdfPublicPath: "/international-trip-pdfs/georgia-armenia-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1565008576549-57569a493962?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1565008576549-57569a493962?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1596422846543-75c6fc710e0a?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_24-30_April_Tawang_Dirang_Beyond_Trip_-2027.txt",
    sourcePdf: "DS 24-30 April Tawang, Dirang & Beyond Trip -2027.pdf",
    slug: "tawang-dirang-2027",
    title: "Serenity Trails - Tawang, Dirang & Beyond",
    shortName: "Tawang Dirang 2027",
    destination: "India",
    startDate: "2027-04-24",
    endDate: "2027-04-30",
    dates: "24th – 30th April 2027",
    duration: "06 Nights / 07 Days",
    nights: 6,
    days: 7,
    pickupLocation: "Guwahati Airport",
    dropLocation: "Guwahati Airport",
    route: "Guwahati - Dirang - Tawang - Guwahati",
    price: 49900,
    earlyBirdPrice: 47900,
    singleSupplement: null,
    pdfPublicPath: "/india-trip-pdfs/tawang-dirang-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_15-20_May_Mauritius_Bliss_2027.txt",
    sourcePdf: "DS 15-20 May Mauritius Bliss 2027.pdf",
    slug: "mauritius-bliss-2027",
    title: "Mauritius Bliss",
    shortName: "Mauritius Bliss",
    destination: "International",
    startDate: "2027-05-15",
    endDate: "2027-05-20",
    dates: "15th – 20th May 2027",
    duration: "05 Nights / 06 Days",
    nights: 5,
    days: 6,
    pickupLocation: "Mauritius Airport",
    dropLocation: "Mauritius Airport",
    route: "North Island - South Island - Ile aux Cerfs",
    price: 132900,
    earlyBirdPrice: null,
    singleSupplement: null,
    pdfPublicPath: "/international-trip-pdfs/mauritius-bliss-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_22-27_May_Gateway_to_Ladakh_2027.txt",
    sourcePdf: "DS 22-27 May Gateway to Ladakh 2027.pdf",
    slug: "gateway-to-ladakh-2027",
    title: "Gateway to Ladakh",
    shortName: "Gateway to Ladakh",
    destination: "India",
    startDate: "2027-05-22",
    endDate: "2027-05-27",
    dates: "22nd – 27th May 2027",
    duration: "05 Nights / 06 Days",
    nights: 5,
    days: 6,
    pickupLocation: "Leh Airport",
    dropLocation: "Leh Airport",
    route: "Leh - Nubra - Pangong - Leh",
    price: 39500,
    earlyBirdPrice: 36500,
    singleSupplement: null,
    pdfPublicPath: "/india-trip-pdfs/gateway-to-ladakh-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_01-06_June_Guwahati_Shillong_Cherrapunji_2027.txt",
    sourcePdf: "DS 01-06 June Guwahati, Shillong & Cherrapunji  2027.pdf",
    slug: "guwahati-shillong-cherrapunji-2027",
    title: "Guwahati, Shillong & Cherrapunji",
    shortName: "Guwahati Shillong Cherrapunji",
    destination: "India",
    startDate: "2027-06-01",
    endDate: "2027-06-06",
    dates: "01st – 06th June 2027",
    duration: "05 Nights / 06 Days",
    nights: 5,
    days: 6,
    pickupLocation: "Guwahati Airport",
    dropLocation: "Guwahati Airport",
    route: "Guwahati - Shillong - Cherrapunji - Guwahati",
    price: 56500,
    earlyBirdPrice: 53500,
    singleSupplement: null,
    pdfPublicPath: "/india-trip-pdfs/guwahati-shillong-cherrapunji-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    textFile: "DS_26_June_-_02_July_Kenya_Trails_-2027.txt",
    sourcePdf: "DS  26 June - 02 July Kenya Trails -2027.pdf",
    slug: "kenya-trails-2027",
    title: "Into The Wild - Kenya Trails",
    shortName: "Kenya Trails 2027",
    destination: "International",
    startDate: "2027-06-26",
    endDate: "2027-07-02",
    dates: "26th June – 02nd July 2027",
    duration: "06 Nights / 07 Days",
    nights: 6,
    days: 7,
    pickupLocation: "Nairobi Airport",
    dropLocation: "Nairobi Airport",
    route: "Nairobi - Masai Mara - Lake Nakuru - Nairobi",
    price: 214999,
    earlyBirdPrice: null,
    singleSupplement: null,
    pdfPublicPath: "/international-trip-pdfs/kenya-trails-2027.pdf",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=85",
    ],
  },
];

function clean(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .replace(/\u0000/g, "")
    .trim();
}

function sectionBetween(text, startRe, endRes) {
  const start = text.search(startRe);
  if (start < 0) return "";
  let rest = text.slice(start);
  let end = rest.length;
  for (const er of endRes) {
    const idx = rest.search(er);
    if (idx > 20 && idx < end) end = idx;
  }
  return rest.slice(0, end);
}

function bulletLines(block) {
  return block
    .split(/\n+/)
    .map((l) => l.replace(/^[\s➢•\-–—*]+/, "").trim())
    .filter((l) => l.length > 2 && !/^(DIVAS SOJOURN|INCLUSIONS|EXCLUSIONS|PLEASE NOTE|-- \d)/i.test(l))
    .map(clean)
    .filter(Boolean);
}

function extractHighlights(text) {
  const block = sectionBetween(
    text,
    /SPECIAL ATTRACTIONS/i,
    [/SKETCH ITINERARY/i, /ACCOMODATION/i, /TOUR PACKAGE/i],
  );
  return bulletLines(block).slice(0, 20);
}

function extractList(text, label) {
  const re = new RegExp(label, "i");
  const block = sectionBetween(text, re, [
    /EXCLUSIONS?:/i,
    /INCLUSIONS?:/i,
    /PLEASE NOTE/i,
    /DETAILED ITINERARY/i,
    /PAYMENT CONDITIONS/i,
    /FINANCIAL DETAILS/i,
    /FOLLOW US/i,
    /CANCELLATION/i,
  ]);
  // drop the heading line
  const lines = bulletLines(block.replace(re, ""));
  return lines;
}

function extractPayment(text) {
  const m = text.match(/PAYMENT CONDITIONS\s*([\s\S]{10,220}?)(?:\nFOLLOW|\nCANCELLATION|\nFINANCIAL|\nINCLUSIONS|\nPLEASE)/i);
  if (m) return clean(m[1]);
  return "50% at time of booking and remaining balance prior to arrival.";
}

function extractNotes(text) {
  const notes = [];
  const m = text.match(/PLEASE NOTE[:\s]*([\s\S]{10,500}?)(?:\nDETAILED|\nDAY\s|\n--|\nSTAY)/i);
  if (m) notes.push(clean(m[1]));
  return notes;
}

function extractAccommodations(text) {
  const block = sectionBetween(
    text,
    /ACCOMODATION|ACCOMMODATION/i,
    [/TOUR PACKAGE/i, /TOUR PACKAGES/i, /PAYMENT/i, /INCLUSIONS/i],
  );
  const lines = block
    .split(/\n+/)
    .map((l) => clean(l))
    .filter((l) => l && !/ACCOMODATION|ACCOMMODATION|DESTINATION|HOTELS|NIGHTS|CATEGORY|DIVAS/i.test(l));

  const acc = [];
  // Try table-ish: Destination Hotel Nights
  for (const line of lines) {
    const nightMatch = line.match(/(\d+)\s*$/);
    if (!nightMatch) continue;
    const nights = Number(nightMatch[1]);
    const rest = line.replace(/\s*\d+\s*$/, "").trim();
    if (rest.length < 4) continue;
    // First word(s) as destination heuristic
    const parts = rest.split(/\s{2,}|\s\/\s/);
    acc.push({
      destination: parts[0].split(" ").slice(0, 3).join(" "),
      hotel: rest,
      nights,
    });
  }
  return acc;
}

function extractItinerary(text, nights, days) {
  const start = text.search(/DETAILED ITINERARY/i);
  if (start < 0) return [];
  let body = text.slice(start);
  // stop before trailing notes if any
  const stop = body.search(/\nPLEASE NOTE: As this is a group/i);
  if (stop > 0) body = body.slice(0, stop);

  // Split on DAY markers
  const parts = body.split(/(?=DAY\s*0?\d)/i).filter((p) => /^DAY\s*0?\d/i.test(p.trim()));
  const itinerary = [];

  for (const part of parts) {
    const header = part.split(/\n/).slice(0, 3).join(" ");
    const dayMatch = header.match(/DAY\s*0?(\d+)/i);
    if (!dayMatch) continue;
    const day = Number(dayMatch[1]);
    const dateMatch = header.match(/(\d{1,2}\s*(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s*20\d{2}|\d{1,2}(?:st|nd|rd|th)?\s*(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*)/i);
    const date = dateMatch ? clean(dateMatch[1]) : "";

    let stay = "";
    const stayM = part.match(/STAY[:\s–-]*([^\n]+)/i);
    if (stayM) stay = clean(stayM[1].replace(/HOTEL[:\s–-]*/i, ""));
    const hotelM = part.match(/HOTEL[:\s–-]*([^\n]+)/i);
    if (!stay && hotelM) stay = clean(hotelM[1]);

    let meals = "";
    const mealM = part.match(/MEALS?[:\s–-]*([^\n]+)/i);
    if (mealM) meals = clean(mealM[1]);

    // Title: text after date / pipe until end of first lines
    let title = clean(
      header
        .replace(/DAY\s*0?\d[\s|:–-]*/i, "")
        .replace(date, "")
        .replace(/\b(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)\b/gi, "")
        .replace(/\|/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    );
    if (title.length > 90) title = title.slice(0, 90).trim();

    // Description: full part without header/stay/meal lines
    let description = part
      .split(/\n/)
      .slice(1)
      .filter((l) => !/^(STAY|HOTEL|MEAL|DIVAS SOJOURN|-- \d|✨)/i.test(l.trim()))
      .join(" ");
    description = clean(description);
    if (description.length > 1800) description = description.slice(0, 1800) + "…";

    const location = title.split(/[-–]|TRANSFER|TO\b/)[0].trim().slice(0, 40) || title.slice(0, 40);

    itinerary.push({
      day,
      date,
      title: title || `Day ${day}`,
      location,
      hotel: stay || "As per itinerary",
      meals: meals || "",
      description: description || title,
    });
  }

  // If sketch only and no detailed split worked, build from sketch
  if (itinerary.length === 0) {
    const sketch = sectionBetween(text, /SKETCH ITINERARY/i, [/ACCOMODATION/i, /TOUR PACKAGE/i]);
    const sketchLines = sketch
      .split(/\n+/)
      .map(clean)
      .filter((l) => /^\d+\s+\d{1,2}\s/.test(l) || /^DAY\s*\d/i.test(l));
    sketchLines.forEach((l, i) => {
      itinerary.push({
        day: i + 1,
        date: "",
        title: l.replace(/^\d+\s+/, ""),
        location: "",
        hotel: "As per itinerary",
        meals: "",
        description: l,
      });
    });
  }

  return itinerary.slice(0, days || 15);
}

function overviewFromHighlights(title, highlights) {
  const bits = highlights.slice(0, 5).join(", ");
  return bits
    ? `Join Divas Sojourn on ${title}, featuring ${bits}.`
    : `Join Divas Sojourn on ${title} — a carefully curated women-only group journey.`;
}

const trips = [];

for (const meta of META) {
  const raw = fs.readFileSync(path.join(TEXT_DIR, meta.textFile), "utf8");
  // strip page markers
  const text = raw.replace(/\n-- \d+ of \d+ --\n/g, "\n");

  const highlights = extractHighlights(text);
  let inclusions = extractList(text, "INCLUSIONS?:?");
  let exclusions = extractList(text, "EXCLUSIONS?:?");
  // Prefer longer of competing captures
  if (inclusions.length < 3) {
    const alt = extractList(text, "INCLUSIONS");
    if (alt.length > inclusions.length) inclusions = alt;
  }
  if (exclusions.length < 3) {
    const alt = extractList(text, "EXCLUSIONS");
    if (alt.length > exclusions.length) exclusions = alt;
  }

  // Fix: extractList end markers may cut wrong — grab dedicated blocks
  const incBlock = text.match(/INCLUSIONS?:?\s*([\s\S]*?)(?:EXCLUSIONS?:?|PLEASE NOTE|DETAILED ITINERARY)/i);
  if (incBlock) {
    const bullets = bulletLines(incBlock[1]);
    if (bullets.length > inclusions.length) inclusions = bullets;
  }
  const excBlock = text.match(/EXCLUSIONS?:?\s*([\s\S]*?)(?:PLEASE NOTE|DETAILED ITINERARY|PAYMENT CONDITIONS|FOLLOW US)/i);
  if (excBlock) {
    const bullets = bulletLines(excBlock[1]);
    if (bullets.length > exclusions.length) exclusions = bullets;
  }

  const accommodations = extractAccommodations(text);
  const itinerary = extractItinerary(text, meta.nights, meta.days);
  const paymentConditions = extractPayment(text);
  const notes = extractNotes(text);

  // Financial from PDF if present
  const financialDetails = { ...FINANCIAL };
  const accNo = text.match(/Account No\.?\s*([0-9]+)/i);
  const ifsc = text.match(/IFSC Code\s*([A-Z0-9]+)/i);
  const upi = text.match(/UPI ID\s*([^\n]+)/i);
  const phone = text.match(/Phone Pay\s*([0-9]+)/i);
  if (accNo) financialDetails.accountNo = accNo[1].trim();
  if (ifsc) financialDetails.ifsc = ifsc[1].trim();
  if (upi) financialDetails.upi = clean(upi[1]);
  if (phone) financialDetails.phonePay = phone[1].trim();

  // Fix Sri Lanka image placeholders - use known good
  let image = meta.image;
  let galleryImages = meta.galleryImages;
  if (meta.slug === "sri-lanka-soul-2027") {
    image =
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85";
    galleryImages = [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1588598198322-b68e3c0c0b0b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85",
    ];
  }
  if (meta.slug === "pondicherry-mahabalipuram-2027") {
    image =
      "https://images.unsplash.com/photo-1582510003544-4d00b8f57c20?auto=format&fit=crop&w=1600&q=85";
    galleryImages = [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1582510003544-4d00b8f57c20?auto=format&fit=crop&w=900&q=85",
    ];
  }
  if (meta.slug === "jagannath-puri-2027" || meta.slug === "ujjain-2027") {
    image =
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=85";
  }

  trips.push({
    ...meta,
    image,
    galleryImages,
    currency: "INR",
    overview: overviewFromHighlights(meta.title, highlights),
    highlights,
    paymentConditions,
    notes,
    itinerary,
    accommodations,
    inclusions,
    exclusions,
    financialDetails,
    cancellationLinks: CANCEL,
    womenJoiningFrom: [],
    soldOut: false,
    published: true,
    singleOccupancyPrice: null,
  });
}

fs.writeFileSync(OUT, JSON.stringify(trips, null, 2));
for (const t of trips) {
  console.log(
    `${t.slug} | itin=${t.itinerary.length} | inc=${t.inclusions.length} | exc=${t.exclusions.length} | acc=${t.accommodations.length} | hl=${t.highlights.length}`,
  );
}
console.log("Wrote", OUT);
