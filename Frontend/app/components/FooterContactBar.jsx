"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { initialsFromTraveler } from "../lib/travelerInitials";

const signInPillClass =
  "inline-flex h-11 items-center justify-center gap-[7px] rounded-full border border-[#D4AF37] bg-transparent px-4 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-[#D4AF37] hover:text-[#0F0F0F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]";

export default function FooterContactBar() {
  const pathname = usePathname() || "/";
  const [sessionStatus, setSessionStatus] = useState("loading");
  const [initials, setInitials] = useState("");

  const signInHref = `/account?next=${encodeURIComponent(pathname)}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/account/me", {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (!res.ok) {
          if (!cancelled) {
            setInitials("");
            setSessionStatus("guest");
          }
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setInitials(initialsFromTraveler(data?.traveler));
          setSessionStatus("signed-in");
        }
      } catch {
        if (!cancelled) {
          setInitials("");
          setSessionStatus("guest");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <Link
        href="tel:+919990022835"
        className="inline-flex h-11 items-center gap-2 rounded-full bg-[#D4AF37] px-5 text-sm font-bold text-[#0F0F0F] transition hover:bg-[#E8C547]"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        +91-99900 22835
      </Link>

      {sessionStatus === "loading" ? (
        <span className="inline-block h-11 w-[108px] shrink-0" aria-hidden="true" />
      ) : sessionStatus === "signed-in" ? (
        <Link
          href="/account"
          aria-label={initials ? `Account (${initials})` : "My account"}
          title="My account"
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#D4AF37] px-3 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold tracking-wide text-[#D4AF37] transition hover:bg-[rgba(212,175,55,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          {initials || "·"}
        </Link>
      ) : (
        <Link href={signInHref} className={signInPillClass} aria-label="Sign in">
          <User className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          Sign in
        </Link>
      )}
    </div>
  );
}
