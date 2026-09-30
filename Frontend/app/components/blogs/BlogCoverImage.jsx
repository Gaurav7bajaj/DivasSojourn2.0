"use client";

import Image from "next/image";
import { useState } from "react";

function isValidCoverSrc(src) {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  );
}

/**
 * Cover image with a dark gradient fallback when src is missing or fails to load.
 * Never renders a broken-image icon.
 */
export default function BlogCoverImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes,
  priority = false,
  fill = true,
}) {
  const [failed, setFailed] = useState(false);
  const showImage = isValidCoverSrc(src) && !failed;

  return (
    <div className={`relative overflow-hidden bg-[#0F0F12] ${className}`}>
      <div
        className="absolute inset-0 bg-[linear-gradient(145deg,#1a1814_0%,#0F0F12_45%,#141210_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_30%_20%,rgba(214,174,60,0.22),transparent_55%)]"
        aria-hidden="true"
      />
      {showImage ? (
        <Image
          src={src.trim()}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes={sizes}
          className={`object-cover ${imageClassName}`}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="sr-only">{alt}</span>
      )}
    </div>
  );
}
