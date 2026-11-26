/**
 * Early bird pricing helpers.
 * Slots are consumed when a booking is created at the early-bird price.
 */

export type EarlyBirdInput = {
  price: number;
  earlyBirdPrice?: number | null;
  earlyBirdSlots?: number | null;
  earlyBirdSlotsUsed?: number | null;
};

export type EarlyBirdState = {
  /** Trip has an early-bird price configured */
  hasOffer: boolean;
  /** At least one early-bird slot remains */
  isAvailable: boolean;
  listPrice: number;
  earlyBirdPrice: number | null;
  /** Price the customer should pay right now */
  displayPrice: number;
  totalSlots: number;
  usedSlots: number;
  remainingSlots: number;
};

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function resolveEarlyBird(trip: EarlyBirdInput): EarlyBirdState {
  const listPrice = Number(trip.price) || 0;
  const earlyBirdPrice =
    trip.earlyBirdPrice != null && Number(trip.earlyBirdPrice) > 0
      ? Number(trip.earlyBirdPrice)
      : null;
  const totalSlots = Math.max(0, Number(trip.earlyBirdSlots ?? 3) || 0);
  const usedSlots = Math.max(0, Number(trip.earlyBirdSlotsUsed ?? 0) || 0);
  const remainingSlots = Math.max(0, totalSlots - usedSlots);
  const hasOffer = earlyBirdPrice != null && earlyBirdPrice < listPrice;
  const isAvailable = hasOffer && remainingSlots > 0;

  return {
    hasOffer,
    isAvailable,
    listPrice,
    earlyBirdPrice,
    displayPrice: isAvailable && earlyBirdPrice != null ? earlyBirdPrice : listPrice,
    totalSlots,
    usedSlots,
    remainingSlots,
  };
}

/**
 * Under the price:
 * - Active offer → discount line
 * - No early-bird price, or slots exhausted → booked message
 */
export function earlyBirdOfferLine(state: EarlyBirdState): string | null {
  if (state.listPrice <= 0) return null;
  if (state.isAvailable && state.earlyBirdPrice != null) {
    return `*Early Bird Discount at INR ${inr.format(state.earlyBirdPrice)}/-.`;
  }
  return "*All early bird slots are booked.";
}

/** Remaining slots, e.g. "3 slots left!" — only while the offer is available. */
export function earlyBirdRemainingLine(state: EarlyBirdState): string | null {
  if (!state.isAvailable) return null;
  const n = state.remainingSlots;
  if (n <= 0) return null;
  if (n === 1) return "*1 slot left!";
  return `*${n} slots left!`;
}
