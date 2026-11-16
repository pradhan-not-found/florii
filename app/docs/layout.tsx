import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs · florii",
  description: "Install florii, import the styles, and plant your first flower. Includes the full props reference.",
};

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
