import type { Metadata, Viewport } from "next";
import { VisitorTracker } from "./components/visitor-tracker";
import { botanicalCatalog } from "@/packages/florii/src";
import { JsonLd } from "@/lib/seo";
import "./globals.css";
import "@/packages/florii/src/styles.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://floriii.vercel.app";

export const viewport: Viewport = {
  themeColor: "#cfeeff",
  width: "device-width",
  initialScale: 1,
};

const flowerCount = botanicalCatalog.filter(item => item.category === "flower").length;
const description = `florii is a free, open-source library of hand-painted flower illustrations for React. ${flowerCount} animated SVG flowers plus leaves and decorations you can recolor, resize, animate, copy, and download as SVG.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "florii · hand-painted flowers for React", template: "%s · florii" },
  description,
  applicationName: "florii",
  keywords: ["react flowers", "svg flowers", "flower illustrations", "react svg components", "botanical illustrations", "animated svg", "hand-drawn illustrations", "free svg flowers", "react ui decorations", "open source illustrations", "nextjs components", "flower stickers"],
  authors: [{ name: "florii contributors", url: "https://github.com/pradhan-not-found/florii" }],
  creator: "florii",
  publisher: "florii",
  alternates: { canonical: "/", types: { "text/plain": [{ url: "/llms.txt", title: "florii for AI assistants" }] } },
  openGraph: { type: "website", siteName: "florii", title: "florii · hand-painted flowers for React", description, url: "/", locale: "en_US", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "florii: make the web bloom. Hand-painted flower components for React." }] },
  twitter: { card: "summary_large_image", title: "florii · hand-painted flowers for React", description, images: ["/og/home.png"] },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "technology",
};

// Who makes florii, where the code lives and what it is: one connected graph for search and AI engines.
const sameAs = ["https://github.com/pradhan-not-found/florii", "https://www.npmjs.com/package/florii"];
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${siteUrl}/#org`, name: "florii", url: siteUrl, logo: `${siteUrl}/logo.png`, sameAs },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "florii", description, publisher: { "@id": `${siteUrl}/#org` }, inLanguage: "en" },
    {
      "@type": "SoftwareSourceCode", "@id": `${siteUrl}/#code`, name: "florii", description,
      codeRepository: sameAs[0], programmingLanguage: ["TypeScript", "React"], runtimePlatform: "React 18, React 19",
      license: "https://opensource.org/licenses/MIT", author: { "@id": `${siteUrl}/#org` },
      targetProduct: { "@id": `${siteUrl}/#software` },
    },
    {
      "@type": "SoftwareApplication", "@id": `${siteUrl}/#software`, name: "florii", url: siteUrl, description,
      applicationCategory: "DeveloperApplication", applicationSubCategory: "UI component library", operatingSystem: "Any",
      downloadUrl: sameAs[1], installUrl: sameAs[1], softwareVersion: "0.1.1", isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      license: "https://opensource.org/licenses/MIT", publisher: { "@id": `${siteUrl}/#org` }, sameAs,
      screenshot: `${siteUrl}/og/flowers.png`,
      featureList: ["Hand-painted SVG flower components", "Recolor with color and secondaryColor", "CSS animations: bloom, sway, float, rotate, pulse, fall", "Respects reduced motion", "Download any flower as SVG", "Server and client rendering"],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={jsonLd} />
        {/* Safari (and every iOS browser) paints SVG filters on the CPU; mark it so the grain filter can be skipped there */}
        <script dangerouslySetInnerHTML={{ __html: `if(/AppleWebKit/.test(navigator.userAgent)&&!/Chrome|Chromium|Edg|OPR/.test(navigator.userAgent))document.documentElement.classList.add("webkit")` }} />
      </head>
      <body><VisitorTracker />{children}</body>
    </html>
  );
}
