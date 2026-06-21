import { paymentNotes } from "../../data/paymentData";

export default function PaymentNoteBox() {
  return (
    <aside className="rounded-2xl border border-red-200 bg-[#FFF3F3] p-6 text-[#1A1A1A] shadow-lg">
      <h2 className="text-xl font-black text-red-800">Note:</h2>
      <ul className="mt-4 space-y-4 text-sm leading-7 text-[#333333]">
        {paymentNotes.map((note) => (
          <li key={note} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
      <a
        href="tel:+919990022835"
        className="mt-5 inline-flex font-black text-red-800 underline-offset-4 hover:underline"
      >
        Call 99900 22835
      </a>
    </aside>
  );
}
