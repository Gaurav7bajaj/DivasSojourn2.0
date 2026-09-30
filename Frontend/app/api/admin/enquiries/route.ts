import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { prisma } from "@/app/lib/data/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [enquiries, unreadCount] = await Promise.all([
      prisma.enquiry.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.enquiry.count({ where: { read: false } }),
    ]);

    return NextResponse.json({ enquiries, unreadCount });
  } catch (error) {
    console.error("Load enquiries failed", error);
    return NextResponse.json({ error: "Unable to load enquiries." }, { status: 500 });
  }
}
