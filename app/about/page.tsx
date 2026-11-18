import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/lib/seo";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";

export const metadata: Metadata = {
  title: "About the Design · florii", description: "How florii is drawn, colored, and built.",
  openGraph: { title: "About the design · florii", description: "How florii is painted, colored and built.", images: [{ url: "/og/about.png", width: 1200, height: 630, alt: "Hand-painted roses and peonies" }] },
  twitter: { card: "summary_large_image", title: "About the design · florii", description: "How florii is painted, colored and built.", images: ["/og/about.png"] },
};

export default function Page() {
  return <>
    <JsonLd data={breadcrumbs("About", "/about")} />
    <SiteHeader />
    <main className="container prose">
      <h1>About the Design</h1>
      <p className="prose-lead">florii aims for flowers that feel painted by hand, on a site that stays out of their way.</p>
      <h2>The flowers</h2>
      <p>Every botanical is original artwork, built from simple SVG shapes on a 240 by 240 grid. The default painted style gives each shape a slightly uneven edge and a light paint grain using SVG filters, so nothing is a bitmap and everything scales cleanly. The flat style removes the filter for clean pastel shapes.</p>
      <h2>Color</h2>
      <p>Each flower ships with its own palette, and every one accepts a custom color. The site itself is white with navy and blue text so the flowers carry the color.</p>
      <h2>Type</h2>
      <p>The site is set in Instrument Sans, an open-source typeface released under the SIL Open Font License.</p>
      <h2>Motion</h2>
      <p>Animations are plain CSS. The grass on this site is drawn on a canvas and leans away from your pointer. All motion is switched off for visitors who ask their device to reduce motion.</p>
      <h2>Credits</h2>
      <p>Framework marks on the home page come from Simple Icons and belong to their owners. They appear only to show compatibility.</p>
      <h2 id="license">License</h2>
      <p>florii's code and artwork are released under the MIT License. You can use them in personal and commercial projects.</p>
    </main>
    <GardenFooter />
  </>;
}
