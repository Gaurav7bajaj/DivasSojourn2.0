"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ title }) {
  const [message, setMessage] = useState("");

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
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

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/25"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Share
      </button>
      {message ? (
        <span className="absolute right-0 top-full mt-2 rounded-full bg-[#1A1A1A] px-3 py-1 text-xs font-bold text-white">
          {message}
        </span>
      ) : null}
    </div>
  );
}
