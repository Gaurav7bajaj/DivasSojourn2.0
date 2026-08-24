"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const RESEND_SECONDS = 60;

export default function PhoneAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { login, isAuthenticated } = useAuth();

  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  useEffect(() => {
    if (resendIn <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResendIn((value) => value - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendIn]);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || "Unable to send OTP.");
        return;
      }

      setStep("otp");
      setResendIn(RESEND_SECONDS);
      setStatus(
        data.mock
          ? "OTP sent. Dev mode: use the MOCK_OTP value from your .env file."
          : "OTP sent to your mobile number.",
      );
    } catch {
      setStatus("Unable to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          otp,
          name: mode === "signup" ? name : "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || "Unable to verify OTP.");
        return;
      }

      const success = login({ token: data.token, user: data.user });

      if (!success) {
        setStatus("Session could not be created. Please try again.");
        return;
      }

      router.replace(redirectTo);
    } catch {
      setStatus("Unable to verify OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#D4AF37]/25 bg-white p-6 shadow-2xl md:p-8">
      <div className="mb-6 flex rounded-full bg-[#F5F5F5] p-1">
        {[
          { id: "login", label: "Login" },
          { id: "signup", label: "Sign up" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id);
              setStep("phone");
              setStatus("");
            }}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-black transition ${
              mode === item.id
                ? "bg-[#0F9B9B] text-white"
                : "text-[#555555] hover:text-[#1A1A1A]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {mode === "signup" ? (
            <label className="block text-sm font-black text-[#1A1A1A]">
              Full Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-2xl border border-[#D4AF37]/25 bg-[#F9F9F9] px-4 py-3 text-sm outline-none transition focus:border-[#0F9B9B] focus:ring-4 focus:ring-[#0F9B9B]/15"
              />
            </label>
          ) : null}

          <label className="block text-sm font-black text-[#1A1A1A]">
            Mobile Number*
            <div className="mt-2 flex overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#F9F9F9] focus-within:border-[#0F9B9B] focus-within:ring-4 focus-within:ring-[#0F9B9B]/15">
              <span className="flex items-center px-4 text-sm font-bold text-[#555555]">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10 digit mobile number"
                inputMode="numeric"
                maxLength={10}
                required
                className="w-full bg-transparent px-2 py-3 text-sm outline-none"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || phone.length !== 10}
            className="w-full rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-black text-[#0F0F0F] transition hover:bg-[#E8C547] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm font-semibold text-[#555555]">
            Enter the 6-digit OTP sent to +91 {phone}
          </p>

          <label className="block text-sm font-black text-[#1A1A1A]">
            OTP*
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6 digit OTP"
              inputMode="numeric"
              maxLength={6}
              required
              className="mt-2 w-full rounded-2xl border border-[#D4AF37]/25 bg-[#F9F9F9] px-4 py-3 text-sm tracking-[0.4em] outline-none transition focus:border-[#0F9B9B] focus:ring-4 focus:ring-[#0F9B9B]/15"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full rounded-full bg-[#0F9B9B] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0d8585] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setStatus("");
              }}
              className="font-bold text-[#555555] transition hover:text-[#0F9B9B]"
            >
              Change number
            </button>
            <button
              type="button"
              disabled={resendIn > 0 || isSubmitting}
              onClick={handleSendOtp}
              className="font-bold text-[#D4AF37] transition hover:text-[#0F9B9B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {status ? <p className="mt-4 text-sm font-semibold text-[#1A1A1A]">{status}</p> : null}
    </div>
  );
}
