import Link from "next/link";
import { Lightbulb, Sparkles, Users } from "lucide-react";

const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/FfZpRJthh4F24GXEAvibPb";

function WhatsAppIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const BENEFITS = [
  {
    icon: Lightbulb,
    title: "Stay inspired",
    text: "Destination ideas and travel stories from women who've been there.",
  },
  {
    icon: Users,
    title: "Meet fellow travellers",
    text: "Find travel buddies before your trip even begins.",
  },
  {
    icon: Sparkles,
    title: "Hear it first",
    text: "Be the first to know about new tailored journeys and departures.",
  },
];

export default function WhatsAppCommunityCTA() {
  return (
    <section
      className="bg-[#0B0B0C] px-5 pb-16 md:px-12 md:pb-20 xl:px-24 xl:pb-24"
      aria-labelledby="whatsapp-community-heading"
    >
      <div className="grid grid-cols-1 items-center gap-10 rounded-[28px] border border-[rgba(214,174,60,0.28)] bg-[#121215] p-7 md:gap-14 md:p-10 lg:grid-cols-2 lg:p-14">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Community
            </p>
          </div>
          <h2
            id="whatsapp-community-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[32px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]"
          >
            Many more destinations are{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              waiting for you
            </em>
          </h2>
          <p className="mt-4 max-w-xl font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.6] text-[#D9D3C6] md:text-[17px]">
            Join our solo women WhatsApp community to stay inspired, meet fellow travelers, and hear
            about upcoming tailored journeys.
          </p>
          <Link
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#D6AE3C] px-7 py-3.5 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Join the WhatsApp community
          </Link>
        </div>

        <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li
                key={benefit.title}
                className="flex items-start gap-4 rounded-2xl border border-white/8 bg-[#18181C] p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(214,174,60,0.14)] text-[#D6AE3C]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] font-bold text-[#FBF8F1]">
                    {benefit.title}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-[14px] leading-snug text-[#C9C3B6]">
                    {benefit.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
