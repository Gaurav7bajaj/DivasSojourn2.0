import { NextResponse } from "next/server";
import { getPublishedBlogs } from "@/app/lib/data/blogs";
import { toPublicBlogCard } from "@/app/lib/data/mappers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blogs = await getPublishedBlogs();
    return NextResponse.json({ blogs: blogs.map(toPublicBlogCard) });
  } catch {
    return NextResponse.json({ error: "Unable to load blogs." }, { status: 500 });
  }
}
