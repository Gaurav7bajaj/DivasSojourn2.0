"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, X } from "lucide-react";

const WHEN_OPTIONS = [
  { value: "flexible", label: "I'm flexible" },
  { value: "next-12-months", label: "Next 12 months" },
];

const GROUP_OPTIONS = [
  { value: "just-me", label: "Just me" },
  { value: "2-4", label: "2–4" },
  { value: "5-10", label: "5–10" },
  { value: "10+", label: "10+ women" },
];

const initialValues = {
  name: "",
  phone: "",
  travelDate: "flexible",
  travelers: "just-me",
  customWhere: "",
};

export default function DestinationEnquiryModal({ destination, onClose }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isCustom = Boolean(destination?.isCustom);
  const displayName = isCustom ? "dream" : destination?.name || "trip";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
  }, [destination?.slug]);

  if (!destination) return null;

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
    if (phoneDigits.length !== 10) {
      nextErrors.phone = "Please enter a valid 10 digit phone number.";
    }
    if (isCustom && values.customWhere.trim().length < 2) {
      nextErrors.customWhere = "Please tell us where you'd like to go.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const phoneDigits = values.phone.replace(/\D/g, "");
    const interestedIn = isCustom
      ? values.customWhere.trim()
      : destination.name;
    const whenLabel =
      WHEN_OPTIONS.find((option) => option.value === values.travelDate)?.label ||
      values.travelDate;
    const groupLabel =
      GROUP_OPTIONS.find((option) => option.value === values.travelers)?.label ||
      values.travelers;

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: phoneDigits,
          email: "",
          message: `When: ${whenLabel}. Group: ${groupLabel}.${
            isCustom ? ` Custom destination: ${values.customWhere.trim()}.` : ""
          }`,
          page: "tailored-trips",
          interestedIn,
          travelDate: whenLabel,
          travelers: groupLabel,
          formType: "short",
          source: "tailored-trips",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors((current) => ({
          ...current,
          form: data.error || "Unable to submit. Please try again.",
        }));
        return;
      }

      try {
        const formEntry = {
          destination: interestedIn,
          destinationSlug: destination.slug,
          ...values,
          submittedAt: new Date().toISOString(),
        };
        const storedEntries = JSON.parse(
          window.localStorage.getItem("divasTailoredTripLeads") || "[]",
        );
        window.localStorage.setItem(
          "divasTailoredTripLeads",
          JSON.stringify([...storedEntries, formEntry]),
        );
      } catch {
        // optional backup
      }

      setIsSuccess(true);
    } catch {
      setErrors((current) => ({
        ...current,
        form: "Unable to submit. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-[50px] w-full rounded-xl border border-white/[0.14] bg-[#0F0F12] px-4 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1] outline-none transition placeholder:text-[#8F897D] focus:border-[#D6AE3C] focus:ring-2 focus:ring-[#D6AE3C]/35";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[rgba(5,5,7,0.72)] p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[24px] border border-[rgba(214,174,60,0.35)] bg-[#141417] p-6 shadow-2xl sm:max-w-[560px] sm:rounded-[24px] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(214,174,60,0.16)] text-[#D6AE3C]">
              <Check className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2
              id={titleId}
              className="mt-5 font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-[#FBF8F1] md:text-[32px]"
            >
              Your {isCustom ? "dream" : destination.name} trip is{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                in motion
              </em>
            </h2>
            <p className="mx-auto mt-3 max-w-md font-[family-name:var(--font-dm-sans)] text-[15px] leading-7 text-[#C9C3B6]">
              Thank you! Our team will call you soon to start planning.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex h-12 items-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 pr-12">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Tailored trip
              </p>
            </div>
            <h2
              id={titleId}
              className="mt-4 font-[family-name:var(--font-playfair)] text-[28px] font-semibold leading-tight text-[#FBF8F1] md:text-[32px]"
            >
              Plan your{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                {displayName}
              </em>{" "}
              trip
            </h2>
            <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#C9C3B6]">
              Share a few details and our team will reach out to shape your itinerary.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {isCustom ? (
                <div>
                  <label
                    htmlFor="tailored-custom-where"
                    className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                  >
                    Where would you like to go? <span className="text-[#D6AE3C]">*</span>
                  </label>
                  <input
                    id="tailored-custom-where"
                    name="customWhere"
                    value={values.customWhere}
                    onChange={updateValue}
                    placeholder="e.g. Japan, Iceland, Bhutan…"
                    className={inputClass}
                    aria-invalid={Boolean(errors.customWhere)}
                  />
                  {errors.customWhere ? (
                    <p className="mt-2 text-sm text-red-400">{errors.customWhere}</p>
                  ) : null}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="tailored-name"
                    className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                  >
                    Your name <span className="text-[#D6AE3C]">*</span>
                  </label>
                  <input
                    id="tailored-name"
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
                    htmlFor="tailored-phone"
                    className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                  >
                    Phone <span className="text-[#D6AE3C]">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#8F897D]">
                      +91
                    </span>
                    <input
                      id="tailored-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      value={values.phone}
                      onChange={updateValue}
                      placeholder="10 digit number"
                      className={`${inputClass} pl-14`}
                      aria-invalid={Boolean(errors.phone)}
                      required
                    />
                  </div>
                  {errors.phone ? <p className="mt-2 text-sm text-red-400">{errors.phone}</p> : null}
                </div>

                <div>
                  <label
                    htmlFor="tailored-when"
                    className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                  >
                    When?
                  </label>
                  <select
                    id="tailored-when"
                    name="travelDate"
                    value={values.travelDate}
                    onChange={updateValue}
                    className={inputClass}
                  >
                    {WHEN_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tailored-group"
                    className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                  >
                    Group size
                  </label>
                  <select
                    id="tailored-group"
                    name="travelers"
                    value={values.travelers}
                    onChange={updateValue}
                    className={inputClass}
                  >
                    {GROUP_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {errors.form ? (
                <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                  {errors.form}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-[54px] w-full items-center justify-center rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending…" : "Request my itinerary →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
