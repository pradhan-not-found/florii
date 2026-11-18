import type { Metadata } from "next";
import { JsonLd, breadcrumbs } from "@/lib/seo";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";

export const metadata: Metadata = {
  title: "Contact", description: "How to reach the people behind florii.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact · florii", description: "How to reach the people behind florii.", images: [{ url: "/og/about.png", width: 1200, height: 630, alt: "florii" }] },
};

export default function Page() {
  return <>
    <JsonLd data={breadcrumbs("Contact", "/contact")} />
    <SiteHeader />
    <main className="container prose">
      <h1>Contact</h1>
      <p className="prose-lead">How to reach the people behind florii.</p>
      <h2>Sponsorships, refunds and privacy</h2>
      <p>{process.env.NEXT_PUBLIC_CONTACT_EMAIL
        ? <>Email <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</a>. Include your payment ID if it&apos;s about a payment. We reply within 3 working days.</>
        : <>Open an issue on <a href="https://github.com/pradhan-not-found/florii/issues" target="_blank" rel="noreferrer">GitHub</a>. For anything private, such as a payment, say so and we&apos;ll reply by email.</>}</p>
      <h2>Bugs and ideas</h2>
      <p>Open an issue or a pull request on <a href="https://github.com/pradhan-not-found/florii" target="_blank" rel="noreferrer">GitHub</a>.</p>
    </main>
    <GardenFooter />
  </>;
}
