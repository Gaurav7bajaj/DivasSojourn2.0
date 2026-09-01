import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#1A1A1A] px-4 py-16">
      <SignIn forceRedirectUrl="/" fallbackRedirectUrl="/" />
    </main>
  );
}
