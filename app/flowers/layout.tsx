import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flowers",
  description:
    "Browse all 36+ hand-painted florii flowers and decorations. Customize sizes and colors, switch between painted and flat styles, copy React code, or download SVGs.",
  alternates: {
    canonical: "/flowers",
  },
  openGraph: {
    title: "Flowers · florii",
    description: "Browse 36 hand-painted flower stickers and seven decorations for React. Preview, recolor, copy the code, or download the SVG.",
    url: "/flowers",
  },
};

export default function FlowersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
