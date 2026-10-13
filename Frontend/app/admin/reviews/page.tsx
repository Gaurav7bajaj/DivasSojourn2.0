import ReviewsAdminClient from "./ReviewsAdminClient";

export const dynamic = "force-dynamic";

export default function AdminReviewsPage() {
  return (
    <div>
      <h1 className="text-3xl font-black">Reviews</h1>
      <p className="mt-2 text-sm text-[#555555]">
        Manage Google wall reviews and platform rating counts shown on the website.
      </p>
      <div className="mt-8">
        <ReviewsAdminClient />
      </div>
    </div>
  );
}
