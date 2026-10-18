import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/data/prisma";
import { getTravelerSession } from "@/app/lib/travelerSession";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getTravelerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const traveler = await prisma.traveler.findUnique({
    where: { id: session.travelerId },
  });
  if (!traveler) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    traveler: {
      id: traveler.id,
      fullName: traveler.fullName,
      phone: traveler.phone,
      email: traveler.email,
    },
  });
}

export async function PATCH(request: Request) {
  const session = await getTravelerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const fullName = body.fullName != null ? String(body.fullName).trim() : undefined;
    const email = body.email != null ? String(body.email).trim().toLowerCase() : undefined;

    if (fullName !== undefined && fullName.length < 2) {
      return NextResponse.json({ error: "Enter a valid full name." }, { status: 400 });
    }
    if (email !== undefined && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }

    const traveler = await prisma.traveler.update({
      where: { id: session.travelerId },
      data: {
        ...(fullName !== undefined ? { fullName } : {}),
        ...(email !== undefined ? { email } : {}),
      },
    });

    return NextResponse.json({
      traveler: {
        id: traveler.id,
        fullName: traveler.fullName,
        phone: traveler.phone,
        email: traveler.email,
      },
    });
  } catch (error) {
    console.error("account me PATCH failed", error);
    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}
