import Link from "next/link";
import { XCircle } from "lucide-react";
import { prisma } from "@/app/lib/data/prisma";
import PayNowButton from "@/app/components/payments/PayNowButton";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ txnid?: string }> };

export default async function PaymentFailedPage({ searchParams }: Props) {
  const { txnid } = await searchParams;
  const id = String(txnid || "").trim();

  const payment = id
    ? await prisma.payment.findUnique({
        where: { txnid: id },
        include: { booking: true },
      })
    : null;

  const canRetry =
    payment &&
    payment.booking &&
    !payment.booking.paid &&
    payment.status !== "SUCCESS";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#0B0B0C] px-6 py-20">
      <div className="w-full max-w-lg rounded-[24px] border border-white/[0.08] bg-[#141417] p-8 text-center md:p-10">
        <XCircle className="mx-auto h-14 w-14 text-red-400" aria-hidden="true" />
        <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-[32px] font-semibold text-[#FBF8F1] md:text-[40px]">
          Payment not completed
        </h1>
        <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[15px] leading-relaxed text-[#C9C3B6]">
          {payment
            ? "Your payment was cancelled or failed. You can retry below, or use UPI / bank transfer from the payments page."
            : "We could not find this transaction. Please try again from the payments page."}
        </p>

        {payment ? (
          <dl className="mt-6 space-y-2 text-left font-[family-name:var(--font-dm-sans)] text-sm text-[#C9C3B6]">
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt>Transaction ID</dt>
              <dd className="font-mono text-[#FBF8F1]">{payment.txnid}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt>Status</dt>
              <dd className="text-[#FBF8F1]">{payment.status}</dd>
            </div>
          </dl>
        ) : null}

        <div className="mt-8 space-y-3">
          {canRetry ? (
            <PayNowButton bookingId={payment.bookingId} label="Retry payment" />
          ) : null}
          <Link
            href="/payments#pay-online"
            className="inline-flex h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[#D6AE3C] px-6 font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-[#D6AE3C]"
          >
            Back to payments
          </Link>
        </div>
      </div>
    </main>
  );
}
