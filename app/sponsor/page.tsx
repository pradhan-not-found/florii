import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";
import { SponsorCheckout } from "./checkout";

export const metadata: Metadata = {
  title: "Sponsor",
  description: "Get lifetime brand exposure for $49.99. Showcase your product on florii and get a dedicated shoutout on X. Secure payment by Razorpay, international cards accepted.",
  alternates: { canonical: "/sponsor" },
  openGraph: { title: "Sponsor · florii", description: "Put your product in front of everyone who plants a flower with florii.", images: [{ url: "/og/sponsor.png", width: 1200, height: 630, alt: "Sunflowers and the words grow with the garden" }] },
  twitter: { card: "summary_large_image", title: "Sponsor · florii", description: "Put your product in front of everyone who plants a flower with florii.", images: ["/og/sponsor.png"] },
};

export default function SponsorPage() {
  return <>
    <SiteHeader />
    <main className="pay-page">
      <section className="pay-hero">
        <svg className="pay-logo" viewBox="0 0 70 30" width="140" height="60" fill="none" stroke="currentColor" strokeWidth="3.7" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="florii">
          <path d="M10 26V10C10 5.5 12.8 3 17 4.2" /><path d="M5.5 14H15" /><path d="M22 4V22C22 25 23.8 26.2 26.2 25.2" />
          <path d="M33 14C29.2 14 27 16.8 27 20.2C27 23.8 29.6 26 33 26C36.8 26 39 23.2 39 19.8C39 16.2 36.4 14 33 14Z" />
          <path d="M45 14.5V26" /><path d="M45 19.5C46.2 15.6 49 14 52.4 15" /><path d="M57.5 15V26" /><path d="M64.5 15V26" />
          <circle cx="57.5" cy="8.2" r="0.6" /><circle cx="64.5" cy="8.2" r="0.6" />
        </svg>
        <h1>checkout</h1>
        <p>get lifetime brand exposure for just $49.99. showcase your product on florii and get a dedicated shoutout on X.</p>
      </section>
      <SponsorCheckout />
    </main>
    <GardenFooter />
  </>;
}
