import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/lib/seo";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";
import { GiftMaker } from "./gift-maker";

const giftDescription = "Send a bouquet online for free. Pick hand-painted flowers, wrap them up, write a letter with a postage stamp, and send it as a link that opens like a real envelope. No sign-up.";

export const metadata: Metadata = {
  title: { absolute: "Send a bouquet online, free · digital flowers and a letter · florii" },
  description: giftDescription,
  keywords: ["send a bouquet online", "send flowers online free", "digital bouquet", "virtual flowers", "online flower card", "send a bouquet link", "e-card with flowers", "flower letter", "free bouquet maker", "send flowers to someone online"],
  alternates: { canonical: "/gift" },
  openGraph: { title: "Send a bouquet online · florii", description: giftDescription, url: "/gift", images: [{ url: "/og/gift.png", width: 1200, height: 630, alt: "A hand-painted bouquet wrapped in burlap" }] },
  twitter: { card: "summary_large_image", title: "Send a bouquet online · florii", description: giftDescription, images: ["/og/gift.png"] },
};

const giftJsonLd = {
  "@context": "https://schema.org", "@type": "WebApplication", name: "florii bouquet maker", url: "https://floriii.vercel.app/gift",
  description: giftDescription, applicationCategory: "LifestyleApplication", operatingSystem: "Any", isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: ["Pick up to 15 hand-painted flowers", "Choose a wrapping paper", "Write a letter with a postage stamp", "Share as a short link", "Download as a card"],
};

export default function GiftPage() {
  return <>
    <JsonLd data={breadcrumbs("Send a bouquet", "/gift")} />
    <JsonLd data={giftJsonLd} />
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
