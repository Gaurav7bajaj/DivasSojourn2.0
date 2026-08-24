/**
 * Shared content models for Blogs & Gallery.
 *
 * Prisma schema models mirror these field names. SQLite is used locally;
 * switch DATABASE_URL + provider to Postgres for production without changing
 * these types or the data-access function signatures.
 */

export type Blog = {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  excerpt: string;
  content: string;
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  /** Optional fields used by existing public UI cards/filters */
  category?: string;
  categories?: string[];
  destination?: string;
  readingTime?: string;
  featured?: boolean;
};

export type BlogCreateInput = {
  title: string;
  slug?: string;
  coverImageUrl?: string;
  excerpt: string;
  content: string;
  author: string;
  published?: boolean;
  category?: string;
  categories?: string[];
  destination?: string;
  readingTime?: string;
  featured?: boolean;
};

export type BlogUpdateInput = Partial<BlogCreateInput>;

export type GalleryImage = {
  id: string;
  imageUrl: string;
  caption?: string;
  category?: string;
  createdAt: string;
};

export type GalleryImageCreateInput = {
  imageUrl: string;
  caption?: string;
  category?: string;
};

/** Shape expected by existing blog listing/detail components */
export type PublicBlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  categories: string[];
  destination: string;
  author: string;
  date: string;
  datePublished: string;
  readingTime: string;
  featured?: boolean;
  content: string;
};

/** Shape expected by PhotoGallery */
export type PublicGalleryItem = {
  src: string;
  alt: string;
};

export type TripDestination = "India" | "International";

export type TripItineraryDay = {
  day: number;
  date: string;
  title: string;
  location?: string;
  hotel?: string;
  meals?: string;
  description?: string;
};

export type TripAccommodation = {
  destination: string;
  hotel: string;
  category?: string;
  nights: number | string;
};

export type TripFinancialDetails = {
  company?: string;
  accountNo?: string;
  bankName?: string;
  ifsc?: string;
  phonePay?: string;
  upi?: string;
};

export type Trip = {
  id: string;
  title: string;
  shortName: string;
  slug: string;
  destination: TripDestination;
  image: string;
  galleryImages: string[];
  pdfPath?: string;
  sourcePdf?: string;
  dates: string;
  startDate: string;
  endDate: string;
  duration: string;
  nights: number;
  days: number;
  pickupLocation: string;
  dropLocation: string;
  route: string;
  price: number;
  currency: string;
  earlyBirdPrice?: number;
  singleSupplement?: number;
  singleOccupancyPrice?: number;
  soldOut?: boolean;
  overview: string;
  highlights: string[];
  paymentConditions: string;
  notes: string[];
  itinerary: TripItineraryDay[];
  accommodations: TripAccommodation[];
  inclusions: string[];
  exclusions: string[];
  financialDetails: TripFinancialDetails;
  cancellationLinks: string[];
  published: boolean;
  /** Computed at read time from startDate */
  status: "upcoming" | "past";
  createdAt: string;
  updatedAt: string;
};

export type TripCreateInput = {
  title: string;
  shortName: string;
  slug?: string;
  destination: TripDestination;
  image?: string;
  galleryImages?: string[];
  pdfPath?: string;
  sourcePdf?: string;
  dates?: string;
  startDate: string;
  endDate: string;
  duration?: string;
  nights?: number;
  days?: number;
  pickupLocation?: string;
  dropLocation?: string;
  route?: string;
  price?: number;
  currency?: string;
  earlyBirdPrice?: number | null;
  singleSupplement?: number | null;
  singleOccupancyPrice?: number | null;
  soldOut?: boolean;
  overview?: string;
  highlights?: string[];
  paymentConditions?: string;
  notes?: string[];
  itinerary?: TripItineraryDay[];
  accommodations?: TripAccommodation[];
  inclusions?: string[];
  exclusions?: string[];
  financialDetails?: TripFinancialDetails;
  cancellationLinks?: string[];
  published?: boolean;
};

export type TripUpdateInput = Partial<TripCreateInput>;

/** Shape used by UpcomingTripCard / listing grids */
export type UpcomingTripCard = {
  id: string;
  title: string;
  slug: string;
  image: string;
  destination: TripDestination;
  duration: { nights: number; days: number };
  departure: string;
  startDate: string;
  endDate: string;
  batches: number;
  originalPrice: number | null;
  currentPrice: number;
  description: string;
  soldOut?: boolean;
};

/** Compact nav / destination card shape */
export type TripNavItem = {
  id: string;
  title: string;
  shortName: string;
  slug: string;
  image: string;
  dates: string;
  duration: string;
  price: number;
  description: string;
  featured: boolean;
  name?: string;
  subtitle?: string;
  startingPrice?: number;
  badge?: string;
};
