export default function Loading() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center bg-[#0B0B0C] px-6 py-24 font-[family-name:var(--font-dm-sans)] text-[#C9C3B6]"
      role="status"
      aria-live="polite"
    >
      Loading gallery…
    </div>
  );
}
