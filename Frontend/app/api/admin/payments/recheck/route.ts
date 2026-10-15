import { NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";
import { getAdminSession } from "@/app/lib/admin/session";
import { prisma } from "@/app/lib/data/prisma";
import { recheckPaymentByTxnid } from "@/app/lib/data/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only: re-check PENDING payments older than 15 minutes via Easebuzz retrieve API.
 * Optional body: { txnid } to recheck a single payment.
 */
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const singleTxnid = String(body.txnid || "").trim();

    if (singleTxnid) {
      const result = await recheckPaymentByTxnid(singleTxnid);
      return NextResponse.json(result, { status: result.ok ? 200 : result.statusCode || 400 });
    }

    const cutoff = new Date(Date.now() - 15 * 60 * 1000);
    const pending = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.PENDING,
        createdAt: { lt: cutoff },
      },
      orderBy: { createdAt: "asc" },
      take: 25,
    });

    const results = [];
    for (const payment of pending) {
      const result = await recheckPaymentByTxnid(payment.txnid);
      results.push({ txnid: payment.txnid, ...result });
    }

    return NextResponse.json({
      checked: results.length,
      results,
    });
  } catch (error) {
    console.error("Admin payment recheck failed", error);
    return NextResponse.json({ error: "Recheck failed" }, { status: 500 });
  }
}
