"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogOut, UserRound } from "lucide-react";
import PayNowButton from "../components/payments/PayNowButton";
import { safeNextPath } from "../lib/safeNextPath";

type Traveler = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
};

type BookingRow = {
  id: string;
  tripSlug: string;
  tripTitle: string;
  tripImage: string;
  destination: string;
  passengerName?: string;
  passengerPhone?: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  amountPaid: string;
  remainingBalance?: string;
  fullyPaid: boolean;
  isPast: boolean;
  pendingPayment: {
    installmentId: string;
    label: string;
    amount: string;
    dueDate?: string | null;
    canPayEarly?: boolean;
    isDue?: boolean;
  } | null;
  installments: {
    id: string;
    stage: string;
    label: string;
    amountDue: string;
    dueDate: string | null;
    status: string;
    paidAt: string | null;
    canPayEarly?: boolean;
  }[];
};

type BookingsPayload = {
  bookings: BookingRow[];
  previous: BookingRow[];
  upcoming: BookingRow[];
  pendingPayments: BookingRow[];
};

type TabId = "upcoming" | "previous" | "pending" | "profile";

type Props = {
  initialTraveler?: Traveler | null;
  initialBookings?: BookingsPayload;
};

export default function AccountClient({
  initialTraveler = null,
  initialBookings,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"), "");

  const [traveler, setTraveler] = useState<Traveler | null>(initialTraveler);
  const [previous, setPrevious] = useState<BookingRow[]>(
    initialBookings?.previous || [],
  );
  const [upcoming, setUpcoming] = useState<BookingRow[]>(
    initialBookings?.upcoming || [],
  );
  const [pendingPayments, setPendingPayments] = useState<BookingRow[]>(
    initialBookings?.pendingPayments || [],
  );
  const [loading, setLoading] = useState(!initialTraveler);
  const [bookingsError, setBookingsError] = useState("");
  const [tab, setTab] = useState<TabId>("upcoming");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const [editName, setEditName] = useState(initialTraveler?.fullName || "");
  const [editEmail, setEditEmail] = useState(initialTraveler?.email || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const applyBookings = useCallback((data: BookingsPayload) => {
    setPrevious(data.previous || []);
    setUpcoming(data.upcoming || []);
    setPendingPayments(data.pendingPayments || []);
  }, []);

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setBookingsError("");
    try {
      const meRes = await fetch("/api/account/me", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!meRes.ok) {
        setTraveler(null);
        setPrevious([]);
        setUpcoming([]);
        setPendingPayments([]);
        return;
      }
      const meData = await meRes.json();
      const t = meData.traveler as Traveler;
      setTraveler(t);
      setEditName(t.fullName);
      setEditEmail(t.email || "");

      const bookingsRes = await fetch("/api/account/bookings", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (bookingsRes.ok) {
        const data = (await bookingsRes.json()) as BookingsPayload;
        applyBookings(data);
      } else {
        setBookingsError("Could not refresh bookings. Pull to refresh or try again.");
      }
    } catch {
      // Keep any server-provided initial data; only clear if we had no session seed.
      if (!initialTraveler) setTraveler(null);
      setBookingsError("Could not load account. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [applyBookings, initialTraveler]);

  useEffect(() => {
    // Server already hydrated a signed-in account — still refresh in background.
    if (initialTraveler) {
      setLoading(false);
      void loadAccount();
      return;
    }
    void loadAccount();
  }, [initialTraveler, loadAccount]);

  useEffect(() => {
    if (!loading && traveler && nextPath) {
      router.replace(nextPath);
    }
  }, [loading, traveler, nextPath, router]);

  async function onSendOtp(event: FormEvent) {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      const response = await fetch("/api/account/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to send OTP");
      }
      setOtpSent(true);
      setAuthMessage("OTP sent to your WhatsApp / SMS. Enter it below.");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Unable to send OTP");
    } finally {
      setAuthLoading(false);
    }
  }

  async function onVerify(event: FormEvent) {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      const response = await fetch("/api/account/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, email, code: otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to verify OTP");
      }
      setOtp("");
      setOtpSent(false);
      router.refresh();
      if (nextPath) {
        router.replace(nextPath);
        return;
      }
      await loadAccount();
      setTab("upcoming");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Unable to verify OTP");
    } finally {
      setAuthLoading(false);
    }
  }

  async function onLogout() {
    await fetch("/api/account/logout", { method: "POST" });
    setTraveler(null);
    setPrevious([]);
    setUpcoming([]);
    setPendingPayments([]);
    setOtpSent(false);
    setOtp("");
  }

  async function onSaveProfile(event: FormEvent) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setProfileSaving(true);
    try {
      const response = await fetch("/api/account/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: editName, email: editEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update profile");
      }
      setTraveler(data.traveler);
      setProfileMessage("Details saved.");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Unable to update");
    } finally {
      setProfileSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#0B0B0C] px-6 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#D6AE3C]" aria-hidden="true" />
        <span className="sr-only">Loading account</span>
      </div>
    );
  }

  if (!traveler) {
    return (
      <section className="bg-[#0B0B0C] px-6 py-16 md:px-12 md:py-24 xl:px-24">
        <div className="mx-auto max-w-[480px]">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Traveler account
            </p>
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]">
            Sign in with{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              your phone
            </em>
          </h1>
          <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[15px] leading-relaxed text-[#C9C3B6]">
            {nextPath
              ? "Sign in with your full name and phone to continue booking. We will take you back to checkout after verification."
              : "Enter your full name and verify your number so only you see your trips, bookings, and pending payments."}
          </p>

          <form
            onSubmit={otpSent ? onVerify : onSendOtp}
            className="mt-8 space-y-4 rounded-[24px] border border-white/[0.08] bg-[#141417] p-6 md:p-8"
          >
            <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
              Full name
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={otpSent}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1] disabled:opacity-60"
                autoComplete="name"
              />
            </label>

            <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
              Phone (10 digits)
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                disabled={otpSent}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1] disabled:opacity-60"
                autoComplete="tel"
              />
            </label>

            <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
              Email (optional)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1] disabled:opacity-60"
                autoComplete="email"
              />
            </label>

            {otpSent ? (
              <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
                OTP
                <input
                  required
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm tracking-[0.3em] text-[#FBF8F1]"
                  autoComplete="one-time-code"
                />
              </label>
            ) : null}

            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] disabled:opacity-60"
            >
              {authLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Please wait…
                </>
              ) : otpSent ? (
                "Verify & open account"
              ) : (
                "Send OTP"
              )}
            </button>

            {otpSent ? (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setAuthMessage("");
                }}
                className="w-full font-[family-name:var(--font-dm-sans)] text-sm text-[#8F897D] underline-offset-2 hover:text-[#D6AE3C] hover:underline"
              >
                Change name or number
              </button>
            ) : null}

            {authMessage ? (
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[#D6AE3C]">
                {authMessage}
              </p>
            ) : null}
            {authError ? (
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-red-400" role="alert">
                {authError}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    );
  }

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "upcoming", label: "Upcoming", count: upcoming.length },
    { id: "previous", label: "Previous trips", count: previous.length },
    { id: "pending", label: "Pending payments", count: pendingPayments.length },
    { id: "profile", label: "My details" },
  ];

  const list =
    tab === "upcoming"
      ? upcoming
      : tab === "previous"
        ? previous
        : tab === "pending"
          ? pendingPayments
          : [];

  return (
    <section className="bg-[#0B0B0C] px-6 py-16 md:px-12 md:py-24 xl:px-24">
      <div className="mx-auto max-w-[960px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Your account
              </p>
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]">
              Hello,{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                {traveler.fullName.split(" ")[0]}
              </em>
            </h1>
            <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-sm text-[#8F897D]">
              {traveler.phone}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[#C9C3B6] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>

        {bookingsError ? (
          <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-sm text-red-400" role="alert">
            {bookingsError}{" "}
            <button
              type="button"
              onClick={() => void loadAccount()}
              className="underline underline-offset-2"
            >
              Retry
            </button>
          </p>
        ) : null}

        <div
          role="tablist"
          aria-label="Account sections"
          className="mt-10 flex flex-wrap gap-2"
        >
          {tabs.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(item.id)}
                className={`rounded-full px-4 py-2 font-[family-name:var(--font-dm-sans)] text-sm font-semibold transition ${
                  selected
                    ? "bg-[#D6AE3C] text-[#1A1405]"
                    : "border border-white/10 text-[#C9C3B6] hover:text-[#FBF8F1]"
                }`}
              >
                {item.label}
                {item.count != null ? (
                  <span className="ml-1.5 opacity-70">({item.count})</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {tab === "profile" ? (
          <form
            onSubmit={onSaveProfile}
            className="mt-8 max-w-lg space-y-4 rounded-[24px] border border-white/[0.08] bg-[#141417] p-6 md:p-8"
          >
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1C1C21] text-[#D6AE3C]">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </div>
            <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
              Full name
              <input
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1]"
              />
            </label>
            <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
              Email
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1]"
              />
            </label>
            <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
              Phone
              <input
                disabled
                value={traveler.phone}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#8F897D]"
              />
              <span className="mt-1 block text-[12px] font-normal text-[#8F897D]">
                Phone is your login ID and cannot be changed here.
              </span>
            </label>
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex h-[48px] items-center justify-center gap-2 rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405] disabled:opacity-60"
            >
              {profileSaving ? "Saving…" : "Save details"}
            </button>
            {profileMessage ? (
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[#D6AE3C]">
                {profileMessage}
              </p>
            ) : null}
            {profileError ? (
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-red-400" role="alert">
                {profileError}
              </p>
            ) : null}
          </form>
        ) : list.length === 0 ? (
          <p className="mt-10 font-[family-name:var(--font-dm-sans)] text-[#8F897D]">
            {tab === "pending"
              ? "No pending payments right now."
              : tab === "previous"
                ? "No previous trips yet."
                : "No upcoming bookings yet."}
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {list.map((booking) => (
              <li
                key={booking.id}
                className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#141417]"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start md:p-6">
                  {booking.tripImage ? (
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-36">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={booking.tripImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#FBF8F1]">
                      {booking.tripTitle}
                    </h2>
                    <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm text-[#8F897D]">
                      {booking.startDate
                        ? new Date(booking.startDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Dates TBC"}
                      {booking.endDate
                        ? ` – ${new Date(booking.endDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}`
                        : ""}
                    </p>
                    {booking.passengerName ? (
                      <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm text-[#8F897D]">
                        Traveler: {booking.passengerName}
                        {booking.passengerPhone ? ` · ${booking.passengerPhone}` : ""}
                      </p>
                    ) : null}
                    <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-sm text-[#C9C3B6]">
                      Paid ₹{Number(booking.amountPaid).toLocaleString("en-IN")} of ₹
                      {Number(booking.totalAmount).toLocaleString("en-IN")}
                      {booking.fullyPaid
                        ? " · Fully paid"
                        : booking.remainingBalance
                          ? ` · ₹${Number(booking.remainingBalance).toLocaleString("en-IN")} left`
                          : ""}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {booking.installments.map((row) => (
                        <li
                          key={row.id}
                          className="flex justify-between gap-3 font-[family-name:var(--font-dm-sans)] text-sm text-[#8F897D]"
                        >
                          <span>
                            {row.label}
                            <span className="ml-2 uppercase tracking-wide text-[11px]">
                              {row.status}
                            </span>
                            {row.dueDate && row.status !== "PAID" ? (
                              <span className="mt-0.5 block text-[12px] normal-case tracking-normal text-[#8F897D]">
                                Due by{" "}
                                {new Date(row.dueDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            ) : null}
                          </span>
                          <span className="shrink-0 text-[#C9C3B6]">
                            ₹{Number(row.amountDue).toLocaleString("en-IN")}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {booking.pendingPayment ? (
                      <div className="mt-5">
                        <p className="mb-3 font-[family-name:var(--font-dm-sans)] text-sm text-[#D6AE3C]">
                          {booking.pendingPayment.canPayEarly
                            ? "Pay early"
                            : "Due now"}
                          : {booking.pendingPayment.label} — ₹
                          {Number(booking.pendingPayment.amount).toLocaleString("en-IN")}
                          {booking.pendingPayment.dueDate &&
                          booking.pendingPayment.canPayEarly
                            ? ` (scheduled by ${new Date(
                                booking.pendingPayment.dueDate,
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })})`
                            : ""}
                        </p>
                        <PayNowButton
                          bookingId={booking.id}
                          installmentId={booking.pendingPayment.installmentId}
                          label={`${
                            booking.pendingPayment.canPayEarly ? "Pay early" : "Pay"
                          } ₹${Number(booking.pendingPayment.amount).toLocaleString("en-IN")}`}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </section>
  );
}
