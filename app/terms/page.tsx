import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "../../components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using MamaCare, including important information about medical advice and emergencies.",
};

const CONTACT_EMAIL = "uwizeyekevin43@gmail.com";

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About MamaCare",
    body: (
      <p>
        MamaCare provides information and tools to support mothers during pregnancy, birth and the first months with a
        new baby. This includes guides, a due date calculator, a symptom checker, and tools to keep track of your
        pregnancy. By creating an account or using the service, you agree to these terms.
      </p>
    ),
  },
  {
    id: "not-medical-care",
    title: "Not a substitute for medical care",
    body: (
      <>
        <p>
          <strong>
            MamaCare does not provide medical diagnosis or treatment, and it is not a replacement for your midwife, doctor,
            Community Health Worker or health facility.
          </strong>
        </p>
        <ul>
          <li>The symptom checker gives general guidance based on what you type. It can be wrong or incomplete.</li>
          <li>Always follow the advice of the health workers who care for you.</li>
          <li>Do not delay getting care because of something you read in MamaCare.</li>
        </ul>
        <p>
          <strong>
            In an emergency, call 912 or go to the nearest health facility immediately. Do not wait for an answer from
            MamaCare.
          </strong>
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    body: (
      <ul>
        <li>Give accurate information and keep it up to date.</li>
        <li>Keep your password private. You are responsible for activity on your account.</li>
        <li>Tell us straight away if you think someone else has used your account.</li>
        <li>If you are under 18, use MamaCare with a parent, guardian or health worker.</li>
      </ul>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Use MamaCare for anything unlawful, or to harass or harm others.</li>
          <li>Try to access other people&apos;s accounts or data, or interfere with the service or its security.</li>
          <li>Send automated requests in large numbers, or copy the service for commercial use without permission.</li>
        </ul>
        <p>We may suspend or close accounts that break these rules.</p>
      </>
    ),
  },
  {
    id: "content",
    title: "Health information and content",
    body: (
      <p>
        Our guides are written to follow recognised guidance such as that of the World Health Organization, but medical
        knowledge changes and every pregnancy is different. We do our best to keep content accurate, but we cannot
        guarantee that it is complete, current or right for your situation.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Your privacy",
    body: (
      <p>
        How we handle your personal and health information is explained in our <Link href="/privacy">Privacy Policy</Link>,
        which forms part of these terms.
      </p>
    ),
  },
  {
    id: "availability",
    title: "Availability of the service",
    body: (
      <p>
        We work to keep MamaCare available and secure, but it may sometimes be unavailable or change. We may add, change or
        remove features at any time.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        To the extent permitted by law, MamaCare is provided &quot;as is&quot;, and we are not liable for any loss or harm
        arising from relying on information in the service instead of seeking care from a qualified health worker.
        Nothing in these terms limits any rights you have that cannot be limited under Rwandan law.
      </p>
    ),
  },
  {
    id: "ending",
    title: "Closing your account",
    body: (
      <p>
        You can stop using MamaCare at any time and ask us to delete your account by emailing{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of the Republic of Rwanda.</p>,
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        If we make important changes, we will update the date at the top of this page and tell account holders. Continuing
        to use MamaCare after a change means you accept the new terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or +250 788 775 937.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="11 October 2026"
      intro={<p>Please read these terms carefully. They explain what MamaCare is, what it is not, and how you may use it.</p>}
      sections={sections}
    />
  );
}
