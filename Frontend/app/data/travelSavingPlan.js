export const travelSavingIntro = {
  title: "Divas Sojourn Travel Saving Plan",
  subtitle: "Save Little, Travel More",
  paragraphs: [
    "The Divas Sojourn Travel Saving Plan is a simple monthly savings scheme designed exclusively for women who love to travel but want to plan their budget in advance. Instead of saving on your own and scrambling to book a trip at the last minute, you commit to a small, fixed monthly amount — and in return, you unlock a travel package worth significantly more than what you put in.",
    "Think of it as a disciplined way to fund your next adventure: you save a little every month, and Divas Sojourn rewards that commitment with bonus travel value, so your money stretches further than it would sitting in a regular savings account.",
    "This plan is open to anyone who dreams of exploring more — solo travellers, friends planning ahead together, or anyone who wants to make travel a regular part of their life rather than an occasional splurge.",
  ],
};

/** Single source of truth for calculator + plan cards. */
export const savingPlanOptions = [
  { id: 1, monthly: 2000, months: 12, package: 28000 },
  { id: 2, monthly: 5000, months: 12, package: 70000 },
  { id: 3, monthly: 2000, months: 6, package: 13500 },
  { id: 4, monthly: 5000, months: 6, package: 34000 },
];

export function derivePlan(plan) {
  const total = plan.monthly * plan.months;
  const bonus = plan.package - total;
  const bonusPercent = total > 0 ? (bonus / total) * 100 : 0;
  return { ...plan, total, bonus, bonusPercent };
}

export const savingPlans = savingPlanOptions.map((plan) => {
  const derived = derivePlan(plan);
  return {
    option: `Option ${plan.id}`,
    monthlyInr: plan.monthly,
    duration: `${plan.months} months`,
    totalPayInr: derived.total,
    packageValueInr: plan.package,
    bonusInr: derived.bonus,
  };
});

export const howItWorksSteps = [
  {
    step: 1,
    title: "Choose a plan",
    description:
      "Pick the monthly contribution and duration that suits your budget (6 months or 12 months).",
  },
  {
    step: 2,
    title: "Save consistently",
    description: "Pay your fixed monthly amount on time, every month, for the chosen duration.",
  },
  {
    step: 3,
    title: "Unlock your package",
    description:
      "Once your savings period is complete, you receive a travel package voucher worth more than your total contribution.",
  },
  {
    step: 4,
    title: "Book your trip",
    description:
      "Use your package value toward any women-only trip on the Divas Sojourn calendar, within the plan's validity window.",
  },
];

export const whyJoinPoints = [
  {
    title: "More travel value",
    description: "Every option gives you a package worth more than what you actually pay in.",
  },
  {
    title: "Built-in discipline",
    description:
      "A fixed monthly commitment makes it easier to save consistently, instead of letting travel funds get spent elsewhere.",
  },
  {
    title: "Flexible across trips",
    description:
      "Your saved value can be applied to any women-only package and split across trips — but not toward fully customised or private itineraries.",
  },
  {
    title: "Two years to use it",
    description:
      "You're not rushed into booking immediately. You have up to two years after completing your plan to redeem it.",
  },
  {
    title: "Designed for women",
    description:
      "Redeemable exclusively against Divas Sojourn's curated women-only trips, from short weekend getaways to longer 10-day international experiences.",
  },
  {
    title: "Top up anytime",
    description:
      "If your saved package value doesn't fully cover the cost of a trip you want, you can pay the difference in cash at the time of booking.",
  },
];

export const termsAndConditions = [
  {
    title: "No stacking discounts",
    description:
      "Package value from this plan cannot be combined with other ongoing discounts or promotional offers.",
  },
  {
    title: "Women-only packages",
    description:
      "Your saved amount can only be redeemed against Divas Sojourn's women-only travel packages; it cannot be used toward fully customised or private itineraries.",
  },
  {
    title: "No cash refunds",
    description: "Under no circumstances will the saved amount or package value be returned as cash.",
  },
  {
    title: "Two-year validity",
    description:
      "Once your saving period is complete, you have two years to redeem your package value against any eligible women-only trip.",
  },
  {
    title: "Splittable across trips",
    description:
      "Your package value can be divided and used toward two or more different trips within the validity period.",
  },
  {
    title: "Top-ups allowed",
    description:
      "If your saved package value doesn't fully cover the cost of a trip you want, you can pay the difference in cash at the time of booking.",
  },
];

export const travelSavingFaqs = [
  {
    id: "missed-payment",
    heading: "Missed Payments",
    question: "What happens if I miss a monthly payment?",
    answer:
      "Please get in touch with our team directly — we'll guide you through how a missed payment affects your plan and package value.",
  },
  {
    id: "switch-options",
    heading: "Switching Plans",
    question: "Can I switch between options after starting?",
    answer: "Contact us before your next payment is due, and we'll help you explore your options.",
  },
  {
    id: "immediate-booking",
    heading: "Booking Timeline",
    question: "Do I need to book a trip immediately after completing the plan?",
    answer:
      "No. You have a full two years from the completion of your plan to use your package value.",
  },
  {
    id: "international",
    heading: "International Trips",
    question: "Can I use my saved value for an international trip?",
    answer: "Yes, as long as it's one of our women-only packages — domestic or international.",
  },
  {
    id: "solo-only",
    heading: "Who Can Join",
    question: "Is this plan only for solo travellers?",
    answer:
      "Not at all. While Divas Sojourn specialises in solo women's travel, anyone looking to save toward a future women-only trip can join the plan.",
  },
];

export const PHONE_DISPLAY = "+91-99900 22835";
export const PHONE_HREF = "tel:+919990022835";
