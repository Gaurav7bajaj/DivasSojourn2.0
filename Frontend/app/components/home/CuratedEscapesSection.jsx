import { curatedEscapes } from "../../data/mockData";
import TripSection from "./TripSection";

export default function CuratedEscapesSection() {
  return (
    <TripSection
      id="curated-escapes"
      title="Curated Escapes"
      subtitle="Signature experiences made for meaningful travel"
      description="From wellness retreats to cultural trails, each escape is designed to feel personal, polished and easy."
      ctaHref="/curated-escapes"
      heroImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
      heroAlt="Curated luxury escape with calm natural scenery"
      trips={curatedEscapes}
    />
  );
}
