"use client";

import { useState } from "react";

export default function CopyButton({ value, fieldLabel }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${fieldLabel}`}
      className="inline-flex h-9 min-w-[72px] shrink-0 items-center justify-center rounded-full border border-[#D6AE3C] px-3 font-[family-name:var(--font-dm-sans)] text-[12px] font-bold text-[#D6AE3C] transition hover:bg-[#D6AE3C] hover:text-[#1A1405]"
    >
      <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
    </button>
  );
}
