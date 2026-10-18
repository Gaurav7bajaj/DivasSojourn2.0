"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Faq = {
  id: string;
  slug: string;
  sortOrder: number;
  category: string;
  question: string;
  answer: string;
  published: boolean;
};

const emptyForm = {
  category: "",
  question: "",
  answer: "",
  slug: "",
  sortOrder: "",
  published: true,
};

export default function FaqsAdminClient() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/admin/faqs", { cache: "no-store" });
        const data = await response.json();
        if (cancelled) return;
        if (!response.ok) throw new Error(data.error || "Failed to load");
        setFaqs(data.faqs || []);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load FAQs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/faqs", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load");
      setFaqs(data.faqs || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load FAQs");
    }
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        category: form.category,
        question: form.question,
        answer: form.answer,
        slug: form.slug.trim() || undefined,
        sortOrder: form.sortOrder === "" ? undefined : Number(form.sortOrder),
        published: form.published,
      };
      const response = await fetch(
        editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save FAQ");
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  }

  async function removeFaq(id: string) {
    if (!window.confirm("Delete this FAQ from the website?")) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete");
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete FAQ");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(faq: Faq) {
    setEditingId(faq.id);
    setForm({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      slug: faq.slug,
      sortOrder: String(faq.sortOrder),
      published: faq.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return <p className="text-sm text-[#555555]">Loading FAQs…</p>;
  }

  return (
    <div className="space-y-10">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">
          {editingId ? "Edit FAQ" : "Add FAQ"}
        </h2>
        <p className="mt-1 text-sm text-[#555555]">
          Changes appear on the public /faqs page after save.
        </p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="block text-xs font-semibold text-[#555555]">
            Category
            <input
              required
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="Safety"
              className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-semibold text-[#555555]">
            Question
            <input
              required
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-semibold text-[#555555]">
            Answer
            <textarea
              required
              rows={5}
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[#555555]">
              Slug (optional)
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto from question"
                className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold text-[#555555]">
              Sort order
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                placeholder="auto"
                className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#555555]">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Published on website
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#1A1A1A] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Update FAQ" : "Add FAQ"}
            </button>
            {editingId ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-bold disabled:opacity-50"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">All FAQs ({faqs.length})</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((faq) => (
            <article
              key={faq.id}
              className="rounded-xl border border-black/10 bg-[#FAFAFA] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0F9B9B]">
                    {faq.category}
                    {!faq.published ? " · Hidden" : ""}
                    {" · #"}
                    {faq.sortOrder}
                  </p>
                  <h3 className="mt-1 text-base font-black">{faq.question}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-[#555555]">{faq.answer}</p>
                  <p className="mt-2 text-xs text-[#888888]">slug: {faq.slug}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => startEdit(faq)}
                    className="rounded-full border border-black/15 bg-white px-4 py-1.5 text-xs font-bold disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => removeFaq(faq.id)}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-bold text-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!faqs.length ? (
            <p className="text-sm text-[#555555]">No FAQs yet. Add one above.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
