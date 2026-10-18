import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/data/prisma";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await checkRateLimit(`enquiry:${ip}`, 12, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
    const phoneRaw = String(body.phone || "").trim();
    const phone = phoneRaw.replace(/\D/g, "").slice(0, 15);
    const message = String(body.message || "").trim().slice(0, 4000);
    const page = String(body.page || body.source || "").trim().slice(0, 200);
    const interestedIn = String(body.interestedIn || "").trim().slice(0, 200);
    const travelDate = String(body.travelDate || "").trim().slice(0, 100);
    const travelers = String(body.travelers || "").trim().slice(0, 50);
    const formType = String(body.formType || "short").trim().slice(0, 32) || "short";

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
    }
    // Email optional for short tailored-trip forms (phone is the primary contact).
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!email && formType !== "short") {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (phone.length !== 10) {
      return NextResponse.json({ error: "Please enter a valid 10 digit phone number." }, { status: 400 });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email: email || `phone.${phone}@tailored.divassojourn.local`,
        phone,
        message,
        page,
        interestedIn,
        travelDate,
        travelers,
        formType:
          formType === "contact"
            ? "contact"
            : formType === "itinerary"
              ? "itinerary"
              : "short",
      },
    });

    return NextResponse.json({ enquiry: { id: enquiry.id } }, { status: 201 });
  } catch (error) {
    console.error("Create enquiry failed", error);
    return NextResponse.json({ error: "Unable to submit enquiry. Please try again." }, { status: 500 });
  }
}
