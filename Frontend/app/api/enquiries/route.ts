import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/data/prisma";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phoneRaw = String(body.phone || "").trim();
    const phone = phoneRaw.replace(/\D/g, "");
    const message = String(body.message || "").trim();
    const page = String(body.page || body.source || "").trim();
    const interestedIn = String(body.interestedIn || "").trim();
    const travelDate = String(body.travelDate || "").trim();
    const travelers = String(body.travelers || "").trim();
    const formType = String(body.formType || "short").trim() || "short";

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
        formType: formType === "contact" ? "contact" : "short",
      },
    });

    return NextResponse.json({ enquiry: { id: enquiry.id } }, { status: 201 });
  } catch (error) {
    console.error("Create enquiry failed", error);
    return NextResponse.json({ error: "Unable to submit enquiry. Please try again." }, { status: 500 });
  }
}
