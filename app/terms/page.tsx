import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use | High School AI Art Competition",
  description: "Terms of use for the High School AI Art Competition website and event."
};

const updatedOn = "April 3, 2026";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Use"
      updatedOn={updatedOn}
      intro={
        <>
          <p>
            This site is operated by student groups at UCLA and local volunteers to support a nonprofit educational
            cause. By using the site or submitting artwork, you agree to these terms.
          </p>
        </>
      }
      sections={[
        {
          title: "Using the site",
          content: (
            <>
              <p>
                You may use the site only for lawful participation in the competition. We may suspend, remove, or
                refuse any account, submission, or access at any time, with or without notice, for any reason.
              </p>
              <p>
                You are responsible for the accuracy of what you submit and for obtaining any permission or parental
                consent needed to participate.
              </p>
            </>
          )
        },
        {
          title: "Your submissions",
          content: (
            <>
              <p>
                You keep ownership of your work, but by submitting it you give us a worldwide, royalty-free license to
                host, review, reproduce, display, share, promote, archive, and administer the competition and related
                nonprofit programming.
              </p>
              <p>
                You represent that your submission does not violate any law or third-party rights and does not include
                harmful, infringing, or misleading material.
              </p>
            </>
          )
        },
        {
          title: "No promises",
          content: (
            <>
              <p>
                The site, competition, judging process, prizes, and related materials are provided on an "as is" and
                "as available" basis. We may change, pause, or cancel any part of them at any time.
              </p>
              <p>
                To the fullest extent permitted by law, we disclaim all warranties, including merchantability, fitness
                for a particular purpose, non-infringement, accuracy, availability, and security.
              </p>
            </>
          )
        },
        {
          title: "Liability limits",
          content: (
            <>
              <p>
                Participation is voluntary and at your own risk. To the fullest extent permitted by law, you release
                and hold harmless the organizers, volunteers, sponsors, affiliates, and related representatives from
                claims, losses, damages, liabilities, costs, and expenses arising out of or related to the site, the
                competition, submissions, judging, prizes, technical failures, third-party services, or reliance on any
                site content.
              </p>
              <p>
                To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special,
                consequential, exemplary, or punitive damages, or for any lost data, profits, opportunities, or
                goodwill, even if we were advised of the possibility.
              </p>
            </>
          )
        },
        {
          title: "General",
          content: (
            <>
              <p>
                You agree to indemnify and defend us against claims arising from your use of the site or your
                submissions. If any part of these terms is unenforceable, the rest will remain in effect.
              </p>
              <p>
                We may update these terms by posting a revised version here. Continued use of the site means you accept
                the updated terms.
              </p>
            </>
          )
        }
      ]}
    />
  );
}
