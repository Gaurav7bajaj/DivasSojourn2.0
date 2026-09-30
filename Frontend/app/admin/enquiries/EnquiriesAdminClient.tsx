"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Mail, Phone, Trash2 } from "lucide-react";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  page: string;
  interestedIn: string;
  travelDate: string;
  travelers: string;
  formType: string;
  read: boolean;
  createdAt: string;
};

export default function EnquiriesAdminClient() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadEnquiries = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/enquiries", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to load enquiries.");
        return;
      }
      setEnquiries(data.enquiries || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setError("Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/admin/enquiries", { cache: "no-store" });
        const data = await response.json();
        if (!active) return;
        if (!response.ok) {
          setError(data.error || "Unable to load enquiries.");
          return;
        }
        setEnquiries(data.enquiries || []);
        setUnreadCount(data.unreadCount || 0);
      } catch {
        if (active) setError("Unable to load enquiries.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const markRead = async (enquiry: Enquiry, read: boolean) => {
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to update enquiry.");
        return;
      }
      setEnquiries((current) =>
        current.map((item) => (item.id === enquiry.id ? { ...item, read } : item)),
      );
      setUnreadCount((count) => {
        if (enquiry.read === read) return count;
        return read ? Math.max(0, count - 1) : count + 1;
      });
      setMessage(read ? "Marked as read." : "Marked as unread.");
    } catch {
      setError("Unable to update enquiry.");
    }
  };

  const handleDelete = async (enquiry: Enquiry) => {
    const confirmed = window.confirm(
      `Delete enquiry from ${enquiry.name}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to delete enquiry.");
        return;
      }
      setEnquiries((current) => current.filter((item) => item.id !== enquiry.id));
      if (!enquiry.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      setMessage("Enquiry deleted.");
    } catch {
      setError("Unable to delete enquiry.");
    }
  };

  const markAllRead = async () => {
    const unread = enquiries.filter((item) => !item.read);
    if (!unread.length) return;

    setError("");
    setMessage("");
    try {
      await Promise.all(
        unread.map((enquiry) =>
          fetch(`/api/admin/enquiries/${enquiry.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
          }),
        ),
      );
      setEnquiries((current) => current.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
      setMessage("All enquiries marked as read.");
    } catch {
      setError("Unable to mark all as read.");
      await loadEnquiries();
    }
  };

  const visible = filter === "unread" ? enquiries.filter((item) => !item.read) : enquiries;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Enquiries</h1>
          <p className="mt-2 text-sm text-[#555555]">
            Form submissions from the website.{" "}
            {unreadCount > 0 ? (
              <span className="font-semibold text-[#0F9B9B]">
                {unreadCount} unread
              </span>
            ) : (
              "All caught up."
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === "all"
                ? "bg-[#1A1A1A] text-white"
                : "border border-black/10 bg-white text-[#555555]"
            }`}
          >
            All ({enquiries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === "unread"
                ? "bg-[#1A1A1A] text-white"
                : "border border-black/10 bg-white text-[#555555]"
            }`}
          >
            Unread ({unreadCount})
          </button>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="rounded-full border border-[#0F9B9B]/40 bg-[#0F9B9B]/10 px-4 py-2 text-sm font-semibold text-[#0F9B9B]"
            >
              Mark all read
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-8 text-sm text-[#555555]">Loading enquiries…</p>
      ) : visible.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white px-6 py-12 text-center text-sm text-[#555555]">
          {filter === "unread" ? "No unread enquiries." : "No enquiries yet."}
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {visible.map((enquiry) => (
            <li
              key={enquiry.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${
                enquiry.read ? "border-black/10" : "border-[#0F9B9B]/50 ring-1 ring-[#0F9B9B]/20"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black">{enquiry.name}</h2>
                    {!enquiry.read ? (
                      <span className="rounded-full bg-[#0F9B9B] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                        New
                      </span>
                    ) : null}
                    {enquiry.page ? (
                      <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-semibold text-[#555555]">
                        {enquiry.page}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-[#888888]">
                    {new Date(enquiry.createdAt).toLocaleString()} ·{" "}
                    {enquiry.formType === "contact" ? "Full contact form" : "Short form"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!enquiry.read ? (
                    <button
                      type="button"
                      onClick={() => markRead(enquiry, true)}
                      className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Read
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markRead(enquiry, false)}
                      className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-[#555555] hover:bg-black/5"
                    >
                      Mark unread
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(enquiry)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <a
                  href={`mailto:${enquiry.email}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#0F9B9B] hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {enquiry.email}
                </a>
                <a
                  href={`tel:${enquiry.phone}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#1A1A1A] hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {enquiry.phone}
                </a>
              </div>

              {(enquiry.interestedIn || enquiry.travelDate || enquiry.travelers) && (
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#555555]">
                  {enquiry.interestedIn ? (
                    <span>
                      Interested in: <strong>{enquiry.interestedIn}</strong>
                    </span>
                  ) : null}
                  {enquiry.travelDate ? (
                    <span>
                      Travel date: <strong>{enquiry.travelDate}</strong>
                    </span>
                  ) : null}
                  {enquiry.travelers ? (
                    <span>
                      Travelers: <strong>{enquiry.travelers}</strong>
                    </span>
                  ) : null}
                </div>
              )}

              {enquiry.message ? (
                <p className="mt-3 whitespace-pre-wrap rounded-xl bg-[#F8F8F8] px-4 py-3 text-sm text-[#333333]">
                  {enquiry.message}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
