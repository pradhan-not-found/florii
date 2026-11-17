import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Quickstart guide, installation options (npm, pnpm, yarn, bun), and complete props reference for florii React botanical components.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Documentation · florii",
    description: "Install florii, import the styles, and plant your first flower. Includes the full props reference.",
    url: "/docs",
  },
};

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
