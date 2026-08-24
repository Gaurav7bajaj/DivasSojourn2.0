"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Blog } from "@/app/lib/data/types";

export default function BlogsAdminClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/blogs", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to load blogs.");
        return;
      }
      setBlogs(data.blogs || []);
    } catch {
      setError("Unable to load blogs.");
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
        const response = await fetch("/api/admin/blogs", { cache: "no-store" });
        const data = await response.json();
        if (!active) return;
        if (!response.ok) {
          setError(data.error || "Unable to load blogs.");
          return;
        }
        setBlogs(data.blogs || []);
      } catch {
        if (active) setError("Unable to load blogs.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (blog: Blog) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to delete blog.");
        return;
      }
      setMessage("Blog deleted successfully.");
      await loadBlogs();
    } catch {
      setError("Unable to delete blog.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Blogs</h1>
          <p className="mt-1 text-sm text-[#555555]">All posts including unpublished drafts.</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-full bg-[#0F9B9B] px-5 py-2.5 text-sm font-black text-white hover:bg-[#0d8585]"
        >
          Add New Blog
        </Link>
      </div>

      {message ? <p className="mt-4 text-sm font-semibold text-[#0F9B9B]">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#FAFAFA] text-xs uppercase tracking-wide text-[#666666]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#666666]">
                  Loading blogs...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#666666]">
                  No blogs yet.
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-semibold">{blog.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        blog.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#555555]">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="font-bold text-[#0F9B9B] hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(blog)}
                        className="font-bold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
