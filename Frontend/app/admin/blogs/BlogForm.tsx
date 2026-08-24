"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Blog } from "@/app/lib/data/types";
import { slugify } from "@/app/lib/slugify";

type BlogFormProps = {
  mode: "create" | "edit";
  initial?: Blog | null;
};

export default function BlogForm({ mode, initial }: BlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [author, setAuthor] = useState(initial?.author || "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [category, setCategory] = useState(initial?.category || "");
  const [destination, setDestination] = useState(initial?.destination || "");
  const [readingTime, setReadingTime] = useState(initial?.readingTime || "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Derived at render/submit time instead of synced via a useEffect+setState
  // (calling setState synchronously inside an effect is flagged by
  // react-hooks/set-state-in-effect and fails `next build`'s lint step).
  const displaySlug = slugTouched ? slug : slugify(title);

  const previewUrl = useMemo(() => {
    if (coverFile) return URL.createObjectURL(coverFile);
    return coverImageUrl;
  }, [coverFile, coverImageUrl]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("slug", displaySlug);
      formData.set("excerpt", excerpt);
      formData.set("content", content);
      formData.set("author", author);
      formData.set("published", String(published));
      formData.set("category", category);
      formData.set("destination", destination);
      formData.set("readingTime", readingTime);
      formData.set("featured", String(featured));
      formData.set("coverImageUrl", coverImageUrl);
      if (coverFile) {
        formData.set("coverImage", coverFile);
      }

      const response = await fetch(
        mode === "create" ? "/api/admin/blogs" : `/api/admin/blogs/${initial?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          body: formData,
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to save blog.");
        return;
      }

      setStatus(mode === "create" ? "Blog created successfully." : "Blog updated successfully.");
      router.push("/admin/blogs");
      router.refresh();
    } catch {
      setError("Unable to save blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">{mode === "create" ? "Add New Blog" : "Edit Blog"}</h1>
        <Link href="/admin/blogs" className="text-sm font-bold text-[#0F9B9B] hover:underline">
          Back to list
        </Link>
      </div>

      <label className="block text-sm font-bold">
        Title*
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
        />
      </label>

      <label className="block text-sm font-bold">
        Slug*
        <input
          required
          value={displaySlug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
        />
      </label>

      <label className="block text-sm font-bold">
        Cover image
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
          className="mt-2 block w-full text-sm"
        />
      </label>
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="Cover preview" className="h-40 w-full rounded-xl object-cover" />
      ) : null}

      <label className="block text-sm font-bold">
        Excerpt*
        <textarea
          required
          rows={3}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
        />
      </label>

      <label className="block text-sm font-bold">
        Content*
        <textarea
          required
          rows={10}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          Author*
          <input
            required
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
          />
        </label>
        <label className="block text-sm font-bold">
          Category
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
          />
        </label>
        <label className="block text-sm font-bold">
          Destination
          <input
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
          />
        </label>
        <label className="block text-sm font-bold">
          Reading time
          <input
            value={readingTime}
            onChange={(event) => setReadingTime(event.target.value)}
            placeholder="5 min"
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6 text-sm font-bold">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
          />
          Published
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
          Featured
        </label>
      </div>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      {status ? <p className="text-sm font-semibold text-[#0F9B9B]">{status}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#0F9B9B] px-6 py-3 text-sm font-black text-white transition hover:bg-[#0d8585] disabled:opacity-60"
      >
        {loading ? "Saving..." : mode === "create" ? "Create blog" : "Save changes"}
      </button>
    </form>
  );
}
