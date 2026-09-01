"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
// Temporary: profile modal + phone OTP after signup disabled
// import ProfileCompletionGate from "./ProfileCompletionGate";

export default function AppShell({ children, indiaTrips = [], internationalTrips = [] }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar indiaTrips={indiaTrips} internationalTrips={internationalTrips} />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}
