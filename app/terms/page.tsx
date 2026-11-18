import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/lib/seo";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";

export const metadata: Metadata = {
  title: "Terms of Service · florii", description: "The terms for using the florii website, the open-source package, and buying a sponsor spot.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Service · florii", description: "The terms for using the florii website, the open-source package, and buying a sponsor spot.", images: [{ url: "/og/privacy.png", width: 1200, height: 630, alt: "florii" }] },
};

export default function Page() {
  return <>
    <JsonLd data={breadcrumbs("Terms of Service", "/terms")} />
    <SiteHeader />
    <main className="container prose">
      <h1>Terms of Service</h1>
      <p className="prose-lead">The terms for using the florii website, the open-source package, and buying a sponsor spot.</p>
      <h2>The package and artwork</h2>
      <p>The florii code and artwork are free and open source under the MIT license. You can use them in personal and commercial work. They are provided as is, without warranty.</p>
      <h2>Using the website</h2>
      <p>You can browse, copy code, download flowers and send gift links for free. Don&apos;t use the site to send abuse, spam or anything unlawful, and don&apos;t try to disrupt it.</p>
      <h2>Sponsor spots</h2>
      <ul>
        <li><strong>What you get.</strong> Your product&apos;s name, link and short description in the sponsor section of the florii website, for as long as the site runs, and a shoutout on X.</li>
        <li><strong>Price.</strong> $49.99 by card, or ₹4,199 by UPI in India, paid once. Prices include any taxes we are required to charge.</li>
        <li><strong>Review.</strong> We review each listing before it goes live, usually within 3 working days. We may decline listings that are unlawful, misleading, adult, hateful or harmful; if we do, you get a full refund.</li>
        <li><strong>Changes.</strong> You can ask us to update your link or description at any time.</li>
      </ul>
      <h2>Payments</h2>
      <p>Payments are processed securely by our payment processor. We never see or store your card details. See our <a href="/refunds">refund policy</a> for refunds.</p>
      <h2>Liability</h2>
      <p>We work hard to keep the site running, but we can&apos;t promise it will always be available. To the extent the law allows, our total liability to you is limited to the amount you paid us.</p>
      <h2>Contact</h2>
      <p>Questions about these terms? See <a href="/contact">contact</a>.</p>
      <p className="prose-meta">Last updated: 18 November 2026.</p>
    </main>
    <GardenFooter />
  </>;
}
