import { notFound } from "next/navigation";
import { getBlogById } from "@/app/lib/data/blogs";
import BlogForm from "../../BlogForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) {
    notFound();
  }

  return <BlogForm mode="edit" initial={blog} />;
}
