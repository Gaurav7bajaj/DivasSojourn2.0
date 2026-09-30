"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Phone } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/919990022835";
const PHONE_DISPLAY = "+91-99900 22835";
const PHONE_HREF = "tel:+919990022835";

function WhatsAppIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const initialValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ShortContactForm({
  eyebrow = "Have a question?",
  titleLead = "Reach out",
  titleEm = "to us",
  subtitle = "Ask us anything — trips, payments, what to pack. A real person will get back to you.",
  replyHours = "24 hours",
  storageKey = "divasShortLeads",
  pageLabel = "",
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const phoneDigits = values.phone.replace(/\D/g, "");

    if (values.name.trim().length < 2) {
      nextErrors.name = "Please enter at least 2 characters.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (phoneDigits.length !== 10) {
      nextErrors.phone = "Please enter a valid 10 digit phone number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          page: pageLabel,
          formType: "short",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors((current) => ({
          ...current,
          form: data.error || "Unable to send message. Please try again.",
        }));
        return;
      }

      try {
        const formEntry = {
          ...values,
          page: pageLabel,
          submittedAt: new Date().toISOString(),
        };
        const storedEntries = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
        window.localStorage.setItem(storageKey, JSON.stringify([...storedEntries, formEntry]));
      } catch {
        // optional
      }

      setIsSuccess(true);
    } catch {
      setErrors((current) => ({
        ...current,
        form: "Unable to send message. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-[52px] w-full rounded-xl border border-white/[0.14] bg-[#0F0F12] px-4 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1] outline-none transition placeholder:text-[#8F897D] focus:border-[#D6AE3C] focus:ring-2 focus:ring-[#D6AE3C]/35";

  return (
    <section
      id="reach-out"
      className="bg-[#0B0B0C] px-5 py-16 md:px-12 md:py-24 xl:px-24"
      aria-labelledby="reach-out-heading"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              {eyebrow}
            </p>
          </div>
          <h2
            id="reach-out-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[48px]"
          >
            {titleLead}{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              {titleEm}
            </em>
          </h2>
          <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6] md:text-[17px]">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3.5">
            <a
              href={PHONE_HREF}
              className="flex items-center gap-4 rounded-2xl border border-white/8 bg-[#141417] p-4 transition hover:border-[#D6AE3C]"
            >
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[rgba(214,174,60,0.14)] text-[#D6AE3C]">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
                  Call us
                </span>
                <span className="block font-[family-name:var(--font-dm-sans)] text-[16px] font-bold text-[#FBF8F1]">
                  {PHONE_DISPLAY}
                </span>
              </span>
            </a>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-white/8 bg-[#141417] p-4 transition hover:border-[#D6AE3C]"
            >
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[rgba(214,174,60,0.14)] text-[#D6AE3C]">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
                  Prefer chat?
                </span>
                <span className="block font-[family-name:var(--font-dm-sans)] text-[16px] font-bold text-[#FBF8F1]">
                  WhatsApp us
                </span>
              </span>
            </Link>
          </div>
        </div>

        <div className="rounded-[24px] border border-[rgba(214,174,60,0.22)] bg-[#141417] p-6 md:p-10">
          {isSuccess ? (
            <div className="py-8 text-center" role="status">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(214,174,60,0.16)] text-[#D6AE3C]">
                <Check className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-[#FBF8F1]">
                Message{" "}
                <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                  sent
                </em>
              </h3>
              <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#C9C3B6]">
                Thank you! We&apos;ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-8 inline-flex h-12 items-center rounded-full border-[1.5px] border-[#D6AE3C] px-6 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition hover:bg-[#D6AE3C] hover:text-[#1A1405]"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="short-name"
                    className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                  >
                    Your name <span className="text-[#D6AE3C]">*</span>
                  </label>
                  <input
                    id="short-name"
                    name="name"
                    value={values.name}
                    onChange={updateValue}
                    placeholder="Full name"
                    className={inputClass}
                    aria-invalid={Boolean(errors.name)}
                    required
                  />
                  {errors.name ? <p className="mt-2 text-sm text-red-400">{errors.name}</p> : null}
                </div>
                <div>
                  <label
                    htmlFor="short-phone"
                    className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                  >
                    Phone <span className="text-[#D6AE3C]">*</span>
                  </label>
                  <input
                    id="short-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    value={values.phone}
                    onChange={updateValue}
                    placeholder="10 digit number"
                    className={inputClass}
                    aria-invalid={Boolean(errors.phone)}
                    required
                  />
                  {errors.phone ? <p className="mt-2 text-sm text-red-400">{errors.phone}</p> : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="short-email"
                  className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                >
                  Email <span className="text-[#D6AE3C]">*</span>
                </label>
                <input
                  id="short-email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={updateValue}
                  placeholder="you@email.com"
                  className={inputClass}
                  aria-invalid={Boolean(errors.email)}
                  required
                />
                {errors.email ? <p className="mt-2 text-sm text-red-400">{errors.email}</p> : null}
              </div>

              <div>
                <label
                  htmlFor="short-message"
                  className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                >
                  Message
                </label>
                <textarea
                  id="short-message"
                  name="message"
                  value={values.message}
                  onChange={updateValue}
                  placeholder="How can we help?"
                  rows={4}
                  className="w-full rounded-xl border border-white/[0.14] bg-[#0F0F12] px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1] outline-none transition placeholder:text-[#8F897D] focus:border-[#D6AE3C] focus:ring-2 focus:ring-[#D6AE3C]/35"
                />
              </div>

              {errors.form ? (
                <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                  {errors.form}
                </p>
              ) : null}

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]">
                  We usually reply within {replyHours}.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-[56px] items-center justify-center gap-2 rounded-full bg-[#D6AE3C] px-8 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    "Send message →"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
