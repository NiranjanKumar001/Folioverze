import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.folioverze.com"),
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
        {children}
      </body>
    </html>
  );
}
