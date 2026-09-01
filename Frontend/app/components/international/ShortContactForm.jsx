"use client";

import { useState } from "react";
import { Mail, MessageSquare, Phone, Send, User } from "lucide-react";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ShortContactForm({
  eyebrow = "Have a Question?",
  title = "Reach Out to Us",
  storageKey = "divasShortLeads",
  pageLabel = "",
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const formEntry = {
      ...values,
      page: pageLabel,
      submittedAt: new Date().toISOString(),
    };

    const storedEntries = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    window.localStorage.setItem(storageKey, JSON.stringify([...storedEntries, formEntry]));

    window.setTimeout(() => {
      setValues(initialValues);
      setIsSubmitting(false);
      setSuccessMessage("Thank you! Our team will get back to you soon.");
    }, 500);
  };

  return (
    <section id="reach-out" className="bg-[#1A1A1A] px-4 py-14" aria-labelledby="reach-out-heading">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#D4AF37]">{eyebrow}</p>
          <h2 id="reach-out-heading" className="mt-2 text-3xl font-black text-white md:text-4xl">
            {title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[1.75rem] border border-[#D4AF37]/35 bg-[#0F0F0F] p-5 shadow-2xl md:p-8"
          noValidate
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              id="short-name"
              name="name"
              label="Your Name"
              value={values.name}
              onChange={updateValue}
              placeholder="Enter your name"
              icon={User}
              error={errors.name}
              required
            />
            <Field
              id="short-phone"
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
            <div className="md:col-span-2">
              <Field
                id="short-email"
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
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="short-message" className="mb-2 block text-sm font-bold text-white">
              Message
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
              <textarea
                id="short-message"
                name="message"
                value={values.message}
                onChange={updateValue}
                placeholder="How can we help?"
                rows={4}
                className="w-full rounded-2xl border border-[#D4AF37]/30 bg-white py-3 pl-12 pr-4 text-[#1A1A1A] outline-none transition placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
              />
            </div>
          </div>

          {successMessage ? (
            <p className="mt-4 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3 text-sm font-semibold text-[#E8C547]">
              {successMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-10 py-3.5 font-black uppercase tracking-wide text-[#1A1A1A] transition hover:bg-[#E8C547] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
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
