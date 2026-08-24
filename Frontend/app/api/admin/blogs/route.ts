import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin/session";
import { createBlog, getBlogs } from "@/app/lib/data/blogs";
import { saveUploadedImage } from "@/app/lib/uploads";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blogs = await getBlogs();
    return NextResponse.json({ blogs });
  } catch {
    return NextResponse.json({ error: "Unable to load blogs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const author = String(formData.get("author") || "").trim();
    const published = String(formData.get("published") || "true") === "true";
    const category = String(formData.get("category") || "").trim() || undefined;
    const destination = String(formData.get("destination") || "").trim() || undefined;
    const readingTime = String(formData.get("readingTime") || "").trim() || undefined;
    const featured = String(formData.get("featured") || "false") === "true";
    const existingCover = String(formData.get("coverImageUrl") || "").trim();
    const coverFile = formData.get("coverImage");

    if (!title || !excerpt || !content || !author) {
      return NextResponse.json(
        { error: "Title, excerpt, content, and author are required." },
        { status: 400 },
      );
    }

    let coverImageUrl = existingCover;
    if (coverFile instanceof File && coverFile.size > 0) {
      const upload = await saveUploadedImage(coverFile, "blogs");
      if (upload.error || !upload.url) {
        return NextResponse.json({ error: upload.error || "Upload failed." }, { status: 400 });
      }
      coverImageUrl = upload.url;
    }

    const blog = await createBlog({
      title,
      slug: slug || undefined,
      excerpt,
      content,
      author,
      published,
      coverImageUrl,
      category,
      categories: category ? [category] : undefined,
      destination,
      readingTime,
      featured,
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create blog." }, { status: 500 });
  }
}
