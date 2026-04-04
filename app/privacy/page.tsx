import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | High School AI Art Competition",
  description: "Privacy policy for the High School AI Art Competition website and event."
};

const updatedOn = "April 3, 2026";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      updatedOn={updatedOn}
      intro={
        <>
          <p>
            We collect limited information to run the competition and manage access to the site. By using the site,
            you consent to the collection and use of information described here.
          </p>
        </>
      }
      sections={[
        {
          title: "What we collect",
          content: (
            <>
              <p>
                We may collect account and submission information you provide, including name, email address, school,
                artwork title, theme, uploaded images, prompt logs, AI tools used, your creative process statement,
                and, for participants under 18, a parent or guardian name.
              </p>
              <p>
                We may also collect technical information such as log data, cookies, session information, browser
                details, and device or usage data needed to operate, secure, and improve the site.
              </p>
            </>
          )
        },
        {
          title: "How we use it",
          content: (
            <>
              <p>
                We use information to authenticate users, review submissions, administer the competition, contact
                participants, display selected works, protect the site, investigate misuse, and support related
                educational or nonprofit activities.
              </p>
              <p>
                We may use third-party providers, including hosting, storage, analytics, authentication, and email
                services, that process data on our behalf.
              </p>
            </>
          )
        },
        {
          title: "Sharing and retention",
          content: (
            <>
              <p>
                We do not sell personal information. We may share information with organizers, judges, service
                providers, legal authorities, or others when reasonably necessary to run the competition, protect
                people or rights, comply with law, or enforce our terms.
              </p>
              <p>
                We may retain information for as long as reasonably useful for competition administration, records,
                safety, legal compliance, dispute resolution, and nonprofit program history.
              </p>
            </>
          )
        },
        {
          title: "Your choices",
          content: (
            <>
              <p>
                You may request access, correction, or deletion by contacting us, but we may keep information when
                needed for legitimate operational, archival, safety, or legal reasons.
              </p>
              <p>
                If you are a parent, guardian, or participant and have a privacy question, contact{" "}
                <Link href="mailto:laces.ai.and.art@gmail.com" className="font-medium text-primary hover:underline">
                  laces.ai.and.art@gmail.com
                </Link>
                .
              </p>
            </>
          )
        },
        {
          title: "Limits",
          content: (
            <>
              <p>
                No method of storage or transmission is completely secure, and we cannot guarantee absolute security or
                uninterrupted availability. If we update this policy, the revised version will be posted here.
              </p>
            </>
          )
        }
      ]}
    />
  );
}
