import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#F2F0F8",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.folioverze.com"),
  alternates: { canonical: "https://www.folioverze.com" },
  title: "Folioverze | Software & Tech Agency",
  description:
    "Folioverze is a freelance software & tech agency building premium websites, automations, AI integrations, and internal tools — from Assam, India.",
  keywords: [
    "software agency",
    "web development",
    "automation",
    "AI integration",
    "internal tools",
    "Assam",
    "India",
    "Folioverze",
  ],
  openGraph: {
    type: "website",
    url: "https://www.folioverze.com",
    siteName: "Folioverze",
    title: "Folioverze | Software & Tech Agency",
    description:
      "Premium websites, automations, AI integrations, and internal tools — built by a freelance software & tech agency from Assam, India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Folioverze | Software & Tech Agency",
    description:
      "Premium websites, automations, AI integrations, and internal tools — from Assam, India.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ overflow: 'hidden' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syne:wght@500;700;800&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.scrollTo(0, 0);
            `,
          }}
        />
      </head>
      <body style={{ overflow: 'hidden' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Folioverze",
              url: "https://www.folioverze.com",
              logo: "https://www.folioverze.com/icon-512.png",
              image: "https://www.folioverze.com/opengraph-image.png",
              description:
                "Freelance software & tech agency building premium websites, automations, AI integrations, and internal tools.",
              email: "hello@folioverze.com",
              foundingDate: "2026",
              address: {
                "@type": "PostalAddress",
                addressRegion: "Assam",
                addressCountry: "IN",
              },
              areaServed: "Worldwide",
              knowsAbout: [
                "Web Development",
                "Automation",
                "AI Integration",
                "Internal Tools",
                "Next.js",
                "React",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
