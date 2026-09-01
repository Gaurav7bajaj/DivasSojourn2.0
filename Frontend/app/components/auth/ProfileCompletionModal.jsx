"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const RESEND_SECONDS = 30;

export default function ProfileCompletionModal({ open, onComplete }) {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!open || !user) return;
    setFirstName((current) => current || user.firstName || "");
    setLastName((current) => current || user.lastName || "");
  }, [open, user]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldown((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const sendOtp = async () => {
    setError("");
    setStatus("");

    if (firstName.trim().length < 1) {
      setError("First name is required.");
      return;
    }
    if (lastName.trim().length < 1) {
      setError("Last name is required.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid phone number (at least 10 digits).");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/profile/send-otp", {
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

  const verifyAndSave = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (otp.replace(/\D/g, "").length < 3) {
      setError("Enter the OTP sent to your phone.");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/profile/verify-and-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, code: otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to verify OTP.");
        return;
      }
      onComplete?.();
    } catch {
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#141414] p-6 text-white shadow-2xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Welcome</p>
        <h2 id="profile-modal-title" className="mt-2 text-2xl font-black tracking-tight">
          Complete your profile
        </h2>
        <p className="mt-2 text-sm text-white/65">
          Tell us your name and verify your mobile so we can reach you about trips.
        </p>

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); sendOtp(); } : verifyAndSave} className="mt-6 space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label htmlFor="profile-firstName" className="mb-1.5 block text-sm font-semibold text-white/90">
                  First name
                </label>
                <input
                  id="profile-firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none ring-[#D4AF37] placeholder:text-white/40 focus:ring-2"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label htmlFor="profile-lastName" className="mb-1.5 block text-sm font-semibold text-white/90">
                  Last name
                </label>
                <input
                  id="profile-lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  required
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none ring-[#D4AF37] placeholder:text-white/40 focus:ring-2"
                  placeholder="Your last name"
                />
              </div>
              <div>
                <label htmlFor="profile-phone" className="mb-1.5 block text-sm font-semibold text-white/90">
                  Phone number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none ring-[#D4AF37] placeholder:text-white/40 focus:ring-2"
                  placeholder="10-digit mobile number"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-black text-[#0F0F0F] transition hover:bg-[#E8C547] disabled:opacity-60"
              >
                {sending ? "Sending OTP…" : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-white/70">
                Enter the OTP sent to <span className="font-semibold text-white">{phone}</span>
              </p>
              <div>
                <label htmlFor="profile-otp" className="mb-1.5 block text-sm font-semibold text-white/90">
                  OTP
                </label>
                <input
                  id="profile-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 tracking-[0.3em] text-white outline-none ring-[#D4AF37] placeholder:text-white/40 focus:ring-2"
                  placeholder="------"
                />
              </div>
              <button
                type="submit"
                disabled={verifying}
                className="w-full rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-black text-[#0F0F0F] transition hover:bg-[#E8C547] disabled:opacity-60"
              >
                {verifying ? "Verifying…" : "Verify & continue"}
              </button>
              <div className="flex items-center justify-between gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                    setStatus("");
                  }}
                  className="font-semibold text-white/70 hover:text-white"
                >
                  Change number
                </button>
                <button
                  type="button"
                  disabled={sending || cooldown > 0}
                  onClick={sendOtp}
                  className="font-semibold text-[#D4AF37] hover:text-[#E8C547] disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </>
          )}

          {status ? <p className="text-sm font-semibold text-[#0F9B9B]">{status}</p> : null}
          {error ? (
            <p className="text-sm font-semibold text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
