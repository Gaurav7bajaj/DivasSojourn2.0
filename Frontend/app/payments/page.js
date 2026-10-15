import PaymentsHeader from "../components/payments/PaymentsHeader";
import PaymentMethodsSection from "../components/payments/PaymentMethodsSection";
import PaymentScheduleSection from "../components/payments/PaymentScheduleSection";
import PaymentNotesSection from "../components/payments/PaymentNotesSection";
import PaymentsHelpStrip from "../components/payments/PaymentsHelpStrip";
import PaymentsPageClient from "./PaymentsPageClient";
import { prisma } from "../lib/data/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Methods & Policy | Divas Sojourn",
  description:
    "Divas Sojourn payment methods including bank transfer, UPI, Easebuzz checkout, and Razorpay. Learn our payment policy for short haul and long haul packages.",
  keywords: [
    "payment methods",
    "bank transfer",
    "UPI payment",
    "Easebuzz",
    "Razorpay",
    "payment policy",
    "tour packages payment",
    "Divas Sojourn payments",
  ],
  alternates: {
    canonical: "/payments",
  },
  openGraph: {
    title: "Payment Methods & Policy",
    description: "Safe and secure payment options for your travel packages.",
    url: "https://divassojourn.com/payments",
    siteName: "Divas Sojourn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment Methods & Policy | Divas Sojourn",
    description: "Safe and secure payment options for your travel packages.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What payment methods does Divas Sojourn accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Divas Sojourn accepts bank transfer, UPI payments, Easebuzz online checkout, and payment through the official Razorpay link.",
      },
    },
    {
      "@type": "Question",
      name: "Is there any payment gateway charge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A payment gateway charge of 3% will be levied when using the Razorpay payment link. Easebuzz hosted checkout follows your package terms.",
      },
    },
    {
      "@type": "Question",
      name: "Who should I contact for payment questions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For payment questions, contact Divas Sojourn at 99900 22835.",
      },
    },
  ],
};

export default async function PaymentsPage() {
  let trips = [];
  try {
    const rows = await prisma.trip.findMany({
      where: { published: true, soldOut: false },
      orderBy: { startDate: "asc" },
      select: {
        slug: true,
        title: true,
        shortName: true,
        price: true,
        earlyBirdPrice: true,
      },
    });
    trips = rows.filter((t) => (t.earlyBirdPrice ?? t.price) > 0);
  } catch (error) {
    console.error("Payments page trip load failed", error);
  }

  return (
    <main className="bg-[#0B0B0C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PaymentsHeader />
      <PaymentsPageClient trips={trips} />
      <PaymentMethodsSection />
      <PaymentScheduleSection />
      <PaymentNotesSection />
      <PaymentsHelpStrip />
    </main>
  );
}
