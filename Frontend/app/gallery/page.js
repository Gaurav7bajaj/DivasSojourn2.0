import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { PhotoGallery } from "../components/about";
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
  const images = (await getGalleryImages()).map(toPublicGalleryItem);

  return (
    <main className="bg-[#F5F5F5]">
      <section className="bg-[#1A1A1A] px-4 py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
          <ImageIcon className="h-9 w-9" aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">Our Journeys</p>
        <h1 className="mt-3 text-4xl font-black text-white md:text-6xl">Gallery</h1>
        <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#D4AF37]" aria-hidden="true" />
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 text-sm text-[#555555]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#0F9B9B]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-black text-[#D4AF37]">Gallery</li>
            </ol>
          </nav>
        </div>
      </section>

      <PhotoGallery images={images} />
    </main>
  );
}
