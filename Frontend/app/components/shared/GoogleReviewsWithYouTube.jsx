import GoogleReviews from "./GoogleReviews";
import YouTubeTestimonials from "./YouTubeTestimonials";

/**
 * Shared reviews block: Google reviews wall + YouTube testimonials CTA beneath it.
 * Keeps GoogleReviews unchanged while ensuring every consumer gets the video section.
 */
export default function GoogleReviewsWithYouTube(props) {
  return (
    <>
      <GoogleReviews {...props} />
      <YouTubeTestimonials />
    </>
  );
}
