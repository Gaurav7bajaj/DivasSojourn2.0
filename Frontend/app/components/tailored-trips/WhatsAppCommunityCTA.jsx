import Link from "next/link";

const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/FfZpRJthh4F24GXEAvibPb";

export default function WhatsAppCommunityCTA() {
  return (
    <section
      className="border-t border-[#D4AF37]/20 bg-[#0F0F0F] px-4 py-16 md:py-20"
      aria-labelledby="whatsapp-community-heading"
    >
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#D4AF37]/35 bg-gradient-to-b from-[#1A1A1A] to-[#121212] px-6 py-10 text-center md:px-10 md:py-12">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">Community</p>
        <h2
          id="whatsapp-community-heading"
          className="mt-4 text-2xl font-black leading-snug text-white md:text-4xl"
        >
          Many more destinations are awaiting for you
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/70 md:text-lg">
          Join our solo women WhatsApp community to stay inspired, meet fellow travelers, and hear
          about upcoming tailored journeys.
        </p>
        <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        <Link
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#D4AF37] px-8 py-3.5 text-sm font-black uppercase tracking-wide text-[#1A1A1A] transition hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_10px_28px_rgba(212,175,55,0.3)]"
        >
          Join our solo women WhatsApp community
        </Link>
      </div>
    </section>
  );
}
