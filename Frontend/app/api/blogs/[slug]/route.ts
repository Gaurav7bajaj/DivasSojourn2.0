import { NextResponse } from "next/server";
import { getBlogBySlug } from "@/app/lib/data/blogs";
import { toPublicBlogCard } from "@/app/lib/data/mappers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const blog = await getBlogBySlug(slug);

    if (!blog || !blog.published) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json({ blog: toPublicBlogCard(blog) });
  } catch {
    return NextResponse.json({ error: "Unable to load blog." }, { status: 500 });
  }
}
