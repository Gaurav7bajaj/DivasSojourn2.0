export const metadata = {
  title: "Tailored Trips | Divas Sojourn",
  description:
    "Custom women-only travel experiences designed around how you want to journey. Content coming soon.",
  alternates: {
    canonical: "/tailored-trips",
  },
};

export default function TailoredTripsPage() {
  return (
    <main className="bg-[#1A1A1A] px-4 py-24 text-center text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">Coming Soon</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Tailored Trips</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/75 md:text-lg">
          Custom journeys designed around your pace, preferences, and travel style will be shared here
          soon.
        </p>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-[#D4AF37]" aria-hidden="true" />
      </div>
    </main>
  );
}
