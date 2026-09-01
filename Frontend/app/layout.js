import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AppShell from "./components/AppShell";
import { getTripNavItems } from "./lib/data/trips";

export const dynamic = "force-dynamic";

export const metadata = {
  metadataBase: new URL("https://divassojourn.com"),
  title: {
    default: "Divas Sojourn | Women-Only Group Trips in India & Abroad",
    template: "%s | Divas Sojourn",
  },
  description:
    "Join Divas Sojourn, a global women's community of travelers offering curated women-only group trips across India and international destinations.",
  keywords: [
    "Divas Sojourn",
    "women only trips",
    "women travel community",
    "India group trips",
    "international group trips",
    "curated escapes",
    "luxury women travel",
  ],
  authors: [{ name: "Divas Sojourn" }],
  creator: "Divas Sojourn",
  publisher: "Divas Sojourn",
  openGraph: {
    title: "Divas Sojourn | Global Women's Community of Travelers",
    description:
      "Curated women-only travel experiences across India and the world with trusted in-house operations.",
    url: "https://divassojourn.com",
    siteName: "Divas Sojourn",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Women travelers exploring a beach destination",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Divas Sojourn | Women-Only Group Trips",
    description:
      "Explore secure, curated and community-led women-only trips across India and abroad.",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }) {
  const [indiaTrips, internationalTrips] = await Promise.all([
    getTripNavItems("India"),
    getTripNavItems("International"),
  ]);

  return (
    <html lang="en-IN" data-scroll-behavior="smooth">
      <body>
        <ClerkProvider>
          <AppShell indiaTrips={indiaTrips} internationalTrips={internationalTrips}>
            {children}
          </AppShell>
        </ClerkProvider>
      </body>
    </html>
  );
}
