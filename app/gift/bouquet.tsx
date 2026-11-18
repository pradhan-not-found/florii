/**
 * The bouquet artwork: crayon texture, wrapping paper, ribbon and flowers arranged in a dome.
 * No client-only code, so it renders in the browser and on the server (for link previews).
 */
import { useId } from "react";
import { Botanical } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";

export const wraps = [
  { id: "none", label: "no paper", back: "", front: "", fold: "" },
  { id: "kraft", label: "burlap", back: "#dcc196", front: "#d2b383", fold: "#a8875a" },
  { id: "blush", label: "blush", back: "#f6d5dc", front: "#eebcc8", fold: "#d99aaa" },
  { id: "cream", label: "cream", back: "#f4eedf", front: "#e9dfc8", fold: "#d3c5a6" },
  { id: "sage", label: "sage", back: "#d5e4c8", front: "#bfd4ad", fold: "#9fbb88" },
  { id: "sky", label: "sky", back: "#d6e8f7", front: "#bcd6ee", fold: "#94b8db" },
];

// ---------- crayon texture shared by stalks, leaves and twine ----------
export function Crayon({ id }: { id: string }) {
  return <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" result="warp" />
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="paint" />
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="grain" />
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.25" result="speckle" />
    <feComposite in="paint" in2="speckle" operator="in" />
  </filter>;
}

// ---------- bouquet: flowers on long stalks, wrapped in paper like a florist would ----------
export const BW = 420, BH = 600;
const GATHER: [number, number] = [210, 436];
/**
 * Where each flower sits: a rounded dome, the way a florist packs a bunch. Flowers follow a
 * golden-angle spiral inside an ellipse, so any count spreads evenly with no gaps or pile-ups.
 * The dome grows with the count, and each flower shrinks just enough to fit.
 * Returns [x, y, size, tilt] per flower, the first one in the middle.
 */
function arrange(n: number): [number, number, number, number][] {
  if (n === 0) return [];
  const spread = Math.min(1, 0.5 + 0.06 * n);
  const rx = 138 * spread, ry = 100 * spread, cx = 210, cy = 188;
  const size = Math.min(230, Math.max(104, Math.sqrt((Math.PI * Math.max(rx, 80) * Math.max(ry, 64)) / n) * 2.05));
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : Math.sqrt((i + 0.35) / n);
    const a = i * golden - Math.PI / 2;
    const tilt = ((i * 37) % 17) - 8;
    return [cx + Math.cos(a) * rx * t, cy + Math.sin(a) * ry * t, size * (1 - 0.1 * t), tilt];
  });
}
export const stalkTones = ["#4f9a3f", "#5fa94a", "#468f39", "#6cb456"];
const RIBBON = { fill: "#f6dccb", shade: "#e6bfa6", edge: "#d4a487" };
const BACK = "M20 112Q38 92 60 106Q82 84 108 100Q132 78 158 94Q184 72 210 90Q236 72 262 94Q288 78 312 100Q336 84 358 104Q380 90 400 102C402 232 346 340 240 440L180 440C74 340 18 232 20 112Z";
const LEFT_FLAP = "M66 318C126 352 196 370 266 368L238 440L182 440C128 396 92 360 66 318Z";
const RIGHT_FLAP = "M362 286C330 338 266 376 158 392L182 440L238 440C292 392 336 346 362 286Z";
const TAIL = "M182 436L238 436C244 486 256 536 266 584L262 590L254 584L246 591L238 585L229 592L220 586L211 592L202 586L193 592L184 586L175 591L166 585L158 590L154 584C164 536 176 486 182 436Z";

/** The wrap: a crinkled back sheet with a shaded inside, two front flaps crossing in a V, a pinch, and a long tail below. */
function Wrap({ paper, filter, texture, part, uid }: { paper: (typeof wraps)[number]; filter: string; texture: string; part: "back" | "front"; uid: string }) {
  const sheet = (d: string, fill: string, light = true) => <>
    <path d={d} fill={fill} />
    <path d={d} fill={`url(#${texture})`} />
    {light && <path d={d} fill={`url(#sheen-${uid})`} />}
  </>;
  if (part === "back") return <g filter={`url(#${filter})`}>
    {sheet(BACK, paper.back, false)}
    <path d={BACK} fill={`url(#inside-${uid})`} />
    <path d="M20 112Q38 92 60 106Q82 84 108 100Q132 78 158 94Q184 72 210 90Q236 72 262 94Q288 78 312 100Q336 84 358 104Q380 90 400 102" stroke={paper.fold} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
  </g>;
  return <g filter={`url(#${filter})`}>
    <path d="M66 322C126 356 196 374 266 372" stroke="#3a2a14" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".12" transform="translate(0 4)" />
    {sheet(LEFT_FLAP, paper.front)}
    <path d="M66 318C126 352 196 370 266 368" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".45" />
    <path d="M362 290C330 342 266 380 158 396" stroke="#3a2a14" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".12" transform="translate(0 4)" />
    {sheet(RIGHT_FLAP, paper.back)}
    <path d="M362 286C330 338 266 376 158 392" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".45" />
    {sheet(TAIL, paper.front)}
    <path d="M200 446C198 490 192 540 186 582M222 446C226 490 232 540 238 582" stroke={paper.fold} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".55" />
  </g>;
}

/** A satin ribbon: two loops, a knot and long tails that hang past the wrap. */
function Ribbon({ filter }: { filter: string }) {
  const [x, y] = GATHER;
  const line = { fill: RIBBON.fill, stroke: RIBBON.edge, strokeWidth: 1.2 };
  return <g filter={`url(#${filter})`} strokeLinejoin="round">
    <path d={`M${x - 30} ${y - 6}Q${x} ${y + 6} ${x + 30} ${y - 6}L${x + 30} ${y + 8}Q${x} ${y + 20} ${x - 30} ${y + 8}Z`} {...line} />
    <path d={`M${x - 6} ${y + 8}C${x - 18} ${y + 50} ${x - 2} ${y + 90} ${x - 26} ${y + 140}L${x - 14} ${y + 150}C${x + 4} ${y + 104} ${x - 6} ${y + 56} ${x + 4} ${y + 10}Z`} {...line} />
    <path d={`M${x + 4} ${y + 8}C${x + 22} ${y + 44} ${x + 12} ${y + 96} ${x + 38} ${y + 134}L${x + 26} ${y + 144}C${x + 2} ${y + 104} ${x + 10} ${y + 54} ${x - 4} ${y + 10}Z`} {...line} />
    <path d={`M${x - 4} ${y + 4}C${x - 40} ${y - 30} ${x - 78} ${y - 16} ${x - 66} ${y + 6}C${x - 58} ${y + 22} ${x - 26} ${y + 14} ${x - 4} ${y + 6}Z`} {...line} />
    <path d={`M${x + 4} ${y + 4}C${x + 40} ${y - 30} ${x + 78} ${y - 16} ${x + 66} ${y + 6}C${x + 58} ${y + 22} ${x + 26} ${y + 14} ${x + 4} ${y + 6}Z`} {...line} />
    <path d={`M${x - 48} ${y - 2}C${x - 36} ${y - 6} ${x - 20} ${y} ${x - 8} ${y + 4}M${x + 48} ${y - 2}C${x + 36} ${y - 6} ${x + 20} ${y} ${x + 8} ${y + 4}`} stroke={RIBBON.shade} strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x={x - 9} y={y - 5} width="18" height="17" rx="5" fill={RIBBON.shade} stroke={RIBBON.edge} strokeWidth="1.2" />
  </g>;
}

/** `idPrefix` gives fixed ids, so the bouquet can also be drawn outside a page (for link preview images). */
export function Bouquet({ flowers, wrap = "kraft", className = "gift-bouquet", idPrefix }: { flowers: BotanicalName[]; wrap?: string; className?: string; idPrefix?: string }) {
  const paper = wraps.find(w => w.id === wrap && w.back);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const uid = (idPrefix ?? useId()).replace(/[^a-zA-Z0-9]/g, "");
  const filter = "crayon-" + uid, texture = "weave-" + uid;
  const spots = arrange(flowers.length);
  const items = flowers.map((name, i) => { const [x, y, size, tilt] = spots[i]; return { name, slot: [x, y, size] as [number, number, number], tilt, i }; });
  const n = items.length;
  const [gx, gy] = GATHER;
  return <svg className={className} viewBox={`0 0 ${BW} ${BH}`} role="img" aria-label={n ? `A bouquet of ${n} flowers` : "An empty bouquet"}>
    <defs>
      <Crayon id={filter} />
      {paper && <pattern id={texture} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
        <path d="M0 3.5H7M3.5 0V7" stroke={paper.fold} strokeWidth=".9" opacity=".32" />
      </pattern>}
      {paper && <linearGradient id={`inside-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={paper.fold} stopOpacity=".5" /><stop offset=".45" stopColor={paper.fold} stopOpacity=".12" /><stop offset=".7" stopColor={paper.fold} stopOpacity="0" /></linearGradient>}
      <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".28" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#3a2a14" stopOpacity=".12" /></linearGradient>
    </defs>
    {paper && n > 0 && <Wrap paper={paper} filter={filter} texture={texture} part="back" uid={uid} />}
    <g filter={`url(#${filter})`} fill="none" strokeLinecap="round">
      {items.map(({ slot: [x, y, size], i }) => {
        const top = y + size * 0.28, endX = gx + (i - (n - 1) / 2) * 5.5;
        const ctrlX = (x + gx) / 2 + (x - gx) * 0.18;
        return <g key={"stalk" + i} stroke={stalkTones[i % stalkTones.length]}>
          <path d={`M${x} ${top} Q${ctrlX} ${(top + gy) / 2} ${gx + (i - (n - 1) / 2) * 2} ${gy}`} strokeWidth="5" />
          {!paper && <path d={`M${gx + (i - (n - 1) / 2) * 2} ${gy} L${endX} ${BH - 18}`} strokeWidth="5" />}
        </g>;
      })}
      {items.filter(({ i }) => i % 2 === 0 && i < 10).map(({ slot: [x, y, size], i }) => {
        const mx = (x + gx) / 2, my = (y + size * 0.28 + gy) / 2 + 10, side = x < gx ? -1 : 1;
        return <path key={"leaf" + i} d="M0 0C-10-14-10-34 0-48C10-34 10-14 0 0Z" fill={stalkTones[(i + 1) % stalkTones.length]} stroke="none" transform={`translate(${mx} ${my}) rotate(${side * 52})`} />;
      })}
    </g>
    {[...items].sort((a, b) => a.slot[1] - b.slot[1]).map(({ name, slot: [x, y, size], tilt, i }) => <g key={name + i} transform={`translate(${x} ${y}) rotate(${tilt}) translate(${-size / 2} ${-size / 2})`}><Botanical name={name} size={size} title="" filterId={idPrefix ? `${uid}f${i}` : undefined} /></g>)}
    {paper && n > 0 && <><Wrap paper={paper} filter={filter} texture={texture} part="front" uid={uid} /><Ribbon filter={filter} /></>}
    {!paper && n > 0 && <g filter={`url(#${filter})`} fill="none" stroke="#b48a5a" strokeLinecap="round">
      <path d={`M${gx - 20} ${gy - 4} Q${gx} ${gy + 8} ${gx + 20} ${gy - 4}`} strokeWidth="5" />
      <path d={`M${gx - 20} ${gy + 6} Q${gx} ${gy + 18} ${gx + 20} ${gy + 6}`} strokeWidth="5" />
      <path d={`M${gx} ${gy + 8} C${gx - 26} ${gy - 12} ${gx - 30} ${gy + 18} ${gx} ${gy + 8}`} strokeWidth="3.5" />
      <path d={`M${gx} ${gy + 8} C${gx + 26} ${gy - 12} ${gx + 30} ${gy + 18} ${gx} ${gy + 8}`} strokeWidth="3.5" />
      <path d={`M${gx - 2} ${gy + 10} L${gx - 14} ${gy + 44}M${gx + 2} ${gy + 10} L${gx + 12} ${gy + 46}`} strokeWidth="3" />
    </g>}
  </svg>;
}

