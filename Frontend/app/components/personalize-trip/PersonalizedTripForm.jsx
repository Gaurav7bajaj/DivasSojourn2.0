"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Minus, Plus } from "lucide-react";

const DESTINATION_CHIPS = ["Bali", "Himachal", "Kerala", "Japan", "Open to ideas"];

const STYLE_OPTIONS = [
  { value: "Relaxed & slow", desc: "Beaches, spas, no rush" },
  { value: "Culture & heritage", desc: "Temples, forts, old towns" },
  { value: "Adventure & outdoors", desc: "Treks, safaris, road trips" },
  { value: "Food & markets", desc: "Cooking classes, street food" },
  { value: "Wellness & retreat", desc: "Yoga, Ayurveda, detox" },
  { value: "Celebration", desc: "Birthdays & milestones" },
];

const BUDGET_OPTIONS = [
  "Under ₹50K",
  "₹50K – 1L",
  "₹1L – 2L",
  "₹2L+",
  "Not sure",
];

const OCCASION_OPTIONS = [
  "Girls' trip",
  "Solo",
  "Mother & daughter",
  "Birthday",
  "Milestone",
  "Just because",
];

const STAY_OPTIONS = [
  "Boutique & charming",
  "Comfortable 4★",
  "Luxury 5★",
  "Homestays",
];

const MONTH_OPTIONS = (() => {
  const options = [{ value: "I'm flexible", label: "I'm flexible" }];
  const now = new Date();
  for (let i = 0; i < 12; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    options.push({ value: label, label });
  }
  return options;
})();

const STEPS = [
  { id: 1, label: "Your trip" },
  { id: 2, label: "Who's coming" },
  { id: 3, label: "Your details" },
];

const initialValues = {
  name: "",
  email: "",
  phone: "",
  destinationIdea: "",
  travelStyles: [],
  preferredDates: "I'm flexible",
  travelers: "2",
  budget: "",
  tripIdea: "",
  occasion: "",
  stayPreference: "",
};

const inputClass =
  "h-[52px] w-full rounded-xl border border-white/[0.14] bg-[#0F0F12] px-4 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1] outline-none transition placeholder:text-[#8F897D] focus:border-[#D6AE3C] focus:ring-2 focus:ring-[#D6AE3C]/35";

const chipBase =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold transition";
const chipOn = "bg-[#D6AE3C] text-[#1A1405]";
const chipOff =
  "border border-[rgba(245,241,232,0.22)] text-[#FBF8F1] hover:border-[#D6AE3C]";

export default function PersonalizedTripForm() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const stepHeadingRef = useRef(null);
  const formId = useId();

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [step]);

  const setField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const toggleStyle = (style) => {
    setValues((current) => {
      const has = current.travelStyles.includes(style);
      return {
        ...current,
        travelStyles: has
          ? current.travelStyles.filter((item) => item !== style)
          : [...current.travelStyles, style],
      };
    });
  };

  const appendDestination = (chip) => {
    setValues((current) => {
      const next = current.destinationIdea.trim();
      if (!next) return { ...current, destinationIdea: chip };
      if (next.toLowerCase().includes(chip.toLowerCase())) return current;
      return { ...current, destinationIdea: `${next}, ${chip}` };
    });
  };

  const changeTravelers = (delta) => {
    setValues((current) => {
      const n = Math.min(30, Math.max(1, Number(current.travelers || 1) + delta));
      return { ...current, travelers: String(n) };
    });
  };

  const validateStep = (currentStep) => {
    const nextErrors = {};
    if (currentStep === 1) {
      if (!values.destinationIdea.trim()) {
        nextErrors.destinationIdea = "Please share a destination or choose a suggestion.";
      }
    }
    if (currentStep === 3) {
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
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    const travelStyle = values.travelStyles.join(", ");
    const messageParts = [
      values.tripIdea.trim(),
      values.destinationIdea ? `Destination idea: ${values.destinationIdea}` : "",
      travelStyle ? `Travel style: ${travelStyle}` : "",
      values.budget ? `Budget: ${values.budget}` : "",
      values.occasion ? `Occasion: ${values.occasion}` : "",
      values.stayPreference ? `Stay preference: ${values.stayPreference}` : "",
    ].filter(Boolean);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone.replace(/\D/g, ""),
          message: messageParts.join("\n"),
          page: "Personalised Trip",
          interestedIn: values.destinationIdea || travelStyle || "",
          travelDate: values.preferredDates,
          travelers: values.travelers,
          formType: "contact",
          // Optional extras (folded into message until schema supports them)
          occasion: values.occasion,
          stayPreference: values.stayPreference,
          travelStyle,
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
          ...values,
          travelStyle,
          submittedAt: new Date().toISOString(),
        };
        const storedEntries = JSON.parse(
          window.localStorage.getItem("divasPersonalizedTripLeads") || "[]",
        );
        window.localStorage.setItem(
          "divasPersonalizedTripLeads",
          JSON.stringify([...storedEntries, formEntry]),
        );
      } catch {
        // optional
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

  const resetAll = () => {
    setValues(initialValues);
    setErrors({});
    setStep(1);
    setIsSuccess(false);
  };

  const summary = {
    destination: values.destinationIdea.trim() || "Not chosen yet",
    style: values.travelStyles.length
      ? values.travelStyles.join(", ")
      : "Not chosen yet",
    when: values.preferredDates || "Not chosen yet",
    budget: values.budget || "Not chosen yet",
    group: [
      `${values.travelers || 1} traveller${Number(values.travelers) === 1 ? "" : "s"}`,
      values.occasion,
    ]
      .filter(Boolean)
      .join(" · "),
    stay: values.stayPreference || "Not chosen yet",
  };

  return (
    <section
      id="planner"
      className="scroll-mt-28 bg-[#0B0B0C] px-5 py-16 md:px-12 md:py-16 xl:px-24 xl:pb-24"
      aria-labelledby={`${formId}-section-heading`}
    >
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
          <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
            Tell us your vision
          </p>
        </div>
        <h2
          id={`${formId}-section-heading`}
          className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[48px]"
        >
          Design your{" "}
          <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
            personalised trip
          </em>
        </h2>
      </div>

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Wizard */}
        <div className="rounded-[24px] border border-[rgba(214,174,60,0.22)] bg-[#141417] p-6 md:min-h-[700px] md:p-9 lg:p-10">
          {isSuccess ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center" role="status">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(214,174,60,0.16)] text-[#D6AE3C]">
                <Check className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-[#FBF8F1] md:text-[32px]">
                Your trip is{" "}
                <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                  in the works
                </em>
              </h3>
              <p className="mt-3 max-w-md font-[family-name:var(--font-dm-sans)] text-[15px] leading-7 text-[#C9C3B6]">
                Thank you! One of our travel designers will call you soon to shape your itinerary
                together.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-8 inline-flex h-12 items-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
              >
                Plan another trip
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Progress */}
              <div
                className="grid grid-cols-3 gap-3"
                role="group"
                aria-label={`Step ${step} of 3`}
              >
                {STEPS.map((item) => {
                  const done = item.id < step;
                  const current = item.id === step;
                  return (
                    <div key={item.id}>
                      <div
                        className={`h-1 rounded-full ${
                          done || current ? "bg-[#D6AE3C]" : "bg-white/10"
                        }`}
                        aria-hidden="true"
                      />
                      <p
                        className={`mt-2 font-[family-name:var(--font-dm-sans)] text-[12px] font-bold ${
                          done || current ? "text-[#FBF8F1]" : "text-[#8F897D]"
                        }`}
                        aria-current={current ? "step" : undefined}
                      >
                        {item.id} {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <h3
                ref={stepHeadingRef}
                tabIndex={-1}
                className="mt-8 font-[family-name:var(--font-playfair)] text-[24px] font-semibold text-[#FBF8F1] outline-none"
              >
                {STEPS[step - 1].label}
              </h3>

              <div className="mt-6 space-y-6">
                {step === 1 ? (
                  <>
                    <div>
                      <label
                        htmlFor="destinationIdea"
                        className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                      >
                        Where would you like to go?
                      </label>
                      <input
                        id="destinationIdea"
                        name="destinationIdea"
                        value={values.destinationIdea}
                        onChange={(e) => setField("destinationIdea", e.target.value)}
                        placeholder="e.g. Bali, Himachal, open to ideas…"
                        className={inputClass}
                        aria-invalid={Boolean(errors.destinationIdea)}
                      />
                      {errors.destinationIdea ? (
                        <p className="mt-2 text-sm text-red-400">{errors.destinationIdea}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {DESTINATION_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => appendDestination(chip)}
                            className={`${chipBase} ${chipOff}`}
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]">
                        What&apos;s your travel style? (Pick as many as you like)
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {STYLE_OPTIONS.map((option) => {
                          const selected = values.travelStyles.includes(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => toggleStyle(option.value)}
                              className={`min-h-[76px] rounded-[14px] border p-4 text-left transition ${
                                selected
                                  ? "border-[#D6AE3C] bg-[rgba(214,174,60,0.14)]"
                                  : "border-white/10 hover:border-[#D6AE3C]"
                              }`}
                            >
                              <span
                                className={`block font-[family-name:var(--font-dm-sans)] text-[15px] font-bold ${
                                  selected ? "text-[#ECC95E]" : "text-[#FBF8F1]"
                                }`}
                              >
                                {option.value}
                              </span>
                              <span className="mt-1 block font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
                                {option.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="preferredDates"
                          className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                        >
                          When?
                        </label>
                        <select
                          id="preferredDates"
                          name="preferredDates"
                          value={values.preferredDates}
                          onChange={(e) => setField("preferredDates", e.target.value)}
                          className={inputClass}
                        >
                          {MONTH_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="mb-2 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]">
                          Budget per person
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {BUDGET_OPTIONS.map((option) => {
                            const selected = values.budget === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setField("budget", option)}
                                className={`${chipBase} ${selected ? chipOn : chipOff}`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <div>
                      <p className="mb-3 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]">
                        How many travellers?
                      </p>
                      <div className="inline-flex items-center gap-4 rounded-full border border-white/14 bg-[#0F0F12] px-2 py-2">
                        <button
                          type="button"
                          aria-label="Decrease travellers"
                          onClick={() => changeTravelers(-1)}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <p className="min-w-[7rem] text-center font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#FBF8F1]">
                          {values.travelers} traveller
                          {Number(values.travelers) === 1 ? "" : "s"}
                        </p>
                        <button
                          type="button"
                          aria-label="Increase travellers"
                          onClick={() => changeTravelers(1)}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]">
                        What&apos;s the occasion?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {OCCASION_OPTIONS.map((option) => {
                          const selected = values.occasion === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                setField("occasion", selected ? "" : option)
                              }
                              className={`${chipBase} ${selected ? chipOn : chipOff}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]">
                        Stay preference
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {STAY_OPTIONS.map((option) => {
                          const selected = values.stayPreference === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                setField("stayPreference", selected ? "" : option)
                              }
                              className={`${chipBase} ${selected ? chipOn : chipOff}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                        >
                          Your name <span className="text-[#D6AE3C]">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          value={values.name}
                          onChange={(e) => setField("name", e.target.value)}
                          className={inputClass}
                          aria-invalid={Boolean(errors.name)}
                          required
                        />
                        {errors.name ? (
                          <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                        ) : null}
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                        >
                          Phone <span className="text-[#D6AE3C]">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          value={values.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                          placeholder="10 digit number"
                          className={inputClass}
                          aria-invalid={Boolean(errors.phone)}
                          required
                        />
                        {errors.phone ? (
                          <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                      >
                        Email <span className="text-[#D6AE3C]">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className={inputClass}
                        aria-invalid={Boolean(errors.email)}
                        required
                      />
                      {errors.email ? (
                        <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="tripIdea"
                        className="mb-2 block font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#C9C3B6]"
                      >
                        Your trip idea{" "}
                        <span className="font-medium text-[#8F897D]">(optional)</span>
                      </label>
                      <textarea
                        id="tripIdea"
                        name="tripIdea"
                        value={values.tripIdea}
                        onChange={(e) => setField("tripIdea", e.target.value)}
                        rows={5}
                        placeholder="Pace, must-sees, comfort level, celebrations, dietary needs — anything special."
                        className="w-full rounded-xl border border-white/[0.14] bg-[#0F0F12] px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1] outline-none transition placeholder:text-[#8F897D] focus:border-[#D6AE3C] focus:ring-2 focus:ring-[#D6AE3C]/35"
                      />
                    </div>
                  </>
                ) : null}
              </div>

              {errors.form ? (
                <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                  {errors.form}
                </p>
              ) : null}

              {/* Mobile sticky summary bar */}
              <div className="mt-6 lg:hidden">
                <button
                  type="button"
                  onClick={() => setSummaryOpen((open) => !open)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-[#121215] px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#FBF8F1]"
                  aria-expanded={summaryOpen}
                >
                  Your trip so far
                  <ChevronDown
                    className={`h-4 w-4 text-[#D6AE3C] transition ${summaryOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {summaryOpen ? (
                  <div className="mt-2 rounded-2xl border border-white/8 bg-[#121215] p-4">
                    <SummaryList summary={summary} />
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/8 pt-6">
                {step === 1 ? (
                  <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]">
                    Step 1 of 3
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex h-12 items-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.5)] px-6 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
                  >
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex h-[54px] items-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-[54px] items-center gap-2 rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Request my personalised trip →"
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Desktop summary */}
        <aside className="hidden lg:sticky lg:top-28 lg:block">
          <div className="rounded-[24px] border border-white/8 bg-[#121215] p-7">
            <h3 className="font-[family-name:var(--font-playfair)] text-[24px] font-semibold text-[#FBF8F1]">
              Your trip{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                so far
              </em>
            </h3>
            <div className="mt-6">
              <SummaryList summary={summary} />
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[rgba(214,174,60,0.35)] bg-[rgba(214,174,60,0.1)] p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-snug text-[#D9D3C6]">
                Free, no-obligation consultation — no payment needed to enquire.
              </p>
            </div>
            <a
              href="tel:+919990022835"
              className="mt-5 inline-block font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
            >
              Prefer to talk? Call +91-99900 22835
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

function SummaryList({ summary }) {
  const rows = [
    ["DESTINATION", summary.destination],
    ["TRAVEL STYLE", summary.style],
    ["WHEN", summary.when],
    ["BUDGET", summary.budget],
    ["GROUP", summary.group],
    ["STAY", summary.stay],
  ];

  return (
    <dl className="m-0 space-y-4 p-0">
      {rows.map(([label, value]) => {
        const empty = String(value).startsWith("Not chosen");
        return (
          <div key={label}>
            <dt className="font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F897D]">
              {label}
            </dt>
            <dd
              className={`mt-1 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold ${
                empty ? "text-[#8F897D]" : "text-[#FBF8F1]"
              }`}
            >
              {value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
