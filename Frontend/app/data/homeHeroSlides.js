/**
 * Homepage hero carousel slides + stats.
 * TODO: Replace slide images with landscape photos (1920×1080 or larger).
 */

import { homeHeroImages } from "./heroImages";

export const HOME_HERO_STATS = [
  { value: "10000+", label: "women travelled with us" },
  { value: "1300+", label: "destinations" },
  { value: "2015", label: "travelling since" },
];

/** Autoplay duration in ms — keep in sync with progress-bar CSS animation. */
export const HOME_HERO_INTERVAL_MS = 6000;

const slideCopy = [
  {
    eyebrow: "EMPOWERING WOMEN SINCE 2015",
    title: "A global community of solo",
    highlight: "women",
    titleAfter: "travellers",
    text: "Curated journeys for women seeking comfort, connection and memorable adventures across India and the world.",
    primaryCta: { label: "Explore trips", href: "/upcoming-trips" },
    secondaryCta: { label: "View calendar", href: "/calendar" },
  },
  {
    eyebrow: "INTERNATIONAL TRIPS",
    title: "See the world,",
    highlight: "together",
    titleAfter: "",
    text: "Small-group journeys abroad with women who travel like you.",
    primaryCta: { label: "International trips", href: "/international-trips" },
    secondaryCta: { label: "Upcoming trips", href: "/upcoming-trips" },
  },
  {
    eyebrow: "INDIA TRIPS",
    title: "Rediscover India,",
    highlight: "your way",
    titleAfter: "",
    text: "From the mountains to the coast — join a group departure, or let us tailor a trip around you.",
    primaryCta: { label: "India trips", href: "/india-trips" },
    secondaryCta: { label: "Personalize a trip", href: "/personalize-trip" },
  },
  {
    eyebrow: "WOMEN-ONLY TRAVEL",
    title: "Moments that become",
    highlight: "stories",
    titleAfter: "",
    text: "Travel with a trusted community — shared laughs, safe stays, and itineraries built around how women actually want to explore.",
    primaryCta: { label: "Explore trips", href: "/upcoming-trips" },
    secondaryCta: { label: "View gallery", href: "/gallery" },
  },
  {
    eyebrow: "COMMUNITY JOURNEYS",
    title: "Find your people,",
    highlight: "find your place",
    titleAfter: "",
    text: "Small groups, thoughtful pacing, and friendships that often outlast the trip itself.",
    primaryCta: { label: "Upcoming trips", href: "/upcoming-trips" },
    secondaryCta: { label: "About us", href: "/about-us" },
  },
  {
    eyebrow: "CURATED ESCAPES",
    title: "Comfort, connection,",
    highlight: "adventure",
    titleAfter: "",
    text: "From scenic getaways to cultural deep-dives — every departure is planned end-to-end by our in-house team.",
    primaryCta: { label: "View calendar", href: "/calendar" },
    secondaryCta: { label: "International trips", href: "/international-trips" },
  },
  {
    eyebrow: "SOLO, NEVER ALONE",
    title: "Step out,",
    highlight: "together",
    titleAfter: "",
    text: "Whether it is your first group trip or your tenth, you will always have company that feels like home on the road.",
    primaryCta: { label: "India trips", href: "/india-trips" },
    secondaryCta: { label: "Personalize a trip", href: "/personalize-trip" },
  },
];

/** One carousel slide per home hero photo. */
export const homeHeroSlides = homeHeroImages.map((image, index) => {
  const copy = slideCopy[index] || slideCopy[index % slideCopy.length];
  return {
    image: image.src,
    alt: image.alt,
    ...copy,
  };
});
