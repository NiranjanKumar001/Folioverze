import type { Metadata } from "next";
import Link from "next/link";
import ScrollUnlock from "./ScrollUnlock";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy | Folioverze",
  description: "Read the Privacy Policy of Folioverze. Learn about how we handle user data with transparency and privacy.",
  alternates: { canonical: "https://www.folioverze.com/privacy" },
  openGraph: {
    type: "website",
    url: "https://www.folioverze.com/privacy",
    siteName: "Folioverze",
    title: "Privacy Policy | Folioverze",
    description: "Read the Privacy Policy of Folioverze. Learn about how we handle user data with transparency and privacy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Folioverze",
    description: "Read the Privacy Policy of Folioverze. Learn about how we handle user data with transparency and privacy.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <ScrollUnlock />
      <main className="legal">
        <Link href="/" className="legal-back">← Folioverze</Link>

        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: July 2026</p>

        <p>
          This Privacy Policy explains how Folioverze (&quot;we&quot;, &quot;us&quot;) handles information when you visit
          folioverze.com or contact us. We keep this simple: we collect only what we need to reply to you and run
          the site.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li><strong>Contact details you send us</strong> — your name, email address, and the message you provide when you email us or use a contact form.</li>
          <li><strong>Basic technical data</strong> — standard server/CDN logs (such as IP address and browser type) that are generated automatically when any website is visited.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To respond to your enquiry and discuss a potential project.</li>
          <li>To operate, secure, and improve the website.</li>
        </ul>
        <p>We do not sell your personal data, and we do not use it for advertising.</p>

        <h2>Sharing</h2>
        <p>
          We only share data with service providers that help us run the site or communicate with you (for example,
          our hosting provider and email provider), and only to the extent needed to provide those services. We may
          disclose information if required by law.
        </p>

        <h2>Cookies &amp; analytics</h2>
        <p>
          The site does not use advertising cookies. If we add privacy-friendly analytics in the future, we will
          update this policy to describe it.
        </p>

        <h2>Data retention</h2>
        <p>
          We keep enquiry emails for as long as needed to work together and to meet legal or accounting requirements,
          then delete them.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask us to access, correct, or delete the personal information you&apos;ve shared with us. Email us
          and we&apos;ll take care of it.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href="mailto:hello@folioverze.com">hello@folioverze.com</a>. Folioverze is based in Assam, India.
        </p>
      </main>
    </div>
  );
}
