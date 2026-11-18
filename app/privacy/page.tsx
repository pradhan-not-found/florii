import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/lib/seo";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";

export const metadata: Metadata = {
  title: "Privacy policy", description: "What the florii website does and does not collect: no accounts, no tracking cookies, and payments handled by a secure payment processor.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy · florii", description: "What the florii website does and does not collect.", images: [{ url: "/og/privacy.png", width: 1200, height: 630, alt: "A forget-me-not and a daisy" }] },
  twitter: { card: "summary_large_image", title: "Privacy · florii", description: "What the florii website does and does not collect.", images: ["/og/privacy.png"] },
};

export default function Page() {
  return <>
    <JsonLd data={breadcrumbs("Privacy", "/privacy")} />
    <SiteHeader />
    <main className="container prose">
      <h1>Privacy Policy</h1>
      <p className="prose-lead">florii is a website and an open-source package. We keep data collection to the minimum needed to run it.</p>
      <h2>What we collect</h2>
      <p>The site has no accounts, no advertising, and no tracking cookies. Fonts and artwork are served from this site, not from third-party font or image services.</p>
      <h2>Requests to other services</h2>
      <ul>
        <li><strong>GitHub.</strong> Our server reads the public star count from GitHub about once a minute. Your browser asks our server, not GitHub.</li>
        <li><strong>Visitor counter.</strong> Your browser sends a random browser identifier and a random page-view identifier to our server. We use Upstash Redis to store approximate visitor totals and page-view counts. We do not send names, emails, IP addresses, page URLs, or referrers to Redis for analytics. Daily counts expire after 90 days; aggregate totals are retained. Duplicate page-view identifiers expire after five minutes. We respect Do Not Track and Global Privacy Control signals.</li>
        <li><strong>Sponsorship payments.</strong> When you sponsor florii, we keep what you entered (product name, link, description and email), the amount, and the payment status, so we can feature you and contact you. Card and UPI payments are handled by our payment processor, Razorpay. Card details are entered in the processor&apos;s secure form; florii never sees or stores them. For UPI we pass your mobile number to the processor for the payment receipt.</li>
        <li><strong>Gift links.</strong> A bouquet or letter you send is packed into the link itself. We do not store it on our servers.</li>
      </ul>
      <h2>Storage in your browser</h2>
      <p>The site keeps the GitHub star count and your sponsor details (while you check out) in session storage, which clears when you close the tab. For visitor counting, it keeps a random identifier in local storage until you clear your browser data. It is used only on this site. If browser storage is unavailable or a privacy signal is enabled, we skip visitor tracking.</p>
      <h2>The npm package</h2>
      <p>The florii package runs entirely inside your app. It makes no network requests and collects nothing.</p>
      <h2>Questions and requests</h2>
      <p>To ask what we hold about you, or to have your sponsor details deleted, see <a href="/contact">contact</a>. We reply within a few days.</p>
      <p className="prose-meta">Last updated: 18 November 2026. See also our <a href="/terms">terms</a> and <a href="/refunds">refund policy</a>.</p>
    </main>
    <GardenFooter />
  </>;
}
