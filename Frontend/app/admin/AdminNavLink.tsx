"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminNavLink({
  href,
  children,
  showUnreadBadge = false,
}: {
  href: string;
  children: React.ReactNode;
  showUnreadBadge?: boolean;
}) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const active = pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!showUnreadBadge) return;

    let activeFetch = true;

    (async () => {
      try {
        const response = await fetch("/api/admin/enquiries", { cache: "no-store" });
        const data = await response.json();
        if (!activeFetch || !response.ok) return;
        setUnreadCount(data.unreadCount || 0);
      } catch {
        // ignore badge errors
      }
    })();

    return () => {
      activeFetch = false;
    };
  }, [showUnreadBadge, pathname]);

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 hover:text-[#D4AF37] ${
        active ? "text-[#D4AF37]" : ""
      }`}
    >
      {children}
      {showUnreadBadge && unreadCount > 0 ? (
        <span className="rounded-full bg-[#D4AF37] px-1.5 py-0.5 text-[10px] font-black leading-none text-[#1A1A1A]">
          {unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
