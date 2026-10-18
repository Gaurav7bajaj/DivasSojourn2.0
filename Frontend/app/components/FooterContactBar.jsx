"use client";

import Link from "next/link";
import { Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

function initialsFromName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

export default function FooterContactBar() {
  const [initials, setInitials] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/account/me", {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (!res.ok) {
          if (!cancelled) setInitials("");
          return;
        }
        const data = await res.json();
        if (!cancelled) setInitials(initialsFromName(data?.traveler?.fullName));
      } catch {
        if (!cancelled) setInitials("");
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

      <Link
        href="/account"
        aria-label={initials ? `Account (${initials})` : "Sign in to account"}
        title={initials ? "My account" : "Sign in"}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#D4AF37] font-[family-name:var(--font-dm-sans)] text-[13px] font-bold tracking-wide text-[#D4AF37] transition hover:bg-[rgba(212,175,55,0.12)]"
      >
        {initials || <UserRound className="h-4 w-4" aria-hidden="true" />}
      </Link>
    </div>
  );
}
