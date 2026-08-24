import Link from "next/link";
import { Suspense } from "react";
import { LogIn } from "lucide-react";
import PhoneAuthForm from "../components/auth/PhoneAuthForm";

export const metadata = {
  title: "Sign up / Login | Divas Sojourn",
  description: "Sign up or log in with your mobile number to access trip itineraries and member features.",
  alternates: {
    canonical: "/auth",
  },
};

export default function AuthPage() {
  return (
    <main className="bg-[#F5F5F5]">
      <section className="bg-[#1A1A1A] px-4 py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
          <LogIn className="h-9 w-9" aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">
          Welcome Back
        </p>
        <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">Sign up / Login</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
          Use your mobile number to continue. We will send a one-time password to verify your account.
        </p>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-md">
          <nav className="mb-6 text-sm text-[#555555]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#0F9B9B]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-black text-[#D4AF37]">Sign up / Login</li>
            </ol>
          </nav>

          <Suspense fallback={<div className="rounded-3xl bg-white p-8 text-center">Loading...</div>}>
            <PhoneAuthForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
