"use client";

import { useEffect, useId, useState } from "react";
import { Botanical } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";
import { Icon } from "../components/icons";
import { useCopy } from "../components/copy";
import { MAX_BOUQUET, MAX_MESSAGE, MAX_SPRIG, choices, decode, pack, unpack } from "./codec";
import type { Gift, Mode } from "./codec";

const wraps = [
  { id: "none", label: "no paper", back: "", front: "", fold: "" },
  { id: "kraft", label: "burlap", back: "#dcc196", front: "#d2b383", fold: "#a8875a" },
  { id: "blush", label: "blush", back: "#f6d5dc", front: "#eebcc8", fold: "#d99aaa" },
  { id: "cream", label: "cream", back: "#f4eedf", front: "#e9dfc8", fold: "#d3c5a6" },
  { id: "sage", label: "sage", back: "#d5e4c8", front: "#bfd4ad", fold: "#9fbb88" },
  { id: "sky", label: "sky", back: "#d6e8f7", front: "#bcd6ee", fold: "#94b8db" },
];
const stamps = [
  { id: "rose", flower: "Rose" as BotanicalName, paper: "#fde4ea", ink: "#c2415d", label: "rose", value: "25" },
  { id: "sun", flower: "Sunflower" as BotanicalName, paper: "#fff3cf", ink: "#b7791f", label: "sunflower", value: "40" },
  { id: "sky", flower: "ForgetMeNot" as BotanicalName, paper: "#e2f0ff", ink: "#2f6fb5", label: "forget-me-not", value: "10" },
  { id: "lilac", flower: "Lavender" as BotanicalName, paper: "#efe7ff", ink: "#6a4bb8", label: "lavender", value: "60" },
  { id: "meadow", flower: "Daisy" as BotanicalName, paper: "#e7f5e1", ink: "#3f7d3a", label: "daisy", value: "15" },
];
const empty: Gift = { mode: "both", flowers: [], wrap: "kraft", sprig: [], stamp: "rose", to: "", message: "", from: "" };

// ---------- crayon texture shared by stalks, leaves and twine ----------
function Crayon({ id }: { id: string }) {
  return <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" result="warp" />
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="paint" />
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="grain" />
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.25" result="speckle" />
    <feComposite in="paint" in2="speckle" operator="in" />
  </filter>;
}

// ---------- bouquet: flowers on long stalks, wrapped in paper like a florist would ----------
const BW = 420, BH = 600, GATHER: [number, number] = [210, 436];
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
const stalkTones = ["#4f9a3f", "#5fa94a", "#468f39", "#6cb456"];
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

export function Bouquet({ flowers, wrap = "kraft", className = "gift-bouquet" }: { flowers: BotanicalName[]; wrap?: string; className?: string }) {
  const paper = wraps.find(w => w.id === wrap && w.back);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
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
    {[...items].sort((a, b) => a.slot[1] - b.slot[1]).map(({ name, slot: [x, y, size], tilt, i }) => <g key={name + i} transform={`translate(${x} ${y}) rotate(${tilt}) translate(${-size / 2} ${-size / 2})`}><Botanical name={name} size={size} title="" /></g>)}
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

// ---------- the flowers that sit on stalks at the side of the letter ----------
function Sprig({ flowers }: { flowers: BotanicalName[] }) {
  const filter = "sprig-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const heads: [number, number, number][] = [[40, 34, 52], [78, 58, 46], [24, 84, 42]];
  return <svg className="letter-sprig" viewBox="0 0 120 200" aria-hidden="true">
    <defs><Crayon id={filter} /></defs>
    <g filter={`url(#${filter})`} fill="none" strokeLinecap="round" strokeWidth="3.4">
      {flowers.map((_, i) => <path key={i} d={`M${heads[i][0]} ${heads[i][1] + 14} Q${heads[i][0] + 8} 130 ${52 + i * 4} 196`} stroke={stalkTones[i % stalkTones.length]} />)}
      {flowers.length > 0 && <path d="M54 150C42 140 38 124 44 112C54 120 58 134 54 150Z" fill="#5fa94a" stroke="none" />}
    </g>
    {flowers.map((name, i) => <g key={name + i} transform={`translate(${heads[i][0] - heads[i][2] / 2} ${heads[i][1] - heads[i][2] / 2})`}><Botanical name={name} size={heads[i][2]} title="" /></g>)}
  </svg>;
}

/** A postage stamp: perforated edge, white margin, printed face, value and a crayon postmark. */
function Stamp({ id, small = false, postmark = false }: { id: string; small?: boolean; postmark?: boolean }) {
  const stamp = stamps.find(s => s.id === id) ?? stamps[0];
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const W = 80, H = 96, holes: [number, number][] = [];
  for (let x = 4; x <= W - 4; x += 8) holes.push([x, 0], [x, H]);
  for (let y = 4; y <= H - 4; y += 8) holes.push([0, y], [W, y]);
  const width = small ? 46 : 84;
  return <svg className={"stamp" + (small ? " stamp-small" : "")} viewBox={`-2 -2 ${W + (postmark ? 40 : 4)} ${H + 4}`} width={width * (postmark ? 1.45 : 1)} height={width * 1.2} role="img" aria-label={stamp.label + " stamp"}>
    <defs>
      <mask id={"perf" + uid}><rect x="0" y="0" width={W} height={H} fill="#fff" />{holes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.7" fill="#000" />)}</mask>
      <filter id={"shade" + uid} x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#3a2a10" floodOpacity=".22" /></filter>
      <Crayon id={"ink" + uid} />
      <pattern id={"dots" + uid} width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".45" fill={stamp.ink} opacity=".18" /></pattern>
    </defs>
    <g filter={`url(#shade${uid})`}><rect x="0" y="0" width={W} height={H} fill="#fffdf6" mask={`url(#perf${uid})`} /></g>
    <rect x="7" y="7" width={W - 14} height={H - 14} fill={stamp.paper} />
    <rect x="7" y="7" width={W - 14} height={H - 14} fill={`url(#dots${uid})`} />
    <rect x="7" y="7" width={W - 14} height={H - 14} fill="none" stroke={stamp.ink} strokeWidth=".8" />
    <rect x="9.5" y="9.5" width={W - 19} height={H - 19} fill="none" stroke={stamp.ink} strokeWidth=".4" opacity=".6" />
    <g transform={`translate(${W / 2 - 27} ${H / 2 - 29})`}><Botanical name={stamp.flower} size={54} title="" /></g>
    <text x="12.5" y="21" fontSize="11" fontWeight="700" fill={stamp.ink} fontFamily="Instrument Sans, sans-serif">{stamp.value}</text>
    <text x={W / 2} y={H - 12.5} fontSize="6.4" fontWeight="700" letterSpacing="1.4" textAnchor="middle" fill={stamp.ink} fontFamily="Instrument Sans, sans-serif">FLORII POST</text>
    {postmark && <g filter={`url(#ink${uid})`} fill="none" stroke="#2c2a33" strokeLinecap="round" opacity=".62">
      <circle cx={W - 4} cy="30" r="19" strokeWidth="1.6" />
      <circle cx={W - 4} cy="30" r="14.5" strokeWidth=".8" />
      <text x={W - 4} y="28" fontSize="5.4" fontWeight="700" textAnchor="middle" fill="#2c2a33" stroke="none" letterSpacing=".8" fontFamily="Instrument Sans, sans-serif">FLORII</text>
      <text x={W - 4} y="35.5" fontSize="5" textAnchor="middle" fill="#2c2a33" stroke="none" fontFamily="Instrument Sans, sans-serif">{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase()}</text>
      {[0, 1, 2, 3].map(i => <path key={i} d={`M${W + 17} ${20 + i * 6.5}q4.5-3 9 0t9 0`} strokeWidth="1.4" />)}
    </g>}
  </svg>;
}

function Letter({ gift }: { gift: Gift }) {
  return <article className="letter">
    <span className="letter-stamp"><Stamp id={gift.stamp} postmark /></span>
    <div className="letter-body">
      {gift.sprig.length > 0 && <Sprig flowers={gift.sprig} />}
      <div className="letter-words">
        <p className="letter-to">{gift.to ? `dear ${gift.to},` : "dear you,"}</p>
        <p className="letter-message">{gift.message || "write something kind…"}</p>
        <p className="letter-from">{gift.from ? <>with love,<br /><span>{gift.from}</span></> : "with love"}</p>
      </div>
    </div>
  </article>;
}

function Preview({ gift }: { gift: Gift }) {
  const showBouquet = gift.mode !== "letter", showLetter = gift.mode !== "bouquet";
  return <div className={"gift-preview" + (showBouquet && showLetter ? " is-both" : "")}>
    {showBouquet && <div className="gift-bouquet-wrap">{gift.flowers.length ? <Bouquet flowers={gift.flowers} wrap={gift.wrap} /> : <p className="gift-empty">pick flowers to start your bouquet</p>}</div>}
    {showLetter && <Letter gift={gift} />}
  </div>;
}

// ---------- the recipient's envelope ----------
function Envelope({ gift, onOpen }: { gift: Gift; onOpen: () => void }) {
  // seal pops → flap swings open → card slides out → envelope sinks away → the gift appears
  const [stage, setStage] = useState<"closed" | "seal" | "flap" | "rise" | "exit">("closed");
  function open() {
    if (stage !== "closed") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { onOpen(); return; }
    setStage("seal");
    window.setTimeout(() => setStage("flap"), 280);
    window.setTimeout(() => setStage("rise"), 950);
    window.setTimeout(() => setStage("exit"), 1800);
    window.setTimeout(onOpen, 2300);
  }
  return <div className={"envelope-scene stage-" + stage}>
    <button className="envelope" onClick={open} aria-label="Open your envelope">
      <span className="env-back" />
      <span className="env-card"><span className="env-card-line">{gift.to ? `for ${gift.to}` : "for you"}</span><Botanical name={(gift.flowers[0] ?? gift.sprig[0] ?? "Rose")} size={54} title="" /></span>
      <span className="env-front" />
      <span className="env-flap" />
      <span className="env-seal" aria-hidden="true"><Botanical name="Daisy" size={30} title="" /></span>
      <span className="env-address"><span>to</span>{gift.to || "someone lovely"}</span>
      <span className="env-stamp"><Stamp id={gift.stamp} small /></span>
    </button>
    <p className="envelope-hint">{stage === "closed" ? "tap the envelope to open it" : "opening…"}</p>
  </div>;
}

// ---------- image export (bouquet and letter as one card) ----------
async function downloadCard(gift: Gift) {
  const bouquet = document.querySelector(".gift-stage svg.gift-bouquet");
  const font = await fetch("/fonts/instrument-sans-latin.woff2").then(r => r.arrayBuffer()).then(buffer => { let binary = ""; new Uint8Array(buffer).forEach(b => { binary += String.fromCharCode(b); }); return btoa(binary); }).catch(() => "");
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // pick the largest text size at which the whole letter fits on the card
  const wrap = (perLine: number) => {
    const out: string[] = [];
    for (const para of (gift.message || "").split(/\n/)) {
      let line = "";
      for (const word of para.split(/\s+/)) { if ((line + " " + word).trim().length > perLine && line) { out.push(line.trim()); line = word; } else line += " " + word; }
      out.push(line.trim());
    }
    return out;
  };
  const room = 330;
  let fontSize = 24, lines = wrap(36);
  for (const size of [24, 21, 18, 16, 14, 12.5]) { fontSize = size; lines = wrap(Math.floor(430 / (size * 0.5))); if (lines.length * size * 1.55 <= room) break; }
  const lineHeight = fontSize * 1.55;
  const showBouquet = gift.mode !== "letter" && bouquet, showLetter = gift.mode !== "bouquet";
  const inner = showBouquet ? new XMLSerializer().serializeToString(bouquet as Element).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") : "";
  const letterX = showBouquet ? 620 : 340;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
<style>@font-face{font-family:"Instrument Sans";src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:400 700}text{font-family:"Instrument Sans",sans-serif;fill:#131316}</style>
<rect width="1200" height="800" fill="#f7f3ea"/>
${showBouquet ? `<svg x="${showLetter ? 70 : 340}" y="40" width="520" height="720" viewBox="0 0 ${BW} ${BH}">${inner}</svg>` : ""}
${showLetter ? `<rect x="${letterX}" y="110" width="520" height="580" rx="10" fill="#fffdf8" stroke="#e8dfcd"/>
<text x="${letterX + 50}" y="200" font-size="32" font-weight="600">${esc(gift.to ? `dear ${gift.to},` : "dear you,")}</text>
${lines.slice(0, Math.floor(room / lineHeight)).map((l, i) => `<text x="${letterX + 50}" y="${250 + i * lineHeight}" font-size="${fontSize}" fill="#44444d">${esc(l)}</text>`).join("")}
<text x="${letterX + 50}" y="${Math.max(560, 250 + Math.min(lines.length, Math.floor(room / lineHeight)) * lineHeight + 40)}" font-size="22" font-weight="600">${esc(gift.from ? `with love, ${gift.from}` : "with love")}</text>` : ""}
<text x="1090" y="769" font-size="16" text-anchor="end" fill="#8a8a93">made with</text>
<g transform="translate(1096 750) scale(0.78)" fill="none" stroke="#131316" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 26V10C10 5.5 12.8 3 17 4.2"/><path d="M5.5 14H15"/><path d="M22 4V22C22 25 23.8 26.2 26.2 25.2"/><path d="M33 14C29.2 14 27 16.8 27 20.2C27 23.8 29.6 26 33 26C36.8 26 39 23.2 39 19.8C39 16.2 36.4 14 33 14Z"/><path d="M45 14.5V26"/><path d="M45 19.5C46.2 15.6 49 14 52.4 15"/><path d="M57.5 15V26"/><path d="M64.5 15V26"/><circle cx="57.5" cy="8.2" r="0.6"/><circle cx="64.5" cy="8.2" r="0.6"/></g></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const image = new Image();
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("render failed")); image.src = url; });
  const canvas = document.createElement("canvas"); canvas.width = 2400; canvas.height = 1600;
  canvas.getContext("2d")?.drawImage(image, 0, 0, 2400, 1600);
  URL.revokeObjectURL(url);
  const link = document.createElement("a"); link.download = "florii-gift.png"; link.href = canvas.toDataURL("image/png"); link.click();
}

function Picker({ selected, max, onAdd, onRemove, onClear }: { selected: BotanicalName[]; max: number; onAdd: (n: BotanicalName) => void; onRemove: (i: number) => void; onClear: () => void }) {
  return <>
    <div className="gift-picker" role="group" aria-label="Add a flower">
      {choices.map(name => <button key={name} onClick={() => onAdd(name)} disabled={selected.length >= max} aria-label={"Add " + name} title={name}><Botanical name={name} size={34} title="" /></button>)}
    </div>
    {selected.length > 0 && <div className="gift-chosen">
      {selected.map((name, i) => <button key={name + i} onClick={() => onRemove(i)} aria-label={"Remove " + name}><Botanical name={name} size={18} title="" /><span>×</span></button>)}
      <button className="gift-clear" onClick={onClear}>clear</button>
    </div>}
  </>;
}

export function GiftMaker({ code }: { code?: string } = {}) {
  const { copy, toast } = useCopy();
  const [gift, setGift] = useState<Gift>(empty);
  const [received, setReceived] = useState(false);
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const open = (found: Gift | null) => { if (found) { setGift(found); setReceived(true); } };
    if (code) { unpack(code).then(open); return; }
    const token = new URLSearchParams(window.location.hash.slice(1)).get("g"); // older long links
    if (token) open(decode(token));
  }, []);

  const [linking, setLinking] = useState(false);
  async function makeLink() { setLinking(true); try { return `${window.location.origin}/g/${await pack(gift)}`; } finally { setLinking(false); } }
  const set = (patch: Partial<Gift>) => setGift(current => ({ ...current, ...patch }));
  const ready = (gift.mode === "letter" || gift.flowers.length > 0) && (gift.mode === "bouquet" || gift.message.trim().length > 0);

  async function download() {
    setBusy(true);
    try { await downloadCard(gift); copy("", "Saved to your downloads"); } catch { copy("", "Couldn't make the image. Try again."); } finally { setBusy(false); }
  }
  async function send() {
    const link = await makeLink();
    if (navigator.share) { try { await navigator.share({ title: "something for you", text: gift.to ? `a little something for ${gift.to}` : "a little something for you", url: link }); return; } catch { /* cancelled */ } }
    copy(link, "Link copied, ready to send");
  }

  if (received) return <section className="gift-received">
    {!opened ? <Envelope gift={gift} onOpen={() => setOpened(true)} /> : <div className="gift-reveal"><div className="gift-stage"><Preview gift={gift} /></div>
      <div className="gift-actions">
        <button className="btn btn-dark" onClick={download} disabled={busy}><Icon name="download" size={15} /> {busy ? "preparing…" : "keep this card"}</button>
        <a className="btn btn-ghost" href="/gift">send one back</a>
      </div></div>}
    {toast}
  </section>;

  const showBouquet = gift.mode !== "letter", showLetter = gift.mode !== "bouquet";
  return <section className="gift-maker">
    <div className="gift-mode" role="tablist" aria-label="What to send">
      {([["bouquet", "bouquet"], ["letter", "letter"], ["both", "bouquet + letter"]] as [Mode, string][]).map(([value, label]) => <button key={value} role="tab" aria-selected={gift.mode === value} onClick={() => set({ mode: value })}>{label}</button>)}
    </div>

    <div className="gift-grid">
      <div className="gift-controls">
        {showBouquet && <div className="gift-step">
          <div className="gift-step-head"><h2>the bouquet</h2><span>{gift.flowers.length}/{MAX_BOUQUET}</span></div>
          <p className="gift-hint">tap flowers to add them. each one gets its own stalk.</p>
          <Picker selected={gift.flowers} max={MAX_BOUQUET} onAdd={name => set({ flowers: [...gift.flowers, name] })} onRemove={i => set({ flowers: gift.flowers.filter((_, k) => k !== i) })} onClear={() => set({ flowers: [] })} />
          <span className="pay-label gift-label-gap">wrapping paper <em>optional</em></span>
          <div className="gift-wraps" role="group" aria-label="Wrapping paper">
            {wraps.map(w => <button key={w.id} aria-pressed={gift.wrap === w.id} onClick={() => set({ wrap: w.id })}>
              <span className={"wrap-swatch" + (w.back ? "" : " is-none")} style={w.back ? { background: `linear-gradient(135deg, ${w.back} 50%, ${w.front} 50%)` } : undefined} />{w.label}
            </button>)}
          </div>
        </div>}

        {showLetter && <div className="gift-step">
          <div className="gift-step-head"><h2>the letter</h2></div>
          <span className="pay-label">flowers at the side <em>up to {MAX_SPRIG}</em></span>
          <Picker selected={gift.sprig} max={MAX_SPRIG} onAdd={name => set({ sprig: [...gift.sprig, name] })} onRemove={i => set({ sprig: gift.sprig.filter((_, k) => k !== i) })} onClear={() => set({ sprig: [] })} />
          <span className="pay-label gift-label-gap">stamp</span>
          <div className="gift-stamps" role="group" aria-label="Stamp">
            {stamps.map(s => <button key={s.id} aria-pressed={gift.stamp === s.id} onClick={() => set({ stamp: s.id })} title={s.label}><Stamp id={s.id} small /></button>)}
          </div>
          <div className="pay-fields gift-label-gap">
            <label><span className="pay-label">to</span><input maxLength={40} value={gift.to} onChange={e => set({ to: e.target.value })} placeholder="their name" /></label>
            <label><span className="pay-label">your letter</span><textarea maxLength={MAX_MESSAGE} rows={5} value={gift.message} onChange={e => set({ message: e.target.value })} placeholder="write something kind…" /><span className="pay-count">{gift.message.length}/{MAX_MESSAGE}</span></label>
            <label><span className="pay-label">from</span><input maxLength={40} value={gift.from} onChange={e => set({ from: e.target.value })} placeholder="your name" /></label>
          </div>
        </div>}
      </div>

      <div className="gift-side">
        <div className="gift-stage"><Preview gift={gift} /></div>
        <div className="gift-actions">
          <button className="btn btn-dark" onClick={send} disabled={!ready}><Icon name="external" size={15} /> send it</button>
          <button className="btn btn-ghost" onClick={async () => copy(await makeLink(), "Link copied")} disabled={!ready || linking}><Icon name="copy" size={15} /> copy link</button>
          <button className="btn btn-ghost" onClick={download} disabled={busy || !ready}><Icon name="download" size={15} /> {busy ? "preparing…" : "download"}</button>
        </div>
        <p className="gift-note">{ready ? "they'll get it sealed in an envelope with your stamp. nothing is stored on our side." : gift.mode === "letter" ? "write your letter to send it." : gift.mode === "bouquet" ? "add a flower to send your bouquet." : "add a flower and write your letter to send them."}</p>
      </div>
    </div>
    {toast}
  </section>;
}
