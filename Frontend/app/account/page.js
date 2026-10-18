import { Suspense } from "react";
import AccountClient from "./AccountClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Account",
  description:
    "Sign in with your phone to view trip history, upcoming bookings, pending payments, and edit your details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-[#0B0B0C] text-[#D6AE3C]">
          Loading…
        </div>
      }
    >
      <AccountClient />
    </Suspense>
  );
}
