import "server-only";

import { InstallmentStatus } from "@prisma/client";
import { prisma } from "@/app/lib/data/prisma";
import { formatAmount } from "@/app/lib/easebuzz";
import {
  isInstallmentCalendarDue,
  pickNextPayable,
} from "@/app/lib/paymentSchedule";

export type AccountBookingDto = {
  id: string;
  tripSlug: string;
  tripTitle: string;
  tripImage: string;
  destination: string;
  passengerName: string;
  passengerPhone: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  amountPaid: string;
  remainingBalance: string;
  fullyPaid: boolean;
  isPast: boolean;
  pendingPayment: {
    installmentId: string;
    label: string;
    amount: string;
    dueDate: string | null;
    canPayEarly: boolean;
    isDue: boolean;
  } | null;
  installments: {
    id: string;
    stage: string;
    label: string;
    amountDue: string;
    dueDate: string | null;
    status: string;
    paidAt: string | null;
    canPayEarly: boolean;
  }[];
};

export type AccountBookingsPayload = {
  bookings: AccountBookingDto[];
  previous: AccountBookingDto[];
  upcoming: AccountBookingDto[];
  pendingPayments: AccountBookingDto[];
};

export async function getAccountBookingsForTraveler(account: {
  id: string;
  phone: string;
  email: string;
}): Promise<AccountBookingsPayload> {
  // Attach older bookings made with this login phone / email.
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
    },
    orderBy: { createdAt: "desc" },
  });

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

  const mapped: AccountBookingDto[] = bookings.map((booking) => {
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
      .filter(
        (row) =>
          row.status !== InstallmentStatus.PAID &&
          row.status !== InstallmentStatus.WAIVED,
      )
      .reduce((acc, row) => acc + Number(row.amountDue), 0);

    // Prefer trip dates; fall back so we never hide a paid booking.
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

  return {
    bookings: mapped,
    previous: mapped.filter((b) => b.isPast),
    upcoming: mapped.filter((b) => !b.isPast),
    pendingPayments: mapped.filter(
      (b) => !b.fullyPaid && Boolean(b.pendingPayment),
    ),
  };
}
