import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "../../components/international/ContactForm";
import { curatedEscapes } from "../../data/curatedEscapes";
import { formatDualPrice } from "../../utils/formatPrice";

const pageBaseUrl = "https://divassojourn.com/curated-escapes";

export function generateStaticParams() {
  return curatedEscapes.map((escape) => ({
    "category-slug": escape.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { "category-slug": categorySlug } = await params;
  const escape = curatedEscapes.find((item) => item.slug === categorySlug);

  if (!escape) {
    return {
      title: "Curated Escape Not Found | Divas Sojourn",
    };
  }

  return {
    title: `${escape.name} | Curated Escapes | Divas Sojourn`,
    description: escape.description,
    alternates: {
      canonical: `/curated-escapes/${escape.slug}`,
    },
    openGraph: {
      title: `${escape.name} | Divas Sojourn`,
      description: escape.description,
      url: `${pageBaseUrl}/${escape.slug}`,
      images: [
        {
          url: escape.image,
          width: 1200,
          height: 630,
          alt: `${escape.name} curated travel experience`,
        },
      ],
    },
  };
}

export default async function CuratedEscapeCategoryPage({ params }) {
  const { "category-slug": categorySlug } = await params;
  const escape = curatedEscapes.find((item) => item.slug === categorySlug);

  if (!escape) {
    notFound();
  }

  return (
    <main className="bg-[#1A1A1A] px-4 py-16">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-[#0F0F0F] shadow-2xl lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[300px]">
          <Image
            src={escape.image}
            alt={`${escape.name} curated travel experience`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" aria-hidden="true" />
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
            Curated Escape
          </p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">{escape.name}</h1>
          <p className="mt-5 leading-8 text-white/80">{escape.description}</p>
          <div className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="block font-black text-white">Typical Duration</span>
              {escape.duration}
            </p>
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="block font-black text-white">Starting From</span>
              <span className="rounded-full bg-white px-3 py-1 font-black text-black">
                {formatDualPrice(escape.priceInr)}
              </span>{" "}
              {escape.priceSuffix}
            </p>
          </div>
          <p className="mt-6 text-sm leading-7 text-white/70">
            Full itinerary, inclusions, and featured packages for this escape type will be added soon.
          </p>
          <Link
            href="/curated-escapes"
            className="mt-8 inline-flex w-fit rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-black text-[#0F0F0F] transition hover:bg-[#E8C547]"
          >
            Back to Curated Escapes
          </Link>
        </div>
      </section>

      <ContactForm
        eyebrow="Planning This Escape? We Will Give You A Call Back!"
        title="Enquire About This Escape"
        destinationOptions={curatedEscapes}
        defaultInterestedIn={escape.name}
        storageKey="divasCuratedEscapeLeads"
      />
    </main>
  );
}
