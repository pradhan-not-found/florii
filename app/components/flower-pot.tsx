"use client";

import { useEffect, useRef, useState } from "react";
import { Botanical } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";

/** Each pot: its flower, its glaze and the darker rim. */
const POTS: [BotanicalName, string, string][] = [
  ["Tulip", "#d9825b", "#b8623d"],
  ["Rose", "#e7a3b0", "#c97f8e"],
  ["Sunflower", "#e9c46a", "#c9a246"],
  ["Lavender", "#b9a7e0", "#957fc6"],
  ["Daisy", "#9fc7e8", "#7aa7cc"],
  ["Poppy", "#f0a07a", "#d67f58"],
  ["Cosmos", "#a8d5b8", "#82b896"],
  ["Peony", "#f2b8c6", "#d895a6"],
  ["Marigold", "#cfc3ad", "#ad9f86"],
];

// how a seed becomes a flower
const GROW_SECONDS = 150; // from seed to full bloom, kept watered the whole time
const DRY_SECONDS = 50;   // a fresh watering lasts this long before the soil is dry again
const FEED_SECONDS = 60;  // manure doubles the growth rate for this long
const COOKIE = "florii-garden";

type Pot = { g: number; h: number; f: number }; // growth 0–1, soil moisture 0–1, seconds of manure left
type Tool = "water" | "feed" | null;
const fresh = (): Pot[] => POTS.map(() => ({ g: 0, h: 0, f: 0 }));

/** Advances one pot by `dt` seconds: it grows only while the soil is damp, faster with manure. */
function grow(p: Pot, dt: number): Pot {
  let { g, h, f } = p;
  for (let left = dt; left > 0 && (h > 0 || f > 0); left -= 1) {
    const step = Math.min(1, left);
    if (h > 0) g = Math.min(1, g + (step / GROW_SECONDS) * (f > 0 ? 2 : 1) * (0.35 + 0.65 * h));
    h = Math.max(0, h - step / DRY_SECONDS);
    f = Math.max(0, f - step);
  }
  return { g, h, f };
}

function load(): Pot[] {
  try {
    const raw = document.cookie.split("; ").find(c => c.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1);
    if (!raw) return fresh();
    const { at, pots } = JSON.parse(decodeURIComponent(raw)) as { at: number; pots: [number, number, number][] };
    // the time you were away counts too, for as long as the soil stayed damp
    const away = Math.min(3600, Math.max(0, (Date.now() - at) / 1000));
    return POTS.map((_, i) => grow({ g: pots[i]?.[0] ?? 0, h: pots[i]?.[1] ?? 0, f: pots[i]?.[2] ?? 0 }, away));
  } catch { return fresh(); }
}
function save(pots: Pot[]) {
  try {
    const value = encodeURIComponent(JSON.stringify({ at: Date.now(), pots: pots.map(p => [+p.g.toFixed(4), +p.h.toFixed(3), Math.round(p.f)]) }));
    document.cookie = `${COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  } catch { /* cookies blocked: the garden just won't be remembered */ }
}

const stageOf = (g: number) => g >= 1 ? "in bloom" : g > .82 ? "budding" : g > .45 ? "growing" : g > .06 ? "sprouting" : "seed";
const ramp = (g: number, a: number, b: number) => Math.min(1, Math.max(0, (g - a) / (b - a)));

const cursor = (svg: string, x: number, y: number) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") ${x} ${y}, pointer`;
const CAN_CURSOR = cursor('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g transform="rotate(-24 20 20)"><path d="M16 14h14a3 3 0 0 1 3 3v11a5 5 0 0 1-5 5H18a5 5 0 0 1-5-5V17a3 3 0 0 1 3-3Z" fill="#7aa7c7" stroke="#3d6a8a" stroke-width="1.4"/><path d="M13 20 4 13l-1.6 2.2 8.6 8Z" fill="#6b98b8" stroke="#3d6a8a" stroke-width="1.2" stroke-linejoin="round"/><path d="M19 14v-3a4 4 0 0 1 8 0v3" fill="none" stroke="#3d6a8a" stroke-width="2.2" stroke-linecap="round"/></g></svg>', 4, 30);
const FEED_CURSOR = cursor('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g transform="rotate(-28 20 20)"><path d="M12 10h16l2 22a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3Z" fill="#c9a27a" stroke="#6e4f33" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 10l3-4h10l3 4" fill="#b58c63" stroke="#6e4f33" stroke-width="1.4" stroke-linejoin="round"/><circle cx="20" cy="22" r="4" fill="#7a5a3a"/></g></svg>', 6, 32);

type Bit = { id: number; pot: number; x: number; kind: "drop" | "grain" };

/**
 * A tray of seedlings that really grow. Plant, water and feed them: a pot grows only while its soil is damp,
 * manure speeds it up, and the garden is remembered in a cookie between visits.
 */
export function FlowerPot() {
  const [pots, setPots] = useState<Pot[]>(fresh);
  const [tool, setTool] = useState<Tool>(null);
  const [bits, setBits] = useState<Bit[]>([]);
  const potsRef = useRef(pots);
  const pouring = useRef(false);
  const last = useRef<number[]>(POTS.map(() => 0));
  const bitId = useRef(0);

  // load the saved garden, then let it grow a little every frame
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { potsRef.current = POTS.map(() => ({ g: 1, h: 0, f: 0 })); setPots(potsRef.current); return; }
    potsRef.current = load(); setPots(potsRef.current);
    let raf = 0, prev = performance.now(), shown = 0, saved = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.25, (now - prev) / 1000); prev = now;
      potsRef.current = potsRef.current.map(p => grow(p, dt));
      if (now - shown > 66) { shown = now; setPots(potsRef.current); }   // ~15 updates a second, eased by CSS
      if (now - saved > 3000) { saved = now; save(potsRef.current); }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const keep = () => save(potsRef.current);
    window.addEventListener("pagehide", keep);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pagehide", keep); keep(); };
  }, []);

  useEffect(() => {
    const stop = () => { pouring.current = false; };
    const putDown = (e: KeyboardEvent) => { if (e.key === "Escape") setTool(null); };
    window.addEventListener("pointerup", stop);
    window.addEventListener("keydown", putDown);
    return () => { window.removeEventListener("pointerup", stop); window.removeEventListener("keydown", putDown); };
  }, []);

  /** Uses the tool on one pot (at most every 300ms while sweeping) and drops a few bits into it. */
  function use(i: number) {
    if (!tool) return;
    const now = Date.now();
    if (now - last.current[i] < 300) return;
    last.current[i] = now;
    potsRef.current = potsRef.current.map((p, j) => j !== i ? p : tool === "water" ? { ...p, h: Math.min(1, p.h + .5) } : { ...p, f: FEED_SECONDS });
    setPots(potsRef.current);
    const kind = tool === "water" ? "drop" : "grain";
    const made = [0, 1, 2, 3].map(k => ({ id: ++bitId.current, pot: i, x: 30 + k * 13 + Math.round(Math.random() * 6), kind }) as Bit);
    setBits(b => [...b, ...made]);
    window.setTimeout(() => setBits(b => b.filter(x => !made.includes(x))), 900);
  }

  function replant() { potsRef.current = fresh(); setPots(potsRef.current); save(potsRef.current); }

  const bloomed = pots.filter(p => p.g >= 1).length;
  const thirsty = pots.filter(p => p.g < 1 && p.h <= 0).length;
  const hint = tool === "water" ? "Click a pot, or hold and sweep across them. Damp soil keeps it growing."
    : tool === "feed" ? "Manure doubles the growth for a minute."
    : bloomed === POTS.length ? "All in bloom. Tap a flower to see it in the library."
    : thirsty ? `${thirsty} ${thirsty === 1 ? "pot is" : "pots are"} thirsty. Pick up the can.`
    : "Growing. Your garden is saved, so come back to see it bloom.";

  return <figure className={"pot tray" + (tool ? " is-holding" : "")}>
    <div className="tray-bar">
      <div className="tray-tools" role="group" aria-label="Garden tools">
        <button type="button" className={"tray-tool" + (tool === "water" ? " is-on" : "")} onClick={() => setTool(t => t === "water" ? null : "water")} aria-pressed={tool === "water"}>
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M9 8h8a2 2 0 0 1 2 2v6a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3v-6a2 2 0 0 1 2-2Z" fill="currentColor" /><path d="M7 12 2.5 8.5l-1 1.3L6 14Z" fill="currentColor" /><path d="M11 8V6.5a2.5 2.5 0 0 1 5 0V8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          Water
        </button>
        <button type="button" className={"tray-tool is-feed" + (tool === "feed" ? " is-on" : "")} onClick={() => setTool(t => t === "feed" ? null : "feed")} aria-pressed={tool === "feed"}>
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M7 6h10l1.4 13a2 2 0 0 1-2 2.2H7.6a2 2 0 0 1-2-2.2Z" fill="currentColor" /><path d="M7 6l2-3h6l2 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
          Manure
        </button>
      </div>
      <span className="tray-count" aria-live="polite">{bloomed}/{POTS.length} in bloom</span>
    </div>

    <div className="tray-box" style={tool ? { cursor: tool === "water" ? CAN_CURSOR : FEED_CURSOR } : undefined} onPointerLeave={() => { pouring.current = false; }}>
      {POTS.map(([name, glaze, rim], i) => {
        const { g, h, f } = pots[i];
        const stem = ramp(g, .04, .8), leafA = ramp(g, .22, .42), leafB = ramp(g, .4, .6), bud = ramp(g, .72, .86) * (1 - ramp(g, .88, .97)), open = ramp(g, .86, 1);
        const stage = stageOf(g);
        const art = <>
          <span className="tray-plant" style={{ height: `${6 + stem * 50}px` }}>
            <svg className="tray-stem" viewBox="0 0 40 80" preserveAspectRatio="none" aria-hidden="true" style={{ opacity: g > .04 ? 1 : 0 }}>
              <path d="M20 80C19 60 21 40 20 4" stroke="#4f9a3f" strokeWidth="3" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="tray-leaf" style={{ bottom: "34%", transform: `rotate(-28deg) scale(${leafA})` }} />
            <span className="tray-leaf is-right" style={{ bottom: "58%", transform: `rotate(28deg) scale(${leafB})` }} />
            <span className="tray-bud" style={{ transform: `translate(-50%,-50%) scale(${bud})` }} />
            <span className="tray-bloom" style={{ transform: `translate(-50%,-55%) scale(${open})`, opacity: open > 0 ? 1 : 0 }}><Botanical name={name} size={50} title="" /></span>
          </span>
          <svg className="tray-pot" viewBox="0 0 64 50" aria-hidden="true">
            <ellipse cx="32" cy="8" rx="25" ry="5" fill="#7a5240" />
            <ellipse cx="32" cy="8" rx="25" ry="5" fill="#3e2619" style={{ opacity: h, transition: "opacity .8s ease" }} />
            {g <= .06 && <ellipse cx="32" cy="7" rx="4" ry="2.4" fill="#a8794f" />}
            {f > 0 && <g fill="#8a6342" opacity=".9"><circle cx="22" cy="8" r="1.1" /><circle cx="40" cy="7" r="1.2" /><circle cx="30" cy="9" r=".9" /></g>}
            <path d="M9 12h46l-5.4 32.4A5 5 0 0 1 44.7 48.6H19.3a5 5 0 0 1-4.9-4.2Z" fill={glaze} />
            <rect x="5" y="4" width="54" height="10" rx="4" fill={rim} />
            <path d="M14 22c10 2 26 2 36 0" stroke="#fff" strokeOpacity=".3" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <span className="tray-name">{name}</span>
          <span className="tray-progress" aria-hidden="true"><i style={{ width: `${Math.round(g * 100)}%` }} /></span>
          <span className={"tray-thirst" + (g < 1 && h <= 0 && g > 0 ? " is-on" : "")} aria-hidden="true">thirsty</span>
          {bits.filter(b => b.pot === i).map(b => <i key={b.id} className={b.kind === "drop" ? "tray-drop" : "tray-grain"} style={{ left: `${b.x}%` }} aria-hidden="true" />)}
        </>;
        const label = `${name}, ${stage}${g < 1 ? `, ${Math.round(g * 100)}% grown${h <= 0 ? ", thirsty" : ""}` : ""}`;
        return tool
          ? <button key={name} type="button" className="tray-cell" aria-label={`${tool === "water" ? "Water" : "Feed"} the ${label}`}
              onPointerDown={e => { e.preventDefault(); pouring.current = true; use(i); }}
              onPointerEnter={() => { if (pouring.current) use(i); }}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); use(i); } }}>{art}</button>
          : <a key={name} className="tray-cell" href={`/flowers#${name}`} aria-label={`${label}: open in the flower library`}>{art}</a>;
      })}
    </div>

    <figcaption className="tray-caption">
      <span>{hint}</span>
      {pots.some(p => p.g > 0) && !tool && <button type="button" className="tray-reset" onClick={replant}>Replant</button>}
    </figcaption>
  </figure>;
}
