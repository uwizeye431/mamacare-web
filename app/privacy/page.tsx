import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "../../components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MamaCare collects, uses, stores and protects your personal and health information.",
};

const CONTACT_EMAIL = "uwizeyekevin43@gmail.com";

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <p>
        MamaCare (&quot;we&quot;, &quot;us&quot;) is a maternal and newborn health service for mothers in Rwanda. We are the
        controller of the personal data described in this policy. You can reach us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or +250 788 775 937.
      </p>
    ),
  },
  {
    id: "what-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>
          <strong>Account information:</strong> your name, email address, optional phone number and profile photo, and your
          password, which we store only in a scrambled (hashed) form that we cannot read.
        </p>
        <p>
          <strong>Health information you choose to give us:</strong> your pregnancy details (such as the date of your last
          period, due date, number of previous pregnancies and births, health conditions and health facility), your
          antenatal visits, and the symptoms you describe in the symptom checker together with the risk level we
          returned.
        </p>
        <p>
          <strong>Messages:</strong> what you write in the contact form.
        </p>
        <p>
          <strong>Information we do not store on our servers:</strong>
        </p>
        <ul>
          <li>Symptom checks you do while not logged in. We analyse them and show the result, but do not save them.</li>
          <li>
            Your feeding log and birth preparedness checklist. These stay in your browser on your own device and are
            never sent to us.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    body: (
      <ul>
        <li>To create and secure your account, including sending verification and password reset codes by email.</li>
        <li>To calculate your due date and antenatal visit schedule and show your pregnancy journey.</li>
        <li>To assess symptoms you describe and keep a history you can review and share with your health worker.</li>
        <li>To answer messages you send us.</li>
        <li>To keep the service secure, prevent abuse and fix problems.</li>
      </ul>
    ),
  },
  {
    id: "legal-basis",
    title: "Why we are allowed to use it",
    body: (
      <p>
        Health information is sensitive personal data under Rwanda&apos;s Law No. 058/2021 on the protection of personal
        data and privacy. We process it on the basis of the <strong>explicit consent</strong> you give when you create an
        account. You can withdraw your consent at any time by asking us to delete your account (see &quot;Your
        rights&quot;). We use account and security information because it is necessary to provide the service you asked
        for.
      </p>
    ),
  },
  {
    id: "symptom-checker",
    title: "The symptom checker",
    body: (
      <p>
        The symptom checker runs on our own servers. It uses fixed safety rules based on WHO danger signs and a
        classification model that we trained ourselves. Your descriptions are not sent to any outside artificial
        intelligence company. The result is guidance only and is not a diagnosis.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>
          <strong>We do not sell your data and do not use it for advertising.</strong> We share it only with service
          providers that help us run MamaCare, and only as much as they need:
        </p>
        <ul>
          <li>Our hosting and database providers, which store the service and its data.</li>
          <li>Our email delivery provider, which sends verification and password reset emails to you.</li>
          <li>
            An error monitoring provider, which receives technical reports when something breaks. These reports do not
            include what you type, your health information, your cookies or your account details.
          </li>
        </ul>
        <p>
          We may also disclose information if the law requires it, or to protect someone&apos;s life in an emergency.
        </p>
      </>
    ),
  },
  {
    id: "storage",
    title: "Where your data is stored",
    body: (
      <p>
        Some of our service providers store data on servers outside Rwanda. Where that happens, we do so only as
        permitted by Rwandan data protection law, and we require our providers to protect it with appropriate security
        measures.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <ul>
        <li>Account and health information: for as long as your account is open.</li>
        <li>When you ask us to delete your account, we delete your account and health records.</li>
        <li>Verification and password reset codes: deleted once used, and they expire after 60 seconds.</li>
        <li>Contact form messages: for as long as needed to answer you.</li>
      </ul>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <ul>
        <li>Passwords and reset codes are stored only as hashes.</li>
        <li>Your login session uses secure, HTTP-only cookies that page scripts cannot read.</li>
        <li>Data is sent over encrypted (HTTPS) connections.</li>
        <li>Access to the database is limited to the people who run the service.</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <p>
        We use only the cookies needed to keep you logged in. We do not use advertising or tracking cookies. We also use
        your browser&apos;s local storage to remember that you are logged in, your theme choice, and the feeding log and
        birth plan tools.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under Rwandan law you have the right to:</p>
        <ul>
          <li>Get a copy of the personal data we hold about you.</li>
          <li>Have incorrect data corrected. You can edit most of it yourself in your profile.</li>
          <li>Have your data deleted and withdraw your consent.</li>
          <li>Object to or restrict how we use your data.</li>
          <li>Receive your data in a format you can take elsewhere.</li>
        </ul>
        <p>
          To use any of these rights, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address on your
          account. We will reply within 30 days. If you are not satisfied with our answer, you can complain to the
          National Cyber Security Authority (NCSA), which supervises data protection in Rwanda.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Young mothers",
    body: (
      <p>
        If you are under 18, please use MamaCare together with a parent, guardian or health worker, and ask them to help
        you understand this policy.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        If we make important changes, we will update the date at the top of this page and tell account holders by email
        or in the app. See also our <Link href="/terms">Terms of Service</Link>.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="11 October 2026"
      intro={
        <p>
          Your health information is personal. This policy explains, in plain language, what information MamaCare
          collects, why, who can see it, and the choices and rights you have.
        </p>
      }
      sections={sections}
    />
  );
}
