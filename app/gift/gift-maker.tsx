"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Botanical, botanicalCatalog } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";
import { Icon } from "../components/icons";
import { useCopy } from "../components/copy";

type Mode = "bouquet" | "letter" | "both";
type Gift = { mode: Mode; flowers: BotanicalName[]; wrap: string; sprig: BotanicalName[]; stamp: string; to: string; message: string; from: string };

const MAX_BOUQUET = 9, MAX_SPRIG = 3;
const choices = botanicalCatalog.filter(item => item.category === "flower").map(item => item.id);
const wraps = [
  { id: "none", label: "no paper", back: "", front: "", fold: "" },
  { id: "kraft", label: "kraft", back: "#d8b78a", front: "#cda56f", fold: "#b88d55" },
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
const empty: Gift = { mode: "both", flowers: [], wrap: "none", sprig: [], stamp: "rose", to: "", message: "", from: "" };

// ---------- share link: the whole gift lives in the URL ----------
function encode(gift: Gift) {
  const json = JSON.stringify({ o: gift.mode, f: gift.flowers, w: gift.wrap, l: gift.sprig, p: gift.stamp, t: gift.to, m: gift.message, s: gift.from });
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decode(token: string): Gift | null {
  try {
    const raw = JSON.parse(decodeURIComponent(escape(atob(token.replace(/-/g, "+").replace(/_/g, "/"))))) as Record<string, unknown>;
    const list = (value: unknown, max: number) => (Array.isArray(value) ? value.filter((n): n is BotanicalName => typeof n === "string" && choices.includes(n as BotanicalName)).slice(0, max) : []);
    const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");
    const mode: Mode = raw.o === "bouquet" || raw.o === "letter" ? raw.o : "both";
    return { mode, flowers: list(raw.f, MAX_BOUQUET), wrap: wraps.some(w => w.id === raw.w) ? String(raw.w) : "none", sprig: list(raw.l, MAX_SPRIG), stamp: stamps.some(s => s.id === raw.p) ? String(raw.p) : "rose", to: text(raw.t, 40), message: text(raw.m, 400), from: text(raw.s, 40) };
  } catch { return null; }
}

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

// ---------- bouquet: flowers on long green stalks, gathered and tied with twine ----------
const BW = 420, BH = 580, GATHER: [number, number] = [210, 400];
const slots: [number, number, number][] = [
  [210, 170, 132], [146, 196, 118], [274, 196, 118], [180, 112, 112], [242, 110, 112],
  [100, 246, 104], [320, 246, 104], [210, 238, 116], [212, 62, 100],
];
const stalkTones = ["#4f9a3f", "#5fa94a", "#468f39", "#6cb456"];

export function Bouquet({ flowers, wrap = "none", className = "gift-bouquet" }: { flowers: BotanicalName[]; wrap?: string; className?: string }) {
  const paper = wraps.find(w => w.id === wrap && w.back);
  const filter = "crayon-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const items = flowers.map((name, i) => ({ name, slot: slots[i], i }));
  const n = items.length;
  return <svg className={className} viewBox={`0 0 ${BW} ${BH}`} role="img" aria-label={n ? `A bouquet of ${n} flowers` : "An empty bouquet"}>
    <defs><Crayon id={filter} /></defs>
    {paper && n > 0 && <g filter={`url(#${filter})`}>
      <path d="M92 292C140 276 280 276 328 292L238 566C222 572 198 572 182 566Z" fill={paper.back} />
      <path d="M150 300L196 560M270 300L224 560" stroke={paper.fold} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".55" />
    </g>}
    <g filter={`url(#${filter})`} fill="none" strokeLinecap="round">
      {items.map(({ slot: [x, y, size], i }) => {
        const top = y + size * 0.28, endX = GATHER[0] + (i - (n - 1) / 2) * 5.5;
        const ctrlX = (x + GATHER[0]) / 2 + (x - GATHER[0]) * 0.18;
        return <g key={"stalk" + i} stroke={stalkTones[i % stalkTones.length]}>
          <path d={`M${x} ${top} Q${ctrlX} ${(top + GATHER[1]) / 2} ${GATHER[0] + (i - (n - 1) / 2) * 2} ${GATHER[1]}`} strokeWidth="5" />
          <path d={`M${GATHER[0] + (i - (n - 1) / 2) * 2} ${GATHER[1]} L${endX} ${BH - 18}`} strokeWidth="5" />
        </g>;
      })}
      {items.filter(({ i }) => i % 2 === 0).map(({ slot: [x, y, size], i }) => {
        const mx = (x + GATHER[0]) / 2, my = (y + size * 0.28 + GATHER[1]) / 2 + 10, side = x < GATHER[0] ? -1 : 1;
        return <path key={"leaf" + i} d="M0 0C-10-14-10-34 0-48C10-34 10-14 0 0Z" fill={stalkTones[(i + 1) % stalkTones.length]} stroke="none" transform={`translate(${mx} ${my}) rotate(${side * 52})`} />;
      })}
    </g>
    {[...items].sort((a, b) => a.slot[1] - b.slot[1]).map(({ name, slot: [x, y, size], i }) => <g key={name + i} transform={`translate(${x - size / 2} ${y - size / 2})`}><Botanical name={name} size={size} title="" /></g>)}
    {paper && n > 0 && <g filter={`url(#${filter})`}>
      <path d="M112 352C150 378 270 378 308 352L240 566C222 573 198 573 180 566Z" fill={paper.front} />
      <path d="M112 352C150 378 270 378 308 352" stroke={paper.fold} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M160 372L198 560M262 372L226 560" stroke={paper.fold} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".5" />
    </g>}
    {n > 0 && <g filter={`url(#${filter})`} fill="none" stroke="#b48a5a" strokeLinecap="round">
      <path d={`M${GATHER[0] - 20} ${GATHER[1] - 4} Q${GATHER[0]} ${GATHER[1] + 8} ${GATHER[0] + 20} ${GATHER[1] - 4}`} strokeWidth="5" />
      <path d={`M${GATHER[0] - 20} ${GATHER[1] + 6} Q${GATHER[0]} ${GATHER[1] + 18} ${GATHER[0] + 20} ${GATHER[1] + 6}`} strokeWidth="5" />
      <path d={`M${GATHER[0]} ${GATHER[1] + 8} C${GATHER[0] - 26} ${GATHER[1] - 12} ${GATHER[0] - 30} ${GATHER[1] + 18} ${GATHER[0]} ${GATHER[1] + 8}`} strokeWidth="3.5" />
      <path d={`M${GATHER[0]} ${GATHER[1] + 8} C${GATHER[0] + 26} ${GATHER[1] - 12} ${GATHER[0] + 30} ${GATHER[1] + 18} ${GATHER[0]} ${GATHER[1] + 8}`} strokeWidth="3.5" />
      <path d={`M${GATHER[0] - 2} ${GATHER[1] + 10} L${GATHER[0] - 14} ${GATHER[1] + 44}M${GATHER[0] + 2} ${GATHER[1] + 10} L${GATHER[0] + 12} ${GATHER[1] + 46}`} strokeWidth="3" />
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
  const [stage, setStage] = useState<"closed" | "flap" | "rise" | "done">("closed");
  function open() {
    if (stage !== "closed") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { onOpen(); return; }
    setStage("flap");
    window.setTimeout(() => setStage("rise"), 700);
    window.setTimeout(() => { setStage("done"); onOpen(); }, 1900);
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
  const lines: string[] = []; let line = "";
  for (const word of (gift.message || "").split(/\s+/)) { if ((line + " " + word).trim().length > 36) { lines.push(line.trim()); line = word; } else line += " " + word; }
  if (line.trim()) lines.push(line.trim());
  const showBouquet = gift.mode !== "letter" && bouquet, showLetter = gift.mode !== "bouquet";
  const inner = showBouquet ? new XMLSerializer().serializeToString(bouquet as Element).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") : "";
  const letterX = showBouquet ? 620 : 340;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
<style>@font-face{font-family:"Instrument Sans";src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:400 700}text{font-family:"Instrument Sans",sans-serif;fill:#131316}</style>
<rect width="1200" height="800" fill="#f7f3ea"/>
${showBouquet ? `<svg x="${showLetter ? 70 : 340}" y="40" width="520" height="720" viewBox="0 0 ${BW} ${BH}">${inner}</svg>` : ""}
${showLetter ? `<rect x="${letterX}" y="110" width="520" height="580" rx="10" fill="#fffdf8" stroke="#e8dfcd"/>
<text x="${letterX + 50}" y="200" font-size="32" font-weight="600">${esc(gift.to ? `dear ${gift.to},` : "dear you,")}</text>
${lines.slice(0, 9).map((l, i) => `<text x="${letterX + 50}" y="${260 + i * 38}" font-size="24" fill="#44444d">${esc(l)}</text>`).join("")}
<text x="${letterX + 50}" y="${Math.max(520, 300 + Math.min(lines.length, 9) * 38)}" font-size="24" font-weight="600">${esc(gift.from ? `with love, ${gift.from}` : "with love")}</text>` : ""}
<text x="1150" y="770" font-size="16" text-anchor="end" fill="#8a8a93">made with florii</text></svg>`;
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

export function GiftMaker() {
  const { copy, toast } = useCopy();
  const [gift, setGift] = useState<Gift>(empty);
  const [received, setReceived] = useState(false);
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("g");
    const shared = token ? decode(token) : null;
    if (shared) { setGift(shared); setReceived(true); }
  }, []);

  const link = useMemo(() => (typeof window === "undefined" ? "" : `${window.location.origin}/gift#g=${encode(gift)}`), [gift]);
  const set = (patch: Partial<Gift>) => setGift(current => ({ ...current, ...patch }));
  const ready = (gift.mode === "letter" || gift.flowers.length > 0) && (gift.mode === "bouquet" || gift.message.trim().length > 0);

  async function download() {
    setBusy(true);
    try { await downloadCard(gift); copy("", "Saved to your downloads"); } catch { copy("", "Couldn't make the image. Try again."); } finally { setBusy(false); }
  }
  async function send() {
    if (navigator.share) { try { await navigator.share({ title: "something for you", text: gift.to ? `a little something for ${gift.to}` : "a little something for you", url: link }); return; } catch { /* cancelled */ } }
    copy(link, "Link copied, ready to send");
  }

  if (received) return <section className="gift-received">
    {!opened ? <Envelope gift={gift} onOpen={() => setOpened(true)} /> : <div className="gift-reveal"><div className="gift-stage"><Preview gift={gift} /></div>
      <div className="gift-actions">
        <button className="btn btn-dark" onClick={download} disabled={busy}><Icon name="download" size={15} /> {busy ? "preparing…" : "keep this card"}</button>
        <a className="btn btn-ghost" href="/gift" onClick={() => { history.replaceState(null, "", "/gift"); }}>send one back</a>
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
            <label><span className="pay-label">your letter</span><textarea maxLength={400} rows={5} value={gift.message} onChange={e => set({ message: e.target.value })} placeholder="write something kind…" /><span className="pay-count">{gift.message.length}/400</span></label>
            <label><span className="pay-label">from</span><input maxLength={40} value={gift.from} onChange={e => set({ from: e.target.value })} placeholder="your name" /></label>
          </div>
        </div>}
      </div>

      <div className="gift-side">
        <div className="gift-stage"><Preview gift={gift} /></div>
        <div className="gift-actions">
          <button className="btn btn-dark" onClick={send} disabled={!ready}><Icon name="external" size={15} /> send it</button>
          <button className="btn btn-ghost" onClick={() => copy(link, "Link copied")} disabled={!ready}><Icon name="copy" size={15} /> copy link</button>
          <button className="btn btn-ghost" onClick={download} disabled={busy || !ready}><Icon name="download" size={15} /> {busy ? "preparing…" : "download"}</button>
        </div>
        <p className="gift-note">{ready ? "they'll get it sealed in an envelope with your stamp. nothing is stored on our side." : gift.mode === "letter" ? "write your letter to send it." : gift.mode === "bouquet" ? "add a flower to send your bouquet." : "add a flower and write your letter to send them."}</p>
      </div>
    </div>
    {toast}
  </section>;
}
