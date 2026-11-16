import type { Metadata } from "next";
import "./globals.css";
import "@/packages/florii/src/styles.css";

export const metadata: Metadata = {
  title: "florii — hand-drawn flowers for React",
  description: "An open-source library of hand-drawn botanical SVG components for React. Twenty-eight hand-painted botanicals and five decorations, typed, animated, and ready to copy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
