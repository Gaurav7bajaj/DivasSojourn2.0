import type { Metadata } from "next";
import ThankYouClient from "./ThankYouClient";

export const metadata: Metadata = {
  title: "Thank you | Divas Sojourn",
  description: "Your enquiry has been received. Our travel team will contact you on WhatsApp shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WomenTripsThankYouPage() {
  return <ThankYouClient />;
}
