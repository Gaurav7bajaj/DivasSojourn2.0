import Link from "next/link";
import LegalPage, { LegalSection } from "../components/legal/LegalPage";

export const metadata = {
  title: "Privacy Policy | Divas Sojourn",
  description:
    "Learn how Divas Sojourn uses photographs, handles personal data, and manages promotional communications.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Divas Sojourn",
    description:
      "Our policy on photos, personal data, and promotional messages for Divas Sojourn travelers.",
    url: "https://divassojourn.com/privacy-policy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection title="Photographs & Media">
        <p>
          Divas Sojourn reserves the right to use any photograph/video taken at
          any event or during any travel activity, without the express written
          permission of those included within the photograph/video. Divas
          Sojourn may use the photograph/video in publications or other media
          material produced, used or contracted by Divas Sojourn, including but
          not limited to: brochures, invitations, books, newspapers, magazines,
          television, websites, etc. Any person desiring not to have their photo
          taken or distributed must contact{" "}
          <Link
            href="mailto:unsubscribe@divassojourn.com"
            className="text-[#D4AF37] underline-offset-2 hover:underline"
          >
            unsubscribe@divassojourn.com
          </Link>{" "}
          with his/her intentions and include a photograph.
        </p>
      </LegalSection>

      <LegalSection title="Policy Updates">
        <p>
          From time to time it may be necessary for us to review and revise our
          privacy policy. We reserve the right to change our privacy policy at
          any time; should this occur, the amendment would be posted on our
          website.
        </p>
      </LegalSection>

      <LegalSection title="Use of Your Data">
        <p>
          We assure you that we will not use your data to any other source. Your
          details will only be shared with hotels, resorts, camps for
          accommodation booking and to Railways and airlines for booking your
          tickets.
        </p>
      </LegalSection>

      <LegalSection title="Promotional Messages">
        <p>
          We only contact you if you have opted in to hear from us. Should you
          no longer wish to receive information on promotions and services we
          think may be of interest to you, or participate in market research,
          simply use the unsubscribe functionality included in our email
          communications. To remove your details from our mail database, send a
          written letter with your name and address to{" "}
          <Link
            href="mailto:unsubscribe@divassojourn.com"
            className="text-[#D4AF37] underline-offset-2 hover:underline"
          >
            unsubscribe@divassojourn.com
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
