import PaymentMethods from "./PaymentMethods";
import PaymentNoteBox from "./PaymentNoteBox";

export default function PaymentMethodsSection() {
  return (
    <section className="bg-[#1A1A1A] px-4 pb-12" aria-labelledby="payment-methods-heading">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 id="payment-methods-heading" className="mb-5 text-2xl font-black text-white">
            Payment Methods
          </h2>
          <PaymentMethods />
        </div>
        <PaymentNoteBox />
      </div>
    </section>
  );
}
