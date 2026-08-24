"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { galleryImages as defaultGalleryImages } from "../../data/aboutData";

export default function PhotoGallery({ images }) {
  const galleryImages = images?.length ? images : defaultGalleryImages;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 },
    );
    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0F0F0F] px-4 py-20"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Our Journeys
          </p>
          <h2
            id="gallery-heading"
            className="mt-3 text-3xl font-black text-white md:text-5xl"
          >
            Moments That Define Us
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {galleryImages.map((img, index) => (
            <div
              key={`${img.src}-${img.alt}-${index}`}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 shadow-lg transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              } ${index === 0 || index === 5 ? "row-span-2 h-[420px] md:h-[520px]" : "h-[200px] md:h-[250px]"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
