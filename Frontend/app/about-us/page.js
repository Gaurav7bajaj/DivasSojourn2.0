import {
  AboutHero,
  OurStory,
  StatsSection,
  FounderSection,
  MissionVision,
  ValuesSection,
  PhotoGallery,
  AboutCTA,
} from "../components/about";
import ShortContactForm from "../components/international/ShortContactForm";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Divas Sojourn — the global women's travel community founded by Pooja Malhotra in 2015. Discover our story, mission, values and the team behind 14,000+ happy travelers.",
  openGraph: {
    title: "About Us | Divas Sojourn",
    description:
      "From a solo dream to a global movement — discover how Divas Sojourn became the most trusted women-only travel community in India.",
  },
};

export default function AboutUsPage() {
  return (
    <main>
      <AboutHero />
      <OurStory />
      <StatsSection />
      <FounderSection />
      <MissionVision />
      <ValuesSection />
      <PhotoGallery />
      <AboutCTA />
      <ShortContactForm pageLabel="About Us" storageKey="divasAboutLeads" />
    </main>
  );
}
