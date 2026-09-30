import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { prisma } from "@/app/lib/data/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const read = Boolean(body.read);

    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json({ enquiry });
  } catch (error) {
    console.error("Update enquiry failed", error);
    return NextResponse.json({ error: "Unable to update enquiry." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.enquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete enquiry failed", error);
    return NextResponse.json({ error: "Unable to delete enquiry." }, { status: 500 });
  }
}
