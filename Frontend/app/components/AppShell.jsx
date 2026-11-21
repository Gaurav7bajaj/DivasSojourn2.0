"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

export default function AppShell({ children, indiaTrips = [], internationalTrips = [] }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  // Google Ads landing pages use their own minimal chrome (no main nav/footer/WhatsApp bubble).
  const isCampaignLanding =
    pathname === "/women-trips" ||
    pathname?.startsWith("/women-trips/");

  if (isAdminRoute || isCampaignLanding) {
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
