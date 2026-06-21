import TripSection from "./TripSection";

export const romanceTrips = [
  {
    id: "r1",
    name: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    price: 22500,
    description: "Tropical paradise with beaches and culture.",
    customHref: "/curated-escapes/honeymoon-escape",
  },
  {
    id: "r2",
    name: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
    price: 60599,
    description: "Overwater villas and crystal clear waters.",
    customHref: "/curated-escapes/honeymoon-escape",
  },
  {
    id: "r3",
    name: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
    price: 44999,
    description: "Modern city marvel and futuristic attractions.",
    customHref: "/curated-escapes/honeymoon-escape",
  },
  {
    id: "r4",
    name: "Thailand",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80",
    price: 26499,
    description: "Vibrant street life and sandy beaches.",
    customHref: "/curated-escapes/honeymoon-escape",
  },
  {
    id: "r5",
    name: "Vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
    price: 34999,
    description: "Stunning bays, history, and rich culinary heritage.",
    customHref: "/curated-escapes/honeymoon-escape",
  },
];

export default function RomanceEscapesSection() {
  return (
    <TripSection
      id="romance-escapes"
      title="Romantic Escapes"
      subtitle="Where Forever Begins...Together!"
      description="Specially designed romantic getaways and honeymoon escapes for your perfect together moments."
      ctaHref="/curated-escapes/honeymoon-escape"
      heroVideo="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4"
      trips={romanceTrips}
    />
  );
}
