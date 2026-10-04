"use client";

import { useEffect, useState } from "react";
import { Lock, X } from "lucide-react";

const RESEND_SECONDS = 30;

export default function ItineraryUnlockModal({ open, onClose, onUnlocked, tripName }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setOtp("");
      setError("");
      setStatus("");
      setCooldown(0);
    }
  }, [open]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldown((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  if (!open) return null;

  const sendCode = async () => {
    setError("");
    setStatus("");
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid phone number (at least 10 digits).");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/itinerary/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to send OTP.");
        return;
      }
      setStep(2);
      setCooldown(RESEND_SECONDS);
      setStatus("OTP sent to your phone.");
    } catch {
      setError("Unable to send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (otp.replace(/\D/g, "").length < 3) {
      setError("Enter the OTP sent to your phone.");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/itinerary/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to verify OTP.");
        return;
      }
      onUnlocked?.();
    } catch {
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="itinerary-unlock-title"
    >
      <div className="relative w-full max-w-md rounded-[24px] border border-white/10 bg-[#141417] p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#C9C3B6] transition hover:bg-white/5 hover:text-[#FBF8F1]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(214,174,60,0.45)] text-[#D6AE3C]">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>

        <h2
          id="itinerary-unlock-title"
          className="mt-5 font-[family-name:var(--font-playfair)] text-[1.75rem] font-semibold text-[#FBF8F1]"
        >
          Verify to view itinerary
        </h2>
        <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[15px] leading-6 text-[#D9D3C6]">
          {tripName
            ? `Enter your mobile number to unlock the day-by-day plan for ${tripName}.`
            : "Enter your mobile number to unlock the full day-by-day itinerary."}
        </p>

        {step === 1 ? (
          <div className="mt-6 space-y-4">
            <label
              htmlFor="itinerary-phone"
              className="block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
            >
              Mobile number
            </label>
            <input
              id="itinerary-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="h-12 w-full rounded-full border border-white/10 bg-[#0F0F12] px-5 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1] outline-none placeholder:text-[#8F897D] focus:border-[#D6AE3C]"
            />
            <button
              type="button"
              onClick={sendCode}
              disabled={sending}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] disabled:opacity-60"
            >
              {sending ? "Sending OTP…" : "Send OTP"}
            </button>
          </div>
        ) : (
          <form onSubmit={verifyCode} className="mt-6 space-y-4">
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]">
              Enter the OTP sent to{" "}
              <span className="font-semibold text-[#FBF8F1]">{phone}</span>
            </p>
            <label
              htmlFor="itinerary-otp"
              className="block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
            >
              OTP
            </label>
            <input
              id="itinerary-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="h-12 w-full rounded-full border border-white/10 bg-[#0F0F12] px-5 font-[family-name:var(--font-dm-sans)] text-[15px] tracking-[0.2em] text-[#FBF8F1] outline-none placeholder:tracking-normal placeholder:text-[#8F897D] focus:border-[#D6AE3C]"
            />
            <button
              type="submit"
              disabled={verifying}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] disabled:opacity-60"
            >
              {verifying ? "Verifying…" : "Verify & unlock"}
            </button>
            <button
              type="button"
              disabled={cooldown > 0 || sending}
              onClick={sendCode}
              className="w-full font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#D6AE3C] disabled:text-[#8F897D]"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setStatus("");
              }}
              className="w-full font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D] hover:text-[#C9C3B6]"
            >
              Change number
            </button>
          </form>
        )}

        {status ? (
          <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#D6AE3C]" role="status">
            {status}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-red-300" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
