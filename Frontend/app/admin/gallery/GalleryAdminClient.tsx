"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import type { GalleryImage } from "@/app/lib/data/types";

export default function GalleryAdminClient() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/gallery", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to load gallery.");
        return;
      }
      setImages(data.images || []);
    } catch {
      setError("Unable to load gallery.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch on mount without calling setState synchronously in the effect
    // body (react-hooks/set-state-in-effect fails `next build`'s lint step
    // otherwise). `loading`/`error` already start at the right values, so
    // this only needs to set state after the request resolves.
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/admin/gallery", { cache: "no-store" });
        const data = await response.json();
        if (!active) return;
        if (!response.ok) {
          setError(data.error || "Unable to load gallery.");
          return;
        }
        setImages(data.images || []);
      } catch {
        if (active) setError("Unable to load gallery.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!files?.length) {
      setError("Please select at least one image.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.set("caption", caption);
      formData.set("category", category);
      Array.from(files).forEach((file) => formData.append("images", file));

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setMessage(
        data.errors?.length
          ? `Uploaded with some errors: ${data.errors.join(" ")}`
          : "Photos uploaded successfully.",
      );
      setCaption("");
      setCategory("");
      setFiles(null);
      await loadImages();
    } catch {
      setError("Unable to upload photos.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo? This cannot be undone.",
    );
    if (!confirmed) return;

    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/gallery/${image.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to delete photo.");
        return;
      }
      setMessage("Photo deleted successfully.");
      await loadImages();
    } catch {
      setError("Unable to delete photo.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-black">Gallery</h1>
      <p className="mt-1 text-sm text-[#555555]">Upload JPG, PNG, or WebP images up to 5MB each.</p>

      <form onSubmit={handleUpload} className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <label className="block text-sm font-bold">
          Photos*
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => setFiles(event.target.files)}
            className="mt-2 block w-full text-sm"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            Caption (optional, applied to all in this upload)
            <input
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
            />
          </label>
          <label className="block text-sm font-bold">
            Category (optional)
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Bali Trip"
              className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-full bg-[#0F9B9B] px-5 py-2.5 text-sm font-black text-white hover:bg-[#0d8585] disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Add Photo"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm font-semibold text-[#0F9B9B]">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

      {loading ? (
        <p className="mt-8 text-sm text-[#666666]">Loading gallery...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <article key={image.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.imageUrl}
                  alt={image.caption || "Gallery image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(image)}
                  className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white opacity-100 transition hover:bg-red-600 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Delete photo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3 text-sm">
                <p className="font-semibold">{image.caption || "Untitled"}</p>
                {image.category ? <p className="mt-1 text-[#666666]">{image.category}</p> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
