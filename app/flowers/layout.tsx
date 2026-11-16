import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flowers",
  description:
    "Browse all 28+ hand-painted florii flowers and decorations. Customize sizes and colors, switch between painted and flat styles, copy React code, or download SVGs.",
  alternates: {
    canonical: "/flowers/",
  },
  openGraph: {
    title: "Flowers · florii",
    description: "Browse all 28+ hand-painted flowers, customize, and copy React components or download SVGs.",
    url: "/flowers/",
  },
};

export default function FlowersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
