"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

export default function AppShell({ children, indiaTrips = [], internationalTrips = [] }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <Navbar indiaTrips={indiaTrips} internationalTrips={internationalTrips} />
      {children}
      <Footer />
      <WhatsAppButton />
    </AuthProvider>
  );
}
