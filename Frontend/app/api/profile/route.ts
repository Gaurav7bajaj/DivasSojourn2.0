import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCustomerByClerkId } from "@/app/lib/data/customers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getCustomerByClerkId(userId);
    return NextResponse.json({
      complete: Boolean(profile),
      profile,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load profile." }, { status: 500 });
  }
}
