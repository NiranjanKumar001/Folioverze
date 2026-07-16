import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Folioverze",
    short_name: "Folioverze",
    description:
      "Freelance software & tech agency — premium websites, automations, AI integrations, and internal tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F0F8",
    theme_color: "#D7263D",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
