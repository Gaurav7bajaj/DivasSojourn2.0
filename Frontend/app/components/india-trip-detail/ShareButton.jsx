"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ title, variant = "default" }) {
  const [message, setMessage] = useState("");

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, url: shareUrl });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setMessage("Link copied");
      window.setTimeout(() => setMessage(""), 1800);
    } catch {
      setMessage("Unable to share");
      window.setTimeout(() => setMessage(""), 1800);
    }
  };

  const className =
    variant === "hero"
      ? "inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-[rgba(8,8,10,0.55)] px-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#FBF8F1] backdrop-blur transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
      : "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/25";

  return (
    <div className="relative">
      <button type="button" onClick={handleShare} className={className}>
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Share
      </button>
      {message ? (
        <span className="absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-full bg-[#141417] px-3 py-1 font-[family-name:var(--font-dm-sans)] text-xs font-bold text-[#FBF8F1] shadow-lg">
          {message}
        </span>
      ) : null}
    </div>
  );
}
