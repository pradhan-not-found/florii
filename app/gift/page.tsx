import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";
import { GiftMaker } from "./gift-maker";

export const metadata: Metadata = {
  title: "Send a bouquet",
  description: "Make a hand-painted bouquet, write a little letter, and send it as a link or download it as a card. Free, with florii.",
  alternates: { canonical: "/gift" },
};

export default function GiftPage() {
  return <>
    <SiteHeader />
    <main className="gift-page">
      <section className="gift-hero">
        <span className="gift-eyebrow">a gift from the garden</span>
        <h1>send a bouquet.</h1>
        <p>pick the flowers, wrap them up and write a little letter. then send it as a link or save it as a card.</p>
      </section>
      <GiftMaker />
    </main>
    <GardenFooter />
  </>;
}
