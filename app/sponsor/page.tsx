import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/lib/seo";
import { SponsorCheckout } from "./checkout";

export const metadata: Metadata = {
  title: "Sponsor",
  description: "Get lifetime brand exposure for $49.99. Showcase your product on florii and get a dedicated shoutout on X. Secure payment by UPI or card, international cards accepted.",
  alternates: { canonical: "/sponsor" },
  openGraph: { title: "Sponsor · florii", description: "Put your product in front of everyone who plants a flower with florii.", images: [{ url: "/og/sponsor.png", width: 1200, height: 630, alt: "Sunflowers and the words grow with the garden" }] },
  twitter: { card: "summary_large_image", title: "Sponsor · florii", description: "Put your product in front of everyone who plants a flower with florii.", images: ["/og/sponsor.png"] },
};

/** A dedicated checkout: order on the left, payment on the right. No site header, nothing to distract. */
export default function SponsorPage() {
  return <main className="co-page">
    <JsonLd data={breadcrumbs("Sponsor", "/sponsor")} />
    <SponsorCheckout />
  </main>;
}
