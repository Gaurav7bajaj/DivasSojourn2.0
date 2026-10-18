import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { navLinks, tripMenus } from "../data/mockData";
import FooterContactBar from "./FooterContactBar";

export default function Footer() {
  return (
    <footer
      className="border-t border-white/10 bg-black px-4 py-12 text-white"
      style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center" aria-label="Divas Sojourn home">
            <Image
              src="/divas-sojourn-logo.png"
              alt="Divas Sojourn"
              width={220}
              height={54}
              className="h-12 w-auto object-contain"
              style={{ width: "auto" }}
            />
          </Link>
          <p className="mt-4 max-w-md leading-7 text-white/80">
            A global community of women travelling safely, beautifully, and together
          </p>

          <FooterContactBar />

          <div className="mt-5 space-y-3 text-sm text-white/70">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <Link href="mailto:contact@divassojourn.com" className="transition hover:text-[#D4AF37]">
                contact@divassojourn.com
              </Link>
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <span>New Delhi, India</span>
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-white uppercase tracking-wider text-sm">Explore</h2>
          <div className="mt-4 grid gap-3 text-sm text-white/80">
            {tripMenus.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#D4AF37]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-white uppercase tracking-wider text-sm">Company</h2>
          <div className="mt-4 grid gap-3 text-sm text-white/80">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#D4AF37]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Copyright &copy; 2015&ndash;{new Date().getFullYear()} Divas Sojourn. All
          rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/terms-condition" className="transition hover:text-[#D4AF37]">
            Terms &amp; Conditions
          </Link>
          <Link href="/privacy-policy" className="transition hover:text-[#D4AF37]">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
