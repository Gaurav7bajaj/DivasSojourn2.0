import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/app/lib/data/prisma";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ txnid?: string }> };

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { txnid } = await searchParams;
  const id = String(txnid || "").trim();

  const payment = id
    ? await prisma.payment.findUnique({
        where: { txnid: id },
        include: { booking: true },
      })
    : null;

  const isSuccess = payment?.status === "SUCCESS";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#0B0B0C] px-6 py-20">
      <div className="w-full max-w-lg rounded-[24px] border border-white/[0.08] bg-[#141417] p-8 text-center md:p-10">
        <CheckCircle2
          className={`mx-auto h-14 w-14 ${isSuccess ? "text-[#D6AE3C]" : "text-[#8F897D]"}`}
          aria-hidden="true"
        />
        <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-[32px] font-semibold text-[#FBF8F1] md:text-[40px]">
          {isSuccess ? "Payment successful" : "Payment status"}
        </h1>
        <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[15px] leading-relaxed text-[#C9C3B6]">
          {isSuccess
            ? "Thank you. Your booking payment was received successfully."
            : id
              ? "We could not confirm a successful payment for this transaction yet. If you were charged, contact us with your transaction ID."
              : "Missing transaction reference."}
        </p>

        {payment ? (
          <dl className="mt-6 space-y-2 text-left font-[family-name:var(--font-dm-sans)] text-sm text-[#C9C3B6]">
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt>Transaction ID</dt>
              <dd className="font-mono text-[#FBF8F1]">{payment.txnid}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt>Amount</dt>
              <dd className="text-[#FBF8F1]">₹{Number(payment.amount).toFixed(2)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt>Status</dt>
              <dd className="text-[#FBF8F1]">{payment.status}</dd>
            </div>
            {payment.booking?.tripTitle ? (
              <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                <dt>Trip</dt>
                <dd className="text-right text-[#FBF8F1]">{payment.booking.tripTitle}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/upcoming-trips"
            className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#D6AE3C] px-6 font-[family-name:var(--font-dm-sans)] text-sm font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
          >
            Browse trips
          </Link>
          <Link
            href="/payments"
            className="inline-flex h-[52px] items-center justify-center rounded-full border-[1.5px] border-[#D6AE3C] px-6 font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-[#D6AE3C]"
          >
            Payment info
          </Link>
        </div>
      </div>
    </main>
  );
}
