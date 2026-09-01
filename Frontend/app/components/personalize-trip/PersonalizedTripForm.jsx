"use client";

import { useState } from "react";
import {
  Calendar,
  Compass,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
  Users,
  Wallet,
} from "lucide-react";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  destinationIdea: "",
  travelStyle: "",
  preferredDates: "",
  travelers: "",
  budget: "",
  tripIdea: "",
};

const travelStyles = [
  "Adventure",
  "Relaxation & Wellness",
  "Culture & Heritage",
  "Romance / Honeymoon",
  "Family",
  "Luxury",
  "Mixed / Open to suggestions",
];

export default function PersonalizedTripForm() {
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
    if (values.tripIdea.trim().length < 20) {
      nextErrors.tripIdea = "Please share a bit more about the trip you have in mind.";
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
      submittedAt: new Date().toISOString(),
    };

    const storedEntries = JSON.parse(
      window.localStorage.getItem("divasPersonalizedTripLeads") || "[]",
    );
    window.localStorage.setItem(
      "divasPersonalizedTripLeads",
      JSON.stringify([...storedEntries, formEntry]),
    );

    window.setTimeout(() => {
      setValues(initialValues);
      setIsSubmitting(false);
      setSuccessMessage(
        "Thank you! Our travel specialists will craft ideas around your request and call you soon.",
      );
    }, 600);
  };

  return (
    <section className="bg-[#1A1A1A] px-4 py-16" aria-labelledby="personalized-form-heading">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
            Tell Us Your Vision
          </p>
          <h2 id="personalized-form-heading" className="mt-2 text-3xl font-black text-white md:text-5xl">
            Design Your Personalised Trip
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
            Share your destination ideas, travel style, dates and budget. We will design a
            women-focused itinerary built around how you want to travel.
          </p>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-[2rem] border border-[#D4AF37]/40 bg-[#0F0F0F] p-6 shadow-2xl md:p-10"
          noValidate
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="name"
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
              id="email"
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
              id="phone"
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
            <Field
              id="travelers"
              name="travelers"
              type="number"
              label="Number of Travelers"
              value={values.travelers}
              onChange={updateValue}
              placeholder="How many travelers?"
              icon={Users}
              min="1"
              max="20"
            />
            <Field
              id="destinationIdea"
              name="destinationIdea"
              label="Preferred Destination(s)"
              value={values.destinationIdea}
              onChange={updateValue}
              placeholder="e.g. Bali, Himachal, open to ideas"
              icon={MapPin}
            />
            <div>
              <label htmlFor="travelStyle" className="mb-2 block text-sm font-bold text-white">
                Travel Style
              </label>
              <div className="relative">
                <Compass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#D4AF37]" aria-hidden="true" />
                <select
                  id="travelStyle"
                  name="travelStyle"
                  value={values.travelStyle}
                  onChange={updateValue}
                  className="w-full appearance-none rounded-2xl border border-[#D4AF37]/30 bg-white py-3 pl-12 pr-4 text-[#1A1A1A] outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
                >
                  <option value="">Select a style</option>
                  {travelStyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Field
              id="preferredDates"
              name="preferredDates"
              label="Preferred Dates / Month"
              value={values.preferredDates}
              onChange={updateValue}
              placeholder="e.g. March 2027 or flexible"
              icon={Calendar}
            />
            <Field
              id="budget"
              name="budget"
              label="Approx. Budget (per person)"
              value={values.budget}
              onChange={updateValue}
              placeholder="e.g. ₹60,000 – ₹1,00,000"
              icon={Wallet}
            />
          </div>

          <div className="mt-5">
            <label htmlFor="tripIdea" className="mb-2 block text-sm font-bold text-white">
              Your Trip Idea <span className="text-[#D4AF37]">*</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
              <textarea
                id="tripIdea"
                name="tripIdea"
                value={values.tripIdea}
                onChange={updateValue}
                placeholder="Describe the experience you want — pace, must-sees, comfort level, celebrations, dietary needs, or anything special."
                rows={7}
                className="w-full rounded-2xl border border-[#D4AF37]/30 bg-white py-3 pl-12 pr-4 text-[#1A1A1A] outline-none transition placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
                aria-invalid={Boolean(errors.tripIdea)}
                aria-describedby={errors.tripIdea ? "tripIdea-error" : undefined}
              />
            </div>
            {errors.tripIdea ? (
              <p id="tripIdea-error" className="mt-2 text-sm text-red-400">
                {errors.tripIdea}
              </p>
            ) : null}
          </div>

          {successMessage ? (
            <p className="mt-5 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3 text-sm font-semibold text-[#E8C547]">
              {successMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-12 py-4 font-black uppercase tracking-wide text-[#1A1A1A] transition hover:bg-[#E8C547] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
            {isSubmitting ? "Submitting..." : "Request My Personalised Trip"}
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
