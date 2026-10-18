import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { deleteFaq, updateFaq } from "@/app/lib/data/faqs";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const faq = await updateFaq(id, {
      category: body.category != null ? String(body.category) : undefined,
      question: body.question != null ? String(body.question) : undefined,
      answer: body.answer != null ? String(body.answer) : undefined,
      slug: body.slug != null ? String(body.slug) : undefined,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : undefined,
      published: typeof body.published === "boolean" ? body.published : undefined,
    });
    return NextResponse.json({ faq });
  } catch (error) {
    console.error("PUT /api/admin/faqs/[id] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update FAQ." },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteFaq(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/faqs/[id] failed", error);
    return NextResponse.json({ error: "Unable to delete FAQ." }, { status: 500 });
  }
}
