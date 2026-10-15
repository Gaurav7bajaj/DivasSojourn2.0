import "server-only";

import { PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import {
  fetchTransactionStatus,
  formatAmount,
  verifyResponseHash,
} from "../easebuzz";

export function formDataToRecord(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
  });
  return out;
}

export function mapEasebuzzStatus(status: string): PaymentStatus {
  const s = status.trim().toLowerCase();
  if (s === "success") return PaymentStatus.SUCCESS;
  if (s === "usercancelled" || s === "user_cancelled" || s === "cancelled") {
    return PaymentStatus.USER_CANCELLED;
  }
  if (s === "failure" || s === "failed" || s === "pending") {
    return s === "pending" ? PaymentStatus.PENDING : PaymentStatus.FAILED;
  }
  if (s.includes("cancel")) return PaymentStatus.USER_CANCELLED;
  return PaymentStatus.FAILED;
}

function amountsMatch(dbAmount: Prisma.Decimal | number | string, reported: string): boolean {
  try {
    const left = formatAmount(typeof dbAmount === "object" ? Number(dbAmount) : dbAmount);
    const right = formatAmount(reported);
    return left === right;
  } catch {
    return false;
  }
}

export type ProcessResult =
  | { ok: true; status: PaymentStatus; txnid: string; alreadyProcessed?: boolean }
  | { ok: false; error: string; statusCode?: number };

/**
 * Verify Easebuzz callback/webhook body and apply idempotent Payment + Booking updates.
 */
export async function processEasebuzzNotification(
  body: Record<string, string>,
): Promise<ProcessResult> {
  const txnid = String(body.txnid || "").trim();
  if (!txnid) {
    return { ok: false, error: "Missing txnid", statusCode: 400 };
  }

  if (!verifyResponseHash(body)) {
    return { ok: false, error: "Invalid hash", statusCode: 400 };
  }

  const payment = await prisma.payment.findUnique({
    where: { txnid },
    include: { booking: true },
  });

  if (!payment) {
    return { ok: false, error: "Unknown txnid", statusCode: 404 };
  }

  if (!amountsMatch(payment.amount, String(body.amount || ""))) {
    return { ok: false, error: "Amount mismatch", statusCode: 400 };
  }

  if (payment.status === PaymentStatus.SUCCESS) {
    return { ok: true, status: PaymentStatus.SUCCESS, txnid, alreadyProcessed: true };
  }

  const nextStatus = mapEasebuzzStatus(String(body.status || ""));
  const easepayid = body.easepayid ? String(body.easepayid) : null;
  const mode = body.mode ? String(body.mode) : null;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: nextStatus,
        easepayid,
        mode,
        rawResponse: body as Prisma.InputJsonValue,
      },
    });

    if (nextStatus === PaymentStatus.SUCCESS) {
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { paid: true, paidAt: new Date() },
      });
    }
  });

  return { ok: true, status: nextStatus, txnid };
}

/** Reconcile a PENDING payment via Easebuzz retrieve API. */
export async function recheckPaymentByTxnid(txnid: string): Promise<ProcessResult> {
  const payment = await prisma.payment.findUnique({ where: { txnid } });
  if (!payment) {
    return { ok: false, error: "Unknown txnid", statusCode: 404 };
  }
  if (payment.status === PaymentStatus.SUCCESS) {
    return { ok: true, status: PaymentStatus.SUCCESS, txnid, alreadyProcessed: true };
  }

  const result = await fetchTransactionStatus(txnid);
  if (!result.ok) {
    return { ok: false, error: result.error || "Status API failed", statusCode: 502 };
  }

  const txnStatus = String(result.status || "").toLowerCase();
  if (!txnStatus || txnStatus === "pending") {
    return { ok: true, status: PaymentStatus.PENDING, txnid };
  }

  if (result.amount && !amountsMatch(payment.amount, result.amount)) {
    return { ok: false, error: "Amount mismatch from status API", statusCode: 400 };
  }

  const nextStatus = mapEasebuzzStatus(txnStatus);
  const synthetic: Record<string, string> = {
    status: txnStatus === "success" ? "success" : txnStatus,
    txnid,
    amount: formatAmount(Number(payment.amount)),
    easepayid: result.easepayid || "",
    mode: result.mode || "",
    email: "",
    firstname: "",
    productinfo: "",
    udf1: "",
    udf2: "",
    udf3: "",
    udf4: "",
    udf5: "",
    udf6: "",
    udf7: "",
    udf8: "",
    udf9: "",
    udf10: "",
    key: process.env.EASEBUZZ_KEY?.trim() || "",
    hash: "", // not used — we update directly after API fetch
  };

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: nextStatus,
        easepayid: result.easepayid || payment.easepayid,
        mode: result.mode || payment.mode,
        rawResponse: {
          source: "status_api",
          retrieved: result.raw,
          synthetic,
        } as Prisma.InputJsonValue,
      },
    });
    if (nextStatus === PaymentStatus.SUCCESS) {
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { paid: true, paidAt: new Date() },
      });
    }
  });

  return { ok: true, status: nextStatus, txnid };
}
