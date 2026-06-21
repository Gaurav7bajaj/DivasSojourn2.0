import Link from "next/link";
import { BlogsSection, ContactForm, TravelerReviews } from "../components/international";
import { IndiaHeroSection, IndiaTripsGrid } from "../components/india";
import WhyDivasSection from "../components/home/WhyDivasSection";
import { indiaBlogs, indiaReviews, indiaTripsData } from "../data/indiaTrips";

const pageUrl = "https://divassojourn.com/india-trips";
const heroImage =
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80";

export const metadata = {
  title: "India Trip Packages for Solo Female Travelers",
  description:
    "Explore the best India tour packages for women travelers. Safe, curated trips across Tawang, Jyotirlingas, Coorg, South India, Northeast, and more. Book your dream Indian adventure with Divas Sojourn.",
  keywords: [
    "India trips for women",
    "solo female travel packages",
    "women only tours India",
    "Tawang Dirang",
    "Jyotirlingas",
    "Coorg Mysore",
    "South India tours",
    "Northeast trips",
    "Indian destinations",
    "women travel groups",
  ],
  alternates: {
    canonical: "/india-trips",
  },
  openGraph: {
    title: "India Trip Packages for Solo Female Travelers | Divas Sojourn",
    description:
      "Discover incredible destinations across India designed for female travelers. Safe, inclusive, and unforgettable experiences. Book your trip today.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: heroImage,
        width: 1200,
        height: 630,
        alt: "India trip packages for female travelers with Divas Sojourn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "India Trip Packages for Solo Female Travelers | Divas Sojourn",
    description:
      "Safe, curated women-only India trips across mountains, temples, backwaters and cultural routes.",
    images: [heroImage],
  },
};

export default function IndiaTripsPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://divassojourn.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "India Trips",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "India Trips for Female Travelers",
      itemListElement: indiaTripsData.map((trip, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TouristAttraction",
          name: `${trip.shortName} India Trip`,
          description: trip.description,
          url: `${pageUrl}/${trip.slug}`,
          image: trip.image,
        },
      })),
    },
    ...indiaBlogs.map((blog) => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      image: blog.image,
      datePublished: blog.datePublished,
      author: {
        "@type": "Organization",
        name: blog.author,
      },
      description: blog.excerpt,
      url: `https://divassojourn.com/blogs/${blog.slug}`,
    })),
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <IndiaHeroSection />
      <nav className="bg-[#1A1A1A] px-4 py-4 text-sm text-white" aria-label="Breadcrumb">
        <ol className="mx-auto flex max-w-7xl items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-[#D4AF37]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[#D4AF37]">India Trips</li>
        </ol>
      </nav>
      <IndiaTripsGrid />
      {indiaReviews.length > 0 ? <TravelerReviews reviews={indiaReviews} /> : null}
      {indiaBlogs.length > 0 ? (
        <BlogsSection
          posts={indiaBlogs}
          title="Latest India Travel Stories"
          subtitle="Tips, Stories & Inspiration From India Trips"
        />
      ) : null}
      <WhyDivasSection />
      <ContactForm destinationOptions={indiaTripsData} storageKey="divasIndiaLeads" />
    </main>
  );
}
