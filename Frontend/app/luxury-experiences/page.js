import { LuxuryHero, CategoryNav, LuxuryCategory, ConciergeForm } from "../components/luxury";
import { luxuryCategories } from "../data/luxuryExperiencesData";

export const metadata = {
  title: "Luxury Experiences",
  description:
    "Explore handcrafted luxury travel experiences by Divas Sojourn — from wellness retreats and romantic honeymoons to premium safaris, cultural journeys, and river cruises. Curated for the extraordinary.",
  openGraph: {
    title: "Luxury Experiences | Divas Sojourn",
    description:
      "Indulgence, curated for the extraordinary. Premium travel experiences including wellness retreats, honeymoon escapes, wildlife safaris, and cultural immersions.",
  },
};

export default function LuxuryExperiencesPage() {
  return (
    <main>
      <LuxuryHero />
      <CategoryNav />
      {luxuryCategories.map((category) => (
        <LuxuryCategory key={category.id} category={category} />
      ))}
      <ConciergeForm />
    </main>
  );
}
