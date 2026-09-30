import { Suspense } from "react";
import GalleryClient from "../components/gallery/GalleryClient";
import ShortContactForm from "../components/international/ShortContactForm";
import { getGalleryImages } from "../lib/data/gallery";
import { toPublicGalleryItem } from "../lib/data/mappers";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery | Divas Sojourn",
  description:
    "Browse photos from Divas Sojourn women-only trips across India and international destinations.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Gallery | Divas Sojourn",
    description: "Moments from our women-only travel journeys around the world.",
    url: "https://divassojourn.com/gallery",
    type: "website",
  },
};

export default async function GalleryPage() {
  const rows = await getGalleryImages();
  const images = rows.map((image, index) => toPublicGalleryItem(image, index));

  return (
    <main className="bg-[#0B0B0C]">
      <Suspense
        fallback={
          <div className="px-6 py-24 text-center font-[family-name:var(--font-dm-sans)] text-[#D9D3C6]">
            Loading gallery…
          </div>
        }
      >
        <GalleryClient images={images} />
      </Suspense>
      <ShortContactForm pageLabel="Gallery" storageKey="divasGalleryLeads" />
    </main>
  );
}
