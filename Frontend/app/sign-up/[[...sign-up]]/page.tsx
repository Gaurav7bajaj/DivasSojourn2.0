import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#1A1A1A] px-4 py-16">
      <SignUp forceRedirectUrl="/" fallbackRedirectUrl="/" />
    </main>
  );
}
