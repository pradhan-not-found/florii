import type { Metadata } from "next";
import { JsonLd, breadcrumbs, flowerList } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hand-painted flower SVGs: browse every flower",
  description: "Browse every hand-painted florii flower, leaf and decoration. Recolor and resize them, preview animations, then copy the React code or download the SVG. Free and open source.",
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
