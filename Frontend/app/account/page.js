import { Suspense } from "react";
import { getAccountBookingsForTraveler } from "../lib/accountBookings";
import { prisma } from "../lib/data/prisma";
import { getTravelerSession } from "../lib/travelerSession";
import AccountClient from "./AccountClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "My Account",
  description:
    "Sign in with your phone to view trip history, upcoming bookings, pending payments, and edit your details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  let initialTraveler = null;
  let initialBookings = {
    bookings: [],
    previous: [],
    upcoming: [],
    pendingPayments: [],
  };

  try {
    const session = await getTravelerSession();
    if (session) {
      const account = await prisma.traveler.findUnique({
        where: { id: session.travelerId },
      });
      if (account) {
        initialTraveler = {
          id: account.id,
          fullName: account.fullName,
          phone: account.phone,
          email: account.email,
        };
        initialBookings = await getAccountBookingsForTraveler(account);
      }
    }
  } catch (error) {
    console.error("Account page load failed", error);
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-[#0B0B0C] text-[#D6AE3C]">
          Loading…
        </div>
      }
    >
      <AccountClient
        initialTraveler={initialTraveler}
        initialBookings={initialBookings}
      />
    </Suspense>
  );
}
