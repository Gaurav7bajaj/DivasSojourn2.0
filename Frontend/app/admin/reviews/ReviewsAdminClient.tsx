"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Review = {
  id: string;
  sortOrder: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  url: string;
};

type Platform = {
  id: string;
  platform: string;
  rating: number | null;
  ratingLabel: string | null;
  count: number;
  countLabel: string;
  href: string;
};

const emptyForm = {
  name: "",
  date: "",
  rating: 5,
  text: "",
  url: "",
};

export default function ReviewsAdminClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/reviews", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load");
      setReviews(data.reviews || []);
      setPlatforms(data.platforms || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function savePlatform(platform: Platform) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/platform-stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: platform.id,
          rating: platform.rating,
          ratingLabel: platform.ratingLabel,
          count: platform.count,
          countLabel: `${platform.count}+ reviews`,
          href: platform.href,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save platform");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitReview(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        editingId ? `/api/admin/reviews/${editingId}` : "/api/admin/reviews",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save review");
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save review");
    } finally {
      setSaving(false);
    }
  }

  async function removeReview(id: string) {
    if (!window.confirm("Delete this review from the website wall?")) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete");
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(review: Review) {
    setEditingId(review.id);
    setForm({
      name: review.name,
      date: review.date,
      rating: review.rating,
      text: review.text,
      url: review.url,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return <p className="text-sm text-[#555555]">Loading reviews…</p>;
  }

  return (
    <div className="space-y-10">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Platform ratings & counts</h2>
        <p className="mt-1 text-sm text-[#555555]">
          Updates the Google / TripAdvisor / Facebook cards on the home page and the Google reviews
          wall count.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="rounded-xl border border-black/10 bg-[#FAFAFA] p-4"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0F9B9B]">
                {platform.platform}
              </p>
              <label className="mt-3 block text-xs font-semibold text-[#555555]">
                Review count
                <input
                  type="number"
                  min={0}
                  value={platform.count}
                  onChange={(e) =>
                    setPlatforms((prev) =>
                      prev.map((p) =>
                        p.id === platform.id
                          ? { ...p, count: Number(e.target.value) || 0 }
                          : p,
                      ),
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
                />
              </label>
              {platform.id === "facebook" ? (
                <label className="mt-3 block text-xs font-semibold text-[#555555]">
                  Rating label
                  <input
                    type="text"
                    value={platform.ratingLabel || ""}
                    onChange={(e) =>
                      setPlatforms((prev) =>
                        prev.map((p) =>
                          p.id === platform.id
                            ? { ...p, ratingLabel: e.target.value }
                            : p,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </label>
              ) : (
                <label className="mt-3 block text-xs font-semibold text-[#555555]">
                  Rating
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={5}
                    value={platform.rating ?? ""}
                    onChange={(e) =>
                      setPlatforms((prev) =>
                        prev.map((p) =>
                          p.id === platform.id
                            ? {
                                ...p,
                                rating:
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                              }
                            : p,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </label>
              )}
              <label className="mt-3 block text-xs font-semibold text-[#555555]">
                Link URL
                <input
                  type="url"
                  value={platform.href}
                  onChange={(e) =>
                    setPlatforms((prev) =>
                      prev.map((p) =>
                        p.id === platform.id ? { ...p, href: e.target.value } : p,
                      ),
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
                />
              </label>
              <button
                type="button"
                disabled={saving}
                onClick={() => savePlatform(platform)}
                className="mt-4 w-full rounded-full bg-[#1A1A1A] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                Save {platform.platform}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">
          {editingId ? "Edit review" : "Add review"}
        </h2>
        <p className="mt-1 text-sm text-[#555555]">
          These appear on the Google reviews wall on every page (same set everywhere). Paste text
          exactly from Google.
        </p>
        <form onSubmit={onSubmitReview} className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="block text-xs font-semibold text-[#555555]">
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-semibold text-[#555555]">
            Date (e.g. 3 months ago)
            <input
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-semibold text-[#555555]">
            Stars
            <input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({ ...f, rating: Number(e.target.value) || 5 }))
              }
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-semibold text-[#555555]">
            Google review link
            <input
              required
              type="url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <label className="md:col-span-2 block text-xs font-semibold text-[#555555]">
            Review text (exact from Google)
            <textarea
              required
              rows={6}
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-black text-[#1A1A1A] disabled:opacity-50"
            >
              {editingId ? "Update review" : "Add review"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Review wall ({reviews.length})</h2>
        <p className="mt-1 text-sm text-[#555555]">
          Order is top-to-bottom (1–10 = row 1, 11–20 = row 2 on the site).
        </p>
        <ul className="mt-5 space-y-3">
          {reviews.map((review, index) => (
            <li
              key={review.id}
              className="rounded-xl border border-black/10 bg-[#FAFAFA] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0F9B9B]">
                    #{index + 1} · {review.rating}/5 · {review.date}
                  </p>
                  <p className="mt-1 font-bold text-[#1A1A1A]">{review.name}</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-[#444444] line-clamp-3">
                    {review.text}
                  </p>
                  <a
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-[#0F9B9B] underline"
                  >
                    Open Google link
                  </a>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(review)}
                    className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-bold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeReview(review.id)}
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
