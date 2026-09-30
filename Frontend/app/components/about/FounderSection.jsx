import Image from "next/image";
import { founderData, socialLinks } from "../../data/aboutData";

const linkedIn = socialLinks.find((link) => link.id === "linkedin");

export default function FounderSection() {
  return (
    <section
      id="founder"
      className="scroll-mt-24 bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
      aria-labelledby="founder-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-center gap-12 rounded-[28px] border border-[rgba(214,174,60,0.22)] bg-[#121215] p-8 md:grid-cols-[340px_1fr] md:gap-16 md:p-14">
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-[300px] w-[300px] items-center justify-center rounded-full bg-[rgba(214,174,60,0.12)] p-1.5 shadow-[0_0_48px_rgba(214,174,60,0.18)]">
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-[rgba(214,174,60,0.6)]">
                <Image
                  src={founderData.image}
                  alt={`${founderData.name}, Founder and CEO of Divas Sojourn`}
                  fill
                  sizes="300px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <h3 className="mt-6 font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-[#FBF8F1]">
              {founderData.name}
            </h3>
            <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold tracking-wide text-[#D6AE3C]">
              {founderData.title}
            </p>
            {linkedIn ? (
              <a
                href={linkedIn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#E2BB4D] transition hover:text-[#E6BF4C]"
              >
                Connect on LinkedIn →
              </a>
            ) : null}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Founder&apos;s Message
              </p>
            </div>
            <h2
              id="founder-heading"
              className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]"
            >
              The woman{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                behind the movement
              </em>
            </h2>
            <blockquote className="mt-8 border-l-[3px] border-[#D6AE3C] pl-6">
              <p className="font-[family-name:var(--font-playfair)] text-[24px] font-medium italic leading-snug text-[#FBF8F1] md:text-[30px]">
                &ldquo;{founderData.quote}&rdquo;
              </p>
            </blockquote>
            <p className="mt-6 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.65] text-[#D9D3C6] md:text-[17px]">
              {founderData.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
