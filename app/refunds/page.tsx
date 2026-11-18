import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/lib/seo";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";

export const metadata: Metadata = {
  title: "Refund policy", description: "When and how you can get your money back for a florii sponsor spot.",
  alternates: { canonical: "/refunds" },
  openGraph: { title: "Refund Policy · florii", description: "When and how you can get your money back for a florii sponsor spot.", images: [{ url: "/og/sponsor.png", width: 1200, height: 630, alt: "florii" }] },
};

export default function Page() {
  return <>
    <JsonLd data={breadcrumbs("Refund Policy", "/refunds")} />
    <SiteHeader />
    <main className="container prose">
      <h1>Refund Policy</h1>
      <p className="prose-lead">When and how you can get your money back for a florii sponsor spot.</p>
      <h2>Full refund</h2>
      <ul>
        <li>Within <strong>7 days</strong> of paying, if your listing has not gone live yet. Just ask.</li>
        <li>Any time we decline your listing in review.</li>
        <li>If you were charged twice or charged by mistake.</li>
      </ul>
      <h2>After your listing is live</h2>
      <p>Once your sponsor spot is published, the payment is non-refundable, because the service has been delivered. We are still happy to update your link or description.</p>
      <h2>How to ask</h2>
      <p>Write to us through <a href="/contact">contact</a> with the email you used and your payment ID (shown after payment and in your receipt).</p>
      <h2>How long it takes</h2>
      <p>We confirm within 3 working days. Refunds go back to the card or UPI account you paid from; banks usually take 5 to 7 working days to show them.</p>
      <p className="prose-meta">Last updated: 18 November 2026.</p>
    </main>
    <GardenFooter />
  </>;
}
