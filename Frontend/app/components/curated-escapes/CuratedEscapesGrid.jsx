import { curatedEscapes } from "../../data/curatedEscapes";
import CuratedEscapeCard from "./CuratedEscapeCard";

export default function CuratedEscapesGrid() {
  return (
    <section
      className="bg-[#1A1A1A] px-4 py-14 md:py-20"
      aria-label="Curated escape categories"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {curatedEscapes.map((escape) => (
            <CuratedEscapeCard key={escape.slug} escape={escape} />
          ))}
        </div>
      </div>
    </section>
  );
}
