import { revalidatePath } from "next/cache";

/** Bust public trip listing / nav caches after admin create/update/delete. */
export function revalidateTripPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/upcoming-trips");
  revalidatePath("/india-trips");
  revalidatePath("/international-trips");
  revalidatePath("/calendar");
  if (slug) {
    revalidatePath(`/india-trips/${slug}`);
    revalidatePath(`/international-trips/${slug}`);
  }
}
