"use client";

import { useEffect, useId, useState } from "react";
import { Mail, MessageSquare, Phone, Send, User, X } from "lucide-react";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function DestinationEnquiryModal({ destination, onClose }) {
  const titleId = useId();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
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

  if (!destination) {
    return null;
  }

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const formEntry = {
      destination: destination.name,
      destinationSlug: destination.slug,
      ...values,
      submittedAt: new Date().toISOString(),
    };

    const storedEntries = JSON.parse(window.localStorage.getItem("divasTailoredTripLeads") || "[]");
    window.localStorage.setItem(
      "divasTailoredTripLeads",
      JSON.stringify([...storedEntries, formEntry]),
    );

    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg translate-y-0 scale-100 rounded-[1.75rem] border border-[#D4AF37]/40 bg-[#0F0F0F] p-5 text-white shadow-2xl transition duration-300 sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/15 p-2 text-white/80 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          aria-label="Close enquiry form"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">Thank You</p>
            <h2 id={titleId} className="mt-3 text-2xl font-black text-white md:text-3xl">
              We&apos;ve received your request
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/75 md:text-base">
              We will contact you as soon as possible to help you make your perfect trip.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex rounded-full bg-[#D4AF37] px-7 py-3 text-sm font-black uppercase tracking-wide text-[#1A1A1A] transition hover:bg-[#E8C547]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">Enquire Now</p>
            <h2 id={titleId} className="mt-2 pr-10 text-2xl font-black text-white md:text-3xl">
              Plan {destination.name}
            </h2>
            <p className="mt-2 text-sm text-white/65">
              Share a few details and we&apos;ll help tailor this destination for you.
            </p>

            <div className="mt-4 inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-sm font-bold text-[#E8C547]">
              Destination: {destination.name}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <Field
                id="tailored-name"
                name="name"
                label="Your Name"
                value={values.name}
                onChange={updateValue}
                placeholder="e.g. Jennifer Aniston"
                icon={User}
                error={errors.name}
                required
              />
              <Field
                id="tailored-email"
                name="email"
                type="email"
                label="Email"
                value={values.email}
                onChange={updateValue}
                placeholder="Enter your email"
                icon={Mail}
                error={errors.email}
                required
              />
              <Field
                id="tailored-phone"
                name="phone"
                type="tel"
                label="Phone"
                value={values.phone}
                onChange={updateValue}
                placeholder="10 digit number"
                icon={Phone}
                error={errors.phone}
                required
              />

              <div>
                <label htmlFor="tailored-message" className="mb-2 block text-sm font-bold text-white">
                  Message <span className="font-medium text-white/50">(optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare
                    className="absolute left-4 top-4 h-5 w-5 text-[#D4AF37]"
                    aria-hidden="true"
                  />
                  <textarea
                    id="tailored-message"
                    name="message"
                    value={values.message}
                    onChange={updateValue}
                    placeholder="Travel month, group size, or anything we should know"
                    rows={3}
                    className="w-full rounded-2xl border border-[#D4AF37]/30 bg-white py-3 pl-12 pr-4 text-[#1A1A1A] outline-none transition placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-8 py-3.5 font-black uppercase tracking-wide text-[#1A1A1A] transition hover:bg-[#E8C547] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send className="h-5 w-5" aria-hidden="true" />
                {isSubmitting ? "Sending..." : "Submit Enquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, icon: Icon, error, required = false, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-white">
        {label} {required ? <span className="text-[#D4AF37]">*</span> : null}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#D4AF37]" aria-hidden="true" />
        <input
          id={id}
          required={required}
          className="w-full rounded-2xl border border-[#D4AF37]/30 bg-white py-3 pl-12 pr-4 text-[#1A1A1A] outline-none transition placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
