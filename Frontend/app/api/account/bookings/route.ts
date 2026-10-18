import { NextResponse } from "next/server";
import { InstallmentStatus } from "@prisma/client";
import { prisma } from "@/app/lib/data/prisma";
import { formatAmount } from "@/app/lib/easebuzz";
import {
  isInstallmentCalendarDue,
  pickNextPayable,
} from "@/app/lib/paymentSchedule";
import { getTravelerSession } from "@/app/lib/travelerSession";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getTravelerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.traveler.findUnique({
    where: { id: session.travelerId },
  });
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Attach older bookings made with this login phone before travelerId existed.
  await prisma.booking.updateMany({
    where: {
      travelerId: null,
      OR: [
        { phone: account.phone },
        ...(account.email ? [{ email: account.email }] : []),
      ],
    },
    data: { travelerId: account.id },
  });

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { travelerId: account.id },
        { phone: account.phone },
        ...(account.email ? [{ email: account.email }] : []),
      ],
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

  // Ensure ownership link for any matched by phone/email.
  const orphans = bookings.filter((b) => b.travelerId !== account.id);
  if (orphans.length) {
    await prisma.booking.updateMany({
      where: { id: { in: orphans.map((b) => b.id) } },
      data: { travelerId: account.id },
    });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayIso = today.toISOString().slice(0, 10);

  const mapped = bookings.map((booking) => {
    const installments = booking.installments.map((row) => {
      let status = row.status;
      if (status !== InstallmentStatus.PAID && status !== InstallmentStatus.WAIVED) {
        status = isInstallmentCalendarDue(row, today)
          ? InstallmentStatus.DUE
          : InstallmentStatus.UPCOMING;
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
      today,
    );

    const remainingBalance = installments
      .filter((row) => row.status !== InstallmentStatus.PAID && row.status !== InstallmentStatus.WAIVED)
      .reduce((acc, row) => acc + Number(row.amountDue), 0);

    const startDate = booking.trip?.startDate || "";
    const isPast = startDate ? startDate < todayIso : false;
    const tripTitle =
      booking.tripTitle ||
      booking.trip?.title ||
      booking.trip?.shortName ||
      booking.tripSlug ||
      "Trip";

    const nextIsEarly =
      next != null &&
      !isInstallmentCalendarDue(
        {
          stage: next.stage,
          dueDate: next.dueDate,
          status: String(next.status),
        },
        today,
      );

    return {
      id: booking.id,
      tripSlug: booking.tripSlug,
      tripTitle,
      tripImage: booking.trip?.image || "",
      destination: booking.trip?.destination || "",
      passengerName: booking.firstname,
      passengerPhone: booking.phone,
      startDate,
      endDate: booking.trip?.endDate || "",
      totalAmount: formatAmount(Number(booking.amount)),
      amountPaid: formatAmount(Number(booking.amountPaid)),
      remainingBalance: formatAmount(remainingBalance),
      fullyPaid: booking.paid || remainingBalance <= 0.001,
      isPast,
      pendingPayment: next
        ? {
            installmentId: next.id,
            label: next.label,
            amount: formatAmount(Number(next.amountDue)),
            dueDate: next.dueDate ? new Date(next.dueDate).toISOString() : null,
            canPayEarly: nextIsEarly,
            isDue: !nextIsEarly,
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
        canPayEarly:
          row.status !== InstallmentStatus.PAID &&
          row.status !== InstallmentStatus.WAIVED &&
          next?.id === row.id &&
          nextIsEarly,
      })),
    };
  });

  const upcoming = mapped.filter((b) => !b.isPast);
  const previous = mapped.filter((b) => b.isPast);
  const pendingPayments = mapped.filter(
    (b) => !b.fullyPaid && Boolean(b.pendingPayment),
  );

  return NextResponse.json({
    bookings: mapped,
    previous,
    upcoming,
    pendingPayments,
  });
}
