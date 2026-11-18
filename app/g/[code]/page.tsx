import type { Metadata } from "next";
import { SiteHeader } from "../../components/site-header";
import { GardenFooter } from "../../components/garden-footer";
import { GiftMaker } from "../../gift/gift-maker";
import { describe, unpack } from "../../gift/codec";

type Props = { params: Promise<{ code: string }> };

/** A shared gift. The whole gift lives in the short code, so nothing is looked up or stored. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const gift = await unpack(decodeURIComponent((await params).code));
  const line = gift ? describe(gift) : "a little something";
  const title = line.charAt(0).toUpperCase() + line.slice(1);
  const description = "Someone sent you hand-painted flowers. Open the envelope to see them.";
  return {
    title, description,
    robots: { index: false, follow: false },
    openGraph: { title, description, images: [{ url: "/og/gift.png", width: 1200, height: 630, alt: "A hand-painted bouquet in an envelope" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og/gift.png"] },
  };
}

export default async function SharedGift({ params }: Props) {
  const code = decodeURIComponent((await params).code);
  return <>
    <SiteHeader />
    <main className="gift-page">
      <section className="gift-hero">
        <span className="gift-eyebrow">a gift from the garden</span>
        <h1>something for you.</h1>
        <p>someone picked these flowers for you.</p>
      </section>
      <GiftMaker code={code} />
    </main>
    <GardenFooter />
  </>;
}
