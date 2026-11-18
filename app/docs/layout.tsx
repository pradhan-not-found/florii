import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Quickstart guide, installation options (npm, pnpm, yarn, bun), and complete props reference for florii React botanical components.",
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

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
