import Image from "next/image";
import "./youtubeTestimonials.css";

export const DIVAS_YOUTUBE_URL = "https://www.youtube.com/@DS-womenonlytrips";

function YouTubeIcon({ className = "ds-yt__icon" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function ArrowIcon({ className = "ds-yt__arrow" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * YouTube video testimonials CTA — placed below Google reviews sitewide.
 */
export default function YouTubeTestimonials() {
  return (
    <section className="ds-yt" aria-labelledby="ds-yt-heading">
      <div className="ds-yt__inner">
        <div className="ds-yt__copy">
          <div className="ds-yt__eyebrow">
            <span className="ds-yt__eyebrow-rule" aria-hidden="true" />
            <p>Video stories</p>
          </div>

          <h2 id="ds-yt-heading" className="ds-yt__title">
            Hear it from <em>our divas</em>
          </h2>

          <p className="ds-yt__blurb">
            Real women, real journeys. Watch our travellers share their stories, from first-time
            solo trips to friendships made halfway across the world.
          </p>

          <div className="ds-yt__stats">
            <div>
              <p className="ds-yt__stat-value">14000+</p>
              <p className="ds-yt__stat-label">women travelled with us</p>
            </div>
            <div>
              <p className="ds-yt__stat-value">Since 2015</p>
              <p className="ds-yt__stat-label">stories on camera</p>
            </div>
          </div>

          <a
            href={DIVAS_YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-yt__cta"
          >
            <YouTubeIcon />
            Watch on YouTube
            <ArrowIcon />
          </a>
        </div>

        <a
          href={DIVAS_YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ds-yt__card"
          aria-label="Watch Divas Sojourn videos on YouTube"
        >
          <Image
            src="/images/youtube-cover.webp"
            alt="Divas Sojourn travellers under the Northern Lights"
            fill
            sizes="(max-width: 960px) 100vw, 560px"
            className="ds-yt__cover"
            loading="lazy"
          />
          <span className="ds-yt__shade" aria-hidden="true" />

          <span className="ds-yt__badge">
            <YouTubeIcon className="ds-yt__badge-icon" />
            YouTube
          </span>

          <span className="ds-yt__play" aria-hidden="true">
            <span className="ds-yt__play-triangle" />
          </span>

          <span className="ds-yt__card-footer">
            <span>
              <span className="ds-yt__card-title">Divas Sojourn on YouTube</span>
              <span className="ds-yt__card-sub">
                Video testimonials · trip highlights · travel tips
              </span>
            </span>
            <span className="ds-yt__card-arrow" aria-hidden="true">
              <ArrowIcon />
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
