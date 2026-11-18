import type { Metadata } from "next";
import { JsonLd, breadcrumbs, installHowTo } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Docs: install florii and add flowers to React",
  description: "Install florii with npm, pnpm, yarn or bun, import the styles, and add hand-painted flower components to any React or Next.js app. Plus plain SVG links for any other site.",
  alternates: {
    canonical: "/docs",
  },
  twitter: { card: "summary_large_image", images: ["/og/docs.png"] },
  openGraph: {
    images: [{ url: "/og/docs.png", width: 1200, height: 630, alt: "A daisy, tulip and lily beside the words plant your first flower" }],
    title: "Documentation · florii",
    description: "Install florii, import the styles, and plant your first flower. Includes the full props reference.",
    url: "/docs",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <JsonLd data={breadcrumbs("Docs", "/docs")} />
    <JsonLd data={installHowTo()} />
    {children}
  </>;
}
