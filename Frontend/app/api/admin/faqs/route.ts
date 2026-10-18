import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { createFaq, getAllFaqs } from "@/app/lib/data/faqs";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const faqs = await getAllFaqs();
    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("GET /api/admin/faqs failed", error);
    return NextResponse.json({ error: "Unable to load FAQs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const faq = await createFaq({
      category: String(body.category || ""),
      question: String(body.question || ""),
      answer: String(body.answer || ""),
      slug: body.slug != null ? String(body.slug) : undefined,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : undefined,
      published: body.published !== false,
    });
    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/faqs failed", error);
    const message =
      error instanceof Error && error.message === "Category, question, and answer are required."
        ? error.message
        : "Unable to create FAQ.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
