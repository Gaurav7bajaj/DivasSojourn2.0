import { Phone, Users } from "lucide-react";
import { socialLinks } from "../../data/aboutData";

function BrandIcon({ path, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const Facebook = ({ className }) => (
  <BrandIcon
    className={className}
    path="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.09 16.06 2 14.91 2 12.27 2 10.5 3.66 10.5 6.7V9.5H8v4h2.5V22h3.5z"
  />
);

const Instagram = ({ className }) => (
  <BrandIcon
    className={className}
    path="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
  />
);

const Linkedin = ({ className }) => (
  <BrandIcon
    className={className}
    path="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"
  />
);

const Twitter = ({ className }) => (
  <BrandIcon
    className={className}
    path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  />
);

const Youtube = ({ className }) => (
  <BrandIcon
    className={className}
    path="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"
  />
);

const iconMap = {
  whatsapp: Phone,
  "facebook-page": Facebook,
  "facebook-group": Users,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

function formatPhoneDisplay(label) {
  const digits = label.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 6)} ${digits.slice(6)}`;
  }
  return label;
}

function phoneToTel(label) {
  const digits = label.replace(/\D/g, "");
  return digits.length === 10 ? `tel:+91${digits}` : `tel:${digits}`;
}

function buildSocialTiles() {
  const tiles = [];

  for (const item of socialLinks) {
    if (item.id === "whatsapp" && item.phones?.length) {
      for (const phone of item.phones) {
        tiles.push({
          id: `call-${phone.label}`,
          label: "Call / WhatsApp",
          value: formatPhoneDisplay(phone.label),
          href: phoneToTel(phone.label),
          Icon: Phone,
          external: false,
        });
      }
      continue;
    }

    tiles.push({
      id: item.id,
      label: item.id === "twitter" ? "X (Twitter)" : item.label,
      value: item.detail,
      href: item.href,
      Icon: iconMap[item.id] || Phone,
      external: true,
    });
  }

  return tiles;
}

const socialTiles = buildSocialTiles();

export default function StatsSection() {
  return (
    <section
      className="bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
      aria-labelledby="connect-with-us-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-10 rounded-[24px] border border-white/[0.08] bg-[#121215] p-8 md:grid-cols-[300px_1fr] md:gap-12 md:p-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Stay Connected
              </p>
            </div>
            <h2
              id="connect-with-us-heading"
              className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[40px]"
            >
              Follow{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                Divas Sojourn
              </em>
            </h2>
            <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6]">
              Trip stories, new departures and community moments — wherever you scroll.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {socialTiles.map((tile) => {
              const Icon = tile.Icon;
              return (
                <a
                  key={tile.id}
                  href={tile.href}
                  {...(tile.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex min-h-11 items-center gap-3.5 rounded-2xl border border-white/[0.08] bg-[#18181C] px-[18px] py-3.5 transition hover:border-[#D6AE3C]"
                >
                  <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[rgba(214,174,60,0.16)] text-[#D6AE3C]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-[family-name:var(--font-dm-sans)] text-[12px] text-[#C9C3B6]">
                      {tile.label}
                    </span>
                    <span className="mt-0.5 block truncate font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#FBF8F1] transition group-hover:text-[#D6AE3C]">
                      {tile.value}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
