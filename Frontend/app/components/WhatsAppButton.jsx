import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/919990022835"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Divas Sojourn on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:-translate-y-1 hover:shadow-[#25D366]/30"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </Link>
  );
}
