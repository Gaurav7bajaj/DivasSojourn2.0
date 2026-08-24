"use client";

import { useState } from "react";
import { Calendar, Mail, MessageSquare, Phone, Send, User, Users } from "lucide-react";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  interestedIn: "",
  travelDate: "",
  travelers: "",
};

export default function ContactForm({
  eyebrow = "Not Sure What To Do? We Will Give You A Call Back!",
  title = "Contact Form",
  destinationOptions = [],
  storageKey = "divasInternationalLeads",
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
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
      submittedAt: new Date().toISOString(),
    };

    const storedEntries = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    window.localStorage.setItem(storageKey, JSON.stringify([...storedEntries, formEntry]));

    window.setTimeout(() => {
      setValues(initialValues);
      setIsSubmitting(false);
      setSuccessMessage("Thank you! Our team will call you back soon.");
    }, 600);
  };

  return (
    <section id="contact-form" className="bg-[#1A1A1A] px-4 py-16" aria-labelledby="contact-form-heading">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-lg font-bold text-white">{eyebrow}</p>
          <h2 id="contact-form-heading" className="mt-2 text-3xl font-black text-white md:text-5xl">
            {title}
          </h2>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-[2rem] border border-[#D4AF37]/40 bg-[#1A1A1A] p-6 shadow-2xl md:p-10"
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
              label="Email Id"
              value={values.email}
              onChange={updateValue}
              placeholder="Enter your Email Id"
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
              placeholder="Enter your 10 digit number"
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
              max="10"
            />
            <SelectField
              id="interestedIn"
              name="interestedIn"
              label="Interested In"
              value={values.interestedIn}
              onChange={updateValue}
              options={destinationOptions}
            />
            <Field
              id="travelDate"
              name="travelDate"
              type="date"
              label="Travel Date"
              value={values.travelDate}
              onChange={updateValue}
              icon={Calendar}
            />
          </div>

          <div className="mt-5">
            <label htmlFor="message" className="mb-2 block text-sm font-bold text-white">
              Message
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
              <textarea
                id="message"
                name="message"
                value={values.message}
                onChange={updateValue}
                placeholder="Write your message"
                rows={7}
                className="w-full rounded-2xl border border-[#D4AF37]/30 bg-white py-3 pl-12 pr-4 text-[#1A1A1A] outline-none transition placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
              />
            </div>
          </div>

          {successMessage && (
            <p className="mt-5 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3 text-sm font-semibold text-[#E8C547]">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-12 py-4 font-black uppercase tracking-wide text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
            {isSubmitting ? "Submitting..." : "Get Free Consultation"}
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
        {label} {required && <span className="text-[#D4AF37]">*</span>}
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
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({ id, label, options, ...selectProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-white">
        {label}
      </label>
      <select
        id={id}
        className="w-full rounded-2xl border border-[#D4AF37]/30 bg-white px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15"
        {...selectProps}
      >
        <option value="">Select a destination</option>
        {options.map((destination) => {
          const labelText = destination.name || destination.shortName || destination.title;

          return (
            <option key={destination.slug || labelText} value={labelText}>
              {labelText}
            </option>
          );
        })}
      </select>
    </div>
  );
}
