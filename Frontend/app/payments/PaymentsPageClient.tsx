"use client";

import { Suspense } from "react";
import EasebuzzCheckoutForm from "../components/payments/EasebuzzCheckoutForm";

type TripOption = {
  slug: string;
  title: string;
  shortName?: string;
  price: number;
  earlyBirdPrice?: number | null;
};

export default function PaymentsPageClient({ trips }: { trips: TripOption[] }) {
  return (
    <Suspense
      fallback={
        <div className="bg-[#0B0B0C] px-6 py-16 text-[#C9C3B6] md:px-12">
          Loading checkout…
        </div>
      }
    >
      <EasebuzzCheckoutForm trips={trips} />
    </Suspense>
  );
}
