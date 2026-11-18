import type { Metadata } from "next";
import { JsonLd, breadcrumbs, flowerList } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Flowers",
  description:
    "Browse all 36+ hand-painted florii flowers and decorations. Customize sizes and colors, switch between painted and flat styles, copy React code, or download SVGs.",
  alternates: {
    canonical: "/flowers",
  },
  twitter: { card: "summary_large_image", images: ["/og/flowers.png"] },
  openGraph: {
    images: [{ url: "/og/flowers.png", width: 1200, height: 630, alt: "A spread of hand-painted flowers" }],
    title: "Flowers · florii",
    description: "Browse 36 hand-painted flower stickers and seven decorations for React. Preview, recolor, copy the code, or download the SVG.",
    url: "/flowers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <JsonLd data={breadcrumbs("Flowers", "/flowers")} />
    <JsonLd data={flowerList()} />
    {children}
  </>;
}
