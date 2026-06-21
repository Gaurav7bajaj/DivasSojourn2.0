import { policyNotes } from "../../data/paymentData";

export default function PaymentTable({ title, rows }) {
  return (
    <article className="mt-8 overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#F9F9F9] text-[#1A1A1A] shadow-lg">
      <div className="border-b border-[#D4AF37]/20 p-5">
        <span className="inline-flex rounded-full bg-[#1A1A1A] px-4 py-1.5 text-xs font-black uppercase tracking-wide text-white">
          {title}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#F5F5F5]">
              <th scope="col" className="w-[40%] px-5 py-4 font-black text-[#1A1A1A]">
                Number Of Days Prior To Tour Date
              </th>
              <th scope="col" className="w-[60%] px-5 py-4 font-black text-[#1A1A1A]">
                Amount need to be paid
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.timing} className="border-t border-[#E0E0E0] odd:bg-white even:bg-[#FAFAFA]">
                <th scope="row" className="px-5 py-4 align-top font-black text-[#1A1A1A]">
                  {row.timing}
                </th>
                <td className="px-5 py-4 leading-7 text-[#333333]">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#E0E0E0] p-5">
        <h3 className="font-black text-[#1A1A1A]">Please Note:</h3>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-[#333333]">
          {policyNotes.map((note) => (
            <li key={note} className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#D4AF37]" aria-hidden="true" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
