import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flowers · florii",
  description: "Browse every florii flower and decoration, switch between line and filled styles, and copy the React code.",
};

export default function FlowersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
