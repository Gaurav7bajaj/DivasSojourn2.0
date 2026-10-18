import { NextResponse } from "next/server";
import { InstallmentStatus } from "@prisma/client";
import { prisma } from "@/app/lib/data/prisma";
import { formatAmount } from "@/app/lib/easebuzz";
import { pickNextPayable } from "@/app/lib/paymentSchedule";
import { getTravelerSession } from "@/app/lib/travelerSession";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getTravelerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [{ travelerId: session.travelerId }, { phone: session.phone }],
    },
    include: {
      trip: {
        select: {
          slug: true,
          title: true,
          shortName: true,
          destination: true,
          startDate: true,
          endDate: true,
          image: true,
        },
      },
      installments: { orderBy: { sortOrder: "asc" } },
      payments: {
        where: { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const mapped = bookings.map((booking) => {
    // Soft-refresh due flags in memory for response (durable update on pay initiate).
    const installments = booking.installments.map((row) => {
      let status = row.status;
      if (status !== InstallmentStatus.PAID && status !== InstallmentStatus.WAIVED) {
        const due =
          row.stage === "ADVANCE" ||
          !row.dueDate ||
          row.dueDate.getTime() <= today.getTime();
        status = due ? InstallmentStatus.DUE : InstallmentStatus.UPCOMING;
      }
      return { ...row, status };
    });

    const next = pickNextPayable(
      installments.map((row) => ({
        id: row.id,
        stage: row.stage,
        label: row.label,
        status: row.status,
        amountDue: Number(row.amountDue),
        dueDate: row.dueDate,
        sortOrder: row.sortOrder,
      })),
    );

    const startDate = booking.trip?.startDate || "";
    const isPast = startDate ? startDate < today.toISOString().slice(0, 10) : false;

    return {
      id: booking.id,
      tripSlug: booking.tripSlug,
      tripTitle: booking.tripTitle,
      tripImage: booking.trip?.image || "",
      destination: booking.trip?.destination || "",
      startDate,
      endDate: booking.trip?.endDate || "",
      totalAmount: formatAmount(Number(booking.amount)),
      amountPaid: formatAmount(Number(booking.amountPaid)),
      fullyPaid: booking.paid,
      isPast,
      category: isPast ? "previous" : booking.paid ? "upcoming" : "upcoming",
      pendingPayment: next
        ? {
            installmentId: next.id,
            label: next.label,
            amount: formatAmount(Number(next.amountDue)),
          }
        : null,
      installments: installments.map((row) => ({
        id: row.id,
        stage: row.stage,
        label: row.label,
        amountDue: formatAmount(Number(row.amountDue)),
        dueDate: row.dueDate?.toISOString() ?? null,
        status: row.status,
        paidAt: row.paidAt?.toISOString() ?? null,
      })),
    };
  });

  return NextResponse.json({
    bookings: mapped,
    previous: mapped.filter((b) => b.isPast),
    upcoming: mapped.filter((b) => !b.isPast),
    pendingPayments: mapped.filter((b) => Boolean(b.pendingPayment)),
  });
}
