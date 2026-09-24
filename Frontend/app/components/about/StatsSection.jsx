import {
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";
import { socialLinks } from "../../data/aboutData";

const iconMap = {
  whatsapp: Phone,
  "facebook-page": Facebook,
  "facebook-group": Users,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

export default function StatsSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#0F0F0F] px-4 py-16 md:py-20"
      aria-labelledby="connect-with-us-heading"
    >
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Stay Connected
          </p>
          <h2
            id="connect-with-us-heading"
            className="mt-3 text-2xl font-black text-white md:text-4xl"
          >
            Follow Divas Sojourn
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {socialLinks.map((item) => {
            const Icon = iconMap[item.id] || Phone;

            if (item.id === "whatsapp" && item.phones?.length) {
              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center rounded-2xl border border-[#D4AF37]/25 bg-[#1A1A1A] px-4 py-6 text-center transition hover:border-[#D4AF37]/70 hover:shadow-[0_10px_28px_rgba(212,175,55,0.15)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-sm font-black uppercase tracking-wide text-white">
                    {item.label}
                  </p>
                  <div className="mt-2 flex flex-col gap-1 text-xs font-semibold text-white/70">
                    {item.phones.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-[#D4AF37]"
                      >
                        {phone.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center rounded-2xl border border-[#D4AF37]/25 bg-[#1A1A1A] px-4 py-6 text-center transition hover:-translate-y-1 hover:border-[#D4AF37]/70 hover:shadow-[0_10px_28px_rgba(212,175,55,0.15)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37] transition group-hover:bg-[#D4AF37] group-hover:text-[#1A1A1A]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-black uppercase tracking-wide text-white">
                  {item.label}
                </p>
                <p className="mt-2 text-xs font-semibold text-white/60 group-hover:text-[#D4AF37]">
                  {item.detail}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
