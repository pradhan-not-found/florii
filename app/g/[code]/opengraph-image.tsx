import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { renderToStaticMarkup } from "react-dom/server.edge";
import { Bouquet } from "../../gift/bouquet";
import { resolveGift } from "@/lib/gifts";

// The link preview for a shared gift: the sender's own bouquet, who it's for and who it's from.
export const alt = "A hand-painted bouquet sent with florii";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (weight: number) => readFile(join(process.cwd(), `assets/og/InstrumentSans-${weight}.ttf`));
const svgUri = (markup: string) => `data:image/svg+xml;base64,${Buffer.from(markup).toString("base64")}`;
const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 30" width="105" height="45" fill="none" stroke="#131316" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 26V10C10 5.5 12.8 3 17 4.2"/><path d="M5.5 14H15"/><path d="M22 4V22C22 25 23.8 26.2 26.2 25.2"/><path d="M33 14C29.2 14 27 16.8 27 20.2C27 23.8 29.6 26 33 26C36.8 26 39 23.2 39 19.8C39 16.2 36.4 14 33 14Z"/><path d="M45 14.5V26"/><path d="M45 19.5C46.2 15.6 49 14 52.4 15"/><path d="M57.5 15V26"/><path d="M64.5 15V26"/><circle cx="57.5" cy="8.2" r="0.6"/><circle cx="64.5" cy="8.2" r="0.6"/></svg>`;
// a sealed envelope, for gifts that are only a letter
const ENVELOPE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 300" width="440" height="300"><rect x="4" y="4" width="432" height="292" rx="14" fill="#efe4cf"/><path d="M4 18 220 176 436 18v264a14 14 0 0 1-14 14H18a14 14 0 0 1-14-14Z" fill="#ecdfc6"/><path d="M18 4h404a14 14 0 0 1 10 4L220 176 8 8a14 14 0 0 1 10-4Z" fill="#e2cfab"/><circle cx="220" cy="172" r="30" fill="#c2415d"/><circle cx="220" cy="172" r="22" fill="none" stroke="#e57a93" stroke-width="2"/></svg>`;

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const gift = await resolveGift(decodeURIComponent((await params).code));
  const [regular, medium, semibold] = await Promise.all([font(400), font(500), font(600)]);

  const hasBouquet = gift && gift.mode !== "letter" && gift.flowers.length > 0;
  let art = svgUri(ENVELOPE);
  if (hasBouquet) {
    // the bouquet is drawn with the same component as the page, turned into an SVG string
    const markup = renderToStaticMarkup(<Bouquet flowers={gift.flowers} wrap={gift.wrap} className="" idPrefix="og" />);
    art = svgUri(markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="600"'));
  }
  const what = !gift ? "a little something" : gift.mode === "letter" ? "a letter" : gift.mode === "bouquet" ? "a bouquet" : "a bouquet and a letter";
  const to = gift?.to?.trim();
  const from = gift?.from?.trim();

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "linear-gradient(165deg, #cdeeff 0%, #e8f6ff 40%, #fbf7ef 100%)", fontFamily: "Instrument Sans", color: "#131316" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 690, padding: "64px 0 56px 80px" }}>
        <img src={svgUri(LOGO)} width={105} height={45} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignSelf: "flex-start", padding: "8px 18px", borderRadius: 999, background: "#ffffff", fontSize: 21, fontWeight: 500, color: "#55555f" }}>{`${what} from the garden`}</div>
          <div style={{ display: "flex", marginTop: 22, fontSize: to && to.length > 12 ? 72 : 88, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1.02 }}>{to ? `for ${to}` : "for you"}</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 30, fontWeight: 400, color: "#55555f" }}>{`${from || "Someone"} ${gift?.mode === "letter" ? "wrote you a letter." : "picked these flowers for you."}`}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", padding: "16px 28px", borderRadius: 999, background: "#131316", color: "#ffffff", fontSize: 24, fontWeight: 500 }}>open your envelope →</div>
          <div style={{ display: "flex", fontSize: 21, color: "#8a8a93" }}>floriii.vercel.app</div>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
        {hasBouquet
          ? <img src={art} width={441} height={630} alt="" style={{ marginTop: 18 }} />
          : <img src={art} width={420} height={286} alt="" style={{ transform: "rotate(-4deg)" }} />}
      </div>
    </div>,
    { ...size, fonts: [{ name: "Instrument Sans", data: regular, weight: 400 }, { name: "Instrument Sans", data: medium, weight: 500 }, { name: "Instrument Sans", data: semibold, weight: 600 }] },
  );
}
