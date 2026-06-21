import {
  longHaulDestinations,
  longHaulPolicy,
  shortHaulDestinations,
  shortHaulPolicy,
} from "../../data/paymentData";
import PaymentTable from "./PaymentTable";

export default function PaymentPolicySection() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-12" aria-labelledby="payment-policy-heading">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#F9F9F9] p-6 text-[#1A1A1A] shadow-lg">
          <span className="inline-flex rounded-full bg-[#1A1A1A] px-4 py-1.5 text-xs font-black uppercase tracking-wide text-white">
            Payment policy
          </span>
          <h2 id="payment-policy-heading" className="mt-5 text-2xl font-black text-[#1A1A1A]">
            Payment Policy
          </h2>
          <p className="mt-4 leading-7 text-[#333333]">
            For short haul destinations refer Short Haul payment and cancellation policy and for long
            haul destinations refer Long Haul payment and cancellation policy.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <DestinationBlock title="Short Haul Destinations" destinations={shortHaulDestinations} />
            <DestinationBlock title="Long Haul Destinations" destinations={longHaulDestinations} />
          </div>
        </div>

        <PaymentTable title="Short Haul Packages" rows={shortHaulPolicy} />
        <PaymentTable title="Long Haul Packages" rows={longHaulPolicy} />
      </div>
    </section>
  );
}

function DestinationBlock({ title, destinations }) {
  return (
    <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
      <h3 className="font-black text-[#1A1A1A]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#333333]">{destinations.join(", ")} and similar.</p>
    </div>
  );
}
