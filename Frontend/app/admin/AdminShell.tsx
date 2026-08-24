"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className="min-h-screen bg-[#F4F4F4] text-[#1A1A1A]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#1A1A1A]">
      <header className="border-b border-black/10 bg-[#1A1A1A] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-black uppercase tracking-[0.2em] text-[#D4AF37]">
              Divas Admin
            </Link>
            <nav className="hidden items-center gap-4 text-sm font-semibold sm:flex">
              <Link href="/admin/blogs" className="hover:text-[#D4AF37]">
                Blogs
              </Link>
              <Link href="/admin/gallery" className="hover:text-[#D4AF37]">
                Gallery
              </Link>
              <Link href="/admin/trips" className="hover:text-[#D4AF37]">
                Trips
              </Link>
              <Link href="/" className="text-white/70 hover:text-white">
                View site
              </Link>
            </nav>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
