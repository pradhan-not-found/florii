import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/packages/florii/src/styles.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://florii.dev";

export const viewport: Viewport = {
  themeColor: "#cfeeff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "florii — hand-painted botanical UI components for React",
    template: "%s · florii",
  },
  description:
    "An open-source library of 28+ hand-drawn botanical SVG components and animated flourishes for React. Fully typed, zero extra dependencies, recolorable, with smooth CSS animations built in.",
  keywords: [
    "react",
    "botanical",
    "svg flowers",
    "react icons",
    "hand-drawn",
    "animated flowers",
    "ui components",
    "florii",
    "open source",
    "react components",
    "nature",
    "react animations",
  ],
  authors: [{ name: "florii", url: siteUrl }],
  creator: "florii",
  publisher: "florii",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "florii",
    title: "florii — hand-painted flowers for React",
    description:
      "Drop a daisy into a hero, a tulip into an empty state, or a sunflower into a loading screen. Sway, bloom, and wear your colors.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "florii — hand-painted botanical components for React",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "florii — hand-painted flowers for React",
    description:
      "Drop a daisy into a hero, a tulip into an empty state, or a sunflower into a loading screen. Sway, bloom, and wear your colors.",
    creator: "@floriijs",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "florii",
      description: "Hand-painted botanical SVG components for React",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "florii",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      license: "https://opensource.org/licenses/MIT",
      description:
        "An open-source library of hand-drawn botanical SVG components for React with built-in animations.",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
