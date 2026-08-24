import Link from "next/link";
import { TravelSavingHero } from "../components/travel-saving-plan";
import { formatDualPrice } from "../utils/formatPrice";
import {
  howItWorksSteps,
  savingPlans,
  termsAndConditions,
  travelSavingFaqs,
  travelSavingIntro,
  whyJoinPoints,
} from "../data/travelSavingPlan";

export const metadata = {
  title: "Travel Saving Plan | Divas Sojourn",
  description:
    "Save little, travel more with the Divas Sojourn Travel Saving Plan. Choose a monthly savings option and unlock women-only travel packages worth more than you pay.",
  keywords: [
    "travel saving plan",
    "monthly travel savings",
    "women only travel packages",
    "Divas Sojourn savings",
    "solo women travel India",
  ],
  alternates: {
    canonical: "/travel-saving-plan",
  },
  openGraph: {
    title: "Divas Sojourn Travel Saving Plan",
    description:
      "A simple monthly savings scheme for women who love to travel. Save consistently and unlock bonus travel value.",
    url: "https://divassojourn.com/travel-saving-plan",
    type: "website",
  },
};

export default function TravelSavingPlanPage() {
  return (
    <main className="bg-[#F5F5F5]">
      <TravelSavingHero />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-8 text-sm text-[#555555]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#0F9B9B]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-black text-[#D4AF37]">Travel Saving Plan</li>
            </ol>
          </nav>

          <article className="rounded-3xl border border-[#D4AF37]/25 bg-white p-6 shadow-lg md:p-8">
            <h2 className="text-2xl font-black text-[#1A1A1A] md:text-4xl">{travelSavingIntro.title}</h2>
            <p className="mt-3 text-lg font-bold text-[#0F9B9B]">{travelSavingIntro.subtitle}</p>
            <div className="mt-5 space-y-4">
              {travelSavingIntro.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-[#333333] md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <section className="mt-10">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">How It Works</p>
            <div className="grid gap-4 md:grid-cols-2">
              {howItWorksSteps.map((item) => (
                <article
                  key={item.step}
                  className="rounded-3xl border border-[#D4AF37]/25 bg-white p-5 shadow-lg md:p-6"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0F9B9B] text-sm font-black text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-xl font-black text-[#1A1A1A]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#333333] md:text-base">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">Choose Your Plan</p>
            <div className="overflow-x-auto rounded-3xl border border-[#D4AF37]/25 bg-white shadow-lg">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#1A1A1A] text-white">
                  <tr>
                    <th className="px-4 py-4 font-black">Option</th>
                    <th className="px-4 py-4 font-black">Monthly Contribution</th>
                    <th className="px-4 py-4 font-black">Duration</th>
                    <th className="px-4 py-4 font-black">Total You Pay</th>
                    <th className="px-4 py-4 font-black">Package Value</th>
                    <th className="px-4 py-4 font-black">Bonus Value</th>
                  </tr>
                </thead>
                <tbody>
                  {savingPlans.map((plan) => (
                    <tr key={plan.option} className="border-t border-[#E8E8E8]">
                      <td className="px-4 py-4 font-black text-[#1A1A1A]">{plan.option}</td>
                      <td className="px-4 py-4 font-semibold text-[#333333]">
                        {formatDualPrice(plan.monthlyInr)}/month
                      </td>
                      <td className="px-4 py-4 text-[#333333]">{plan.duration}</td>
                      <td className="px-4 py-4 font-semibold text-[#333333]">
                        {formatDualPrice(plan.totalPayInr)}
                      </td>
                      <td className="px-4 py-4 font-black text-[#0F9B9B]">
                        {formatDualPrice(plan.packageValueInr)}
                      </td>
                      <td className="px-4 py-4 font-black text-[#D4AF37]">
                        +{formatDualPrice(plan.bonusInr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm font-semibold text-[#555555]">
              All amounts are in Indian Rupees (₹). Choose the plan that best matches your savings goal and travel
              timeline.
            </p>
          </section>

          <section className="mt-10">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">
              Why Join the Travel Saving Plan?
            </p>
            <div className="grid gap-4">
              {whyJoinPoints.map((point) => (
                <article
                  key={point.title}
                  className="rounded-3xl border border-[#D4AF37]/25 bg-white p-5 shadow-lg md:p-6"
                >
                  <h3 className="text-lg font-black text-[#1A1A1A]">{point.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#333333] md:text-base">{point.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">Terms & Conditions</p>
            <div className="space-y-3">
              {termsAndConditions.map((term, index) => (
                <article
                  key={term.title}
                  className="rounded-2xl border border-[#D4AF37]/20 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-black text-[#1A1A1A]">
                    {index + 1}. {term.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#333333] md:text-base">{term.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-[#D4AF37]">
              Frequently Asked Questions
            </p>
            <div className="space-y-3">
              {travelSavingFaqs.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#D4AF37]/20 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-black text-[#1A1A1A]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#333333] md:text-base">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-10 rounded-3xl border border-[#0F9B9B]/30 bg-[#0F9B9B]/10 p-6 text-center md:p-8">
            <h2 className="text-2xl font-black text-[#1A1A1A]">Ready to start saving for your next trip?</h2>
            <p className="mt-3 text-sm leading-7 text-[#333333] md:text-base">
              Call us at{" "}
              <Link href="tel:+919990022835" className="font-black text-[#0F9B9B] hover:underline">
                +91-99900 22835
              </Link>{" "}
              to enrol in the Travel Saving Plan.
            </p>
            <Link
              href="/upcoming-trips"
              className="mt-5 inline-flex rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-black text-[#0F0F0F] transition hover:bg-[#E8C547]"
            >
              Browse Upcoming Trips
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
