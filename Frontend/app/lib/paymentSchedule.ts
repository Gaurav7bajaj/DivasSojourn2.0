import "server-only";

import {
  ADVANCE_INDIA_INR,
  ADVANCE_INTERNATIONAL_INR,
} from "@/app/data/paymentData";

export type TripKind = "india" | "international";

export type ScheduleStagePlan = {
  stage: string;
  label: string;
  sortOrder: number;
  /** Days before departure when this stage becomes due (null = at booking). */
  daysBeforeDeparture: number | null;
  /** Fixed INR for advance; otherwise cumulative target fraction of remaining after advance. */
  kind: "advance" | "remaining_pct";
  /** For remaining_pct: cumulative fraction of (total - advance), e.g. 0.25, 0.5, 1 */
  cumulativeOfRemaining?: number;
};

const INDIA_STAGES: ScheduleStagePlan[] = [
  {
    stage: "ADVANCE",
    label: "At booking — advance",
    sortOrder: 1,
    daysBeforeDeparture: null,
    kind: "advance",
  },
  {
    stage: "REMAINING_25",
    label: "45 days before — 25% of remaining",
    sortOrder: 2,
    daysBeforeDeparture: 45,
    kind: "remaining_pct",
    cumulativeOfRemaining: 0.25,
  },
  {
    stage: "REMAINING_50",
    label: "30 days before — 50% of remaining",
    sortOrder: 3,
    daysBeforeDeparture: 30,
    kind: "remaining_pct",
    cumulativeOfRemaining: 0.5,
  },
  {
    stage: "REMAINING_100",
    label: "15 days before — balance",
    sortOrder: 4,
    daysBeforeDeparture: 15,
    kind: "remaining_pct",
    cumulativeOfRemaining: 1,
  },
];

const INTERNATIONAL_STAGES: ScheduleStagePlan[] = [
  {
    stage: "ADVANCE",
    label: "At booking — advance",
    sortOrder: 1,
    daysBeforeDeparture: null,
    kind: "advance",
  },
  {
    stage: "REMAINING_50",
    label: "45 days before — 50% of remaining",
    sortOrder: 2,
    daysBeforeDeparture: 45,
    kind: "remaining_pct",
    cumulativeOfRemaining: 0.5,
  },
  {
    stage: "REMAINING_100",
    label: "30 days before — balance",
    sortOrder: 3,
    daysBeforeDeparture: 30,
    kind: "remaining_pct",
    cumulativeOfRemaining: 1,
  },
];

export function resolveTripKind(destination: string): TripKind {
  return String(destination || "").toLowerCase() === "india" ? "india" : "international";
}

export function advanceForKind(kind: TripKind): number {
  return kind === "india" ? ADVANCE_INDIA_INR : ADVANCE_INTERNATIONAL_INR;
}

export function stagesForKind(kind: TripKind): ScheduleStagePlan[] {
  return kind === "india" ? INDIA_STAGES : INTERNATIONAL_STAGES;
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addDaysUtc(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export type BuiltInstallment = {
  stage: string;
  label: string;
  sortOrder: number;
  dueDate: Date | null;
  amountDue: number;
  /** True if this stage should be payable now (due date reached or advance). */
  dueNow: boolean;
};

/**
 * Build fixed installment rows for a booking.
 * Percentage stages use cumulative targets of (total - advance); each row's
 * amountDue is the delta from the previous cumulative target.
 */
export function buildInstallmentPlan(input: {
  destination: string;
  totalAmount: number;
  startDateIso: string;
  now?: Date;
}): BuiltInstallment[] {
  const kind = resolveTripKind(input.destination);
  const total = roundMoney(input.totalAmount);
  if (!Number.isFinite(total) || total <= 0) {
    throw new Error("Invalid trip amount");
  }

  const advanceRaw = advanceForKind(kind);
  const advance = roundMoney(Math.min(advanceRaw, total));
  const remaining = roundMoney(Math.max(0, total - advance));
  const start = parseIsoDate(input.startDateIso);
  const today = input.now
    ? parseIsoDate(input.now.toISOString().slice(0, 10))
    : parseIsoDate(new Date().toISOString().slice(0, 10));

  const stages = stagesForKind(kind);
  const rows: BuiltInstallment[] = [];
  let prevCumulative = 0;

  for (const stage of stages) {
    let amountDue = 0;
    let dueDate: Date | null = null;

    if (stage.kind === "advance") {
      amountDue = advance;
      dueDate = null;
    } else {
      const target = roundMoney(remaining * (stage.cumulativeOfRemaining ?? 0));
      amountDue = roundMoney(Math.max(0, target - prevCumulative));
      prevCumulative = target;
      if (stage.daysBeforeDeparture != null) {
        dueDate = addDaysUtc(start, -stage.daysBeforeDeparture);
      }
    }

    if (amountDue <= 0 && stage.kind !== "advance") {
      continue;
    }

    const dueNow =
      stage.kind === "advance" ||
      (dueDate != null && dueDate.getTime() <= today.getTime());

    rows.push({
      stage: stage.stage,
      label: stage.label,
      sortOrder: stage.sortOrder,
      dueDate,
      amountDue,
      dueNow,
    });
  }

  const sum = roundMoney(rows.reduce((acc, row) => acc + row.amountDue, 0));
  const drift = roundMoney(total - sum);
  if (drift !== 0 && rows.length) {
    rows[rows.length - 1].amountDue = roundMoney(rows[rows.length - 1].amountDue + drift);
  }

  return rows;
}

export type PayableInstallment = {
  id: string;
  stage: string;
  label: string;
  status: string;
  amountDue: number | string;
  dueDate: Date | null;
  sortOrder: number;
};

/** Refresh DUE vs UPCOMING from calendar, then return the next payable installment. */
export function pickNextPayable(
  installments: PayableInstallment[],
  now = new Date(),
): PayableInstallment | null {
  const today = parseIsoDate(now.toISOString().slice(0, 10));
  const unpaid = installments
    .filter((row) => row.status !== "PAID" && row.status !== "WAIVED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  for (const row of unpaid) {
    const isAdvance = row.stage === "ADVANCE";
    const dateDue =
      !row.dueDate || row.dueDate.getTime() <= today.getTime() || row.status === "DUE";
    if (isAdvance || dateDue) {
      return row;
    }
  }
  return null;
}
