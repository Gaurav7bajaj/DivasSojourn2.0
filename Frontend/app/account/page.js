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
  return <AccountClient />;
}
