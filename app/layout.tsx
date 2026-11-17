import type { Metadata, Viewport } from "next";
import { VisitorTracker } from "./components/visitor-tracker";
import "./globals.css";
import "@/packages/florii/src/styles.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://floriii.vercel.app";

export const viewport: Viewport = {
  themeColor: "#cfeeff",
  width: "device-width",
  initialScale: 1,
};

const description = "florii is a free, open-source library of hand-painted flower stickers for React. 36 animated SVG botanicals and seven decorations you can recolor, resize, copy, and download.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "florii · hand-painted flowers for React", template: "%s · florii" },
  description,
  applicationName: "florii",
  keywords: ["react flowers", "svg flowers", "react svg components", "flower stickers", "botanical illustrations", "animated svg", "react ui decorations", "open source illustrations", "nextjs components", "hand-drawn icons"],
  authors: [{ name: "florii contributors" }],
  creator: "florii",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "florii", title: "florii · hand-painted flowers for React", description, url: "/", locale: "en_US", images: [{ url: "/og.png", width: 1200, height: 630, alt: "florii — make the web bloom. Hand-painted flower components for React." }] },
  twitter: { card: "summary_large_image", title: "florii · hand-painted flowers for React", description, images: ["/og.png"] },
  icons: { icon: "/icon.svg" },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
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
      <body><VisitorTracker />{children}</body>
    </html>
  );
}
