"use client";

import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Blog } from "@/app/lib/data/types";
import { slugify } from "@/app/lib/slugify";

const MAX_COVER_BYTES = 4 * 1024 * 1024;

type BlogFormProps = {
  mode: "create" | "edit";
  initial?: Blog | null;
};

export default function BlogForm({ mode, initial }: BlogFormProps) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
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
  const [removeCoverImage, setRemoveCoverImage] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Derived at render/submit time instead of synced via a useEffect+setState
  // (calling setState synchronously inside an effect is flagged by
  // react-hooks/set-state-in-effect and fails `next build`'s lint step).
  const displaySlug = slugTouched ? slug : slugify(title);

  const previewUrl = useMemo(() => {
    if (coverFile) return URL.createObjectURL(coverFile);
    if (removeCoverImage) return "";
    return coverImageUrl;
  }, [coverFile, coverImageUrl, removeCoverImage]);

  const clearCover = () => {
    setCoverFile(null);
    setCoverImageUrl("");
    setRemoveCoverImage(true);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const onCoverSelected = (file: File | null) => {
    setError("");
    if (!file) {
      setCoverFile(null);
      return;
    }

    const type = (file.type || "").toLowerCase();
    const name = file.name.toLowerCase();
    const okType =
      type === "image/jpeg" ||
      type === "image/jpg" ||
      type === "image/png" ||
      type === "image/webp" ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".png") ||
      name.endsWith(".webp");

    if (!okType) {
      setError(
        "Only JPG, PNG, and WebP are allowed. iPhone HEIC photos must be converted to JPG first.",
      );
      setCoverFile(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_COVER_BYTES) {
      setError("Cover image must be 4MB or smaller. Compress the photo and try again.");
      setCoverFile(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
      return;
    }

    setRemoveCoverImage(false);
    setCoverFile(file);
  };

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
      formData.set("coverImageUrl", removeCoverImage ? "" : coverImageUrl);
      if (removeCoverImage && !coverFile) {
        formData.set("removeCoverImage", "true");
      }
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

      let data: { error?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(
          data.error ||
            (response.status === 413
              ? "Image is too large for the server. Use a file under 4MB."
              : "Unable to save blog."),
        );
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

      <div className="space-y-3">
        <p className="text-sm font-bold">Cover image</p>
        {previewUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#FAFAFA]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Cover preview"
              className="h-40 w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 bg-black/55 px-3 py-2 text-xs text-white">
              <span className="truncate font-semibold">
                {coverFile ? `New: ${coverFile.name}` : "Current cover"}
              </span>
              <button
                type="button"
                onClick={clearCover}
                className="rounded-full bg-red-600 px-3 py-1 font-bold hover:bg-red-500"
              >
                Remove cover
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-black/15 bg-[#FAFAFA] text-sm text-[#777777]">
            No cover image
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-full bg-[#0F9B9B] px-4 py-2 text-xs font-black text-white transition hover:bg-[#0d8585]">
            {previewUrl ? "Change cover photo" : "Choose cover photo"}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              className="sr-only"
              onChange={(event) => onCoverSelected(event.target.files?.[0] || null)}
            />
          </label>
          {coverFile ? (
            <span className="text-xs font-semibold text-[#2563EB]">Ready to upload on save</span>
          ) : null}
          {removeCoverImage && !coverFile ? (
            <span className="text-xs font-semibold text-red-600">Cover will be removed on save</span>
          ) : null}
        </div>
        <p className="text-xs font-medium text-[#777777]">
          JPG, PNG, or WebP · max 4MB (required for Vercel admin uploads)
        </p>
      </div>

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
