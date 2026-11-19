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

// how a seed becomes a flower: like a real one, it takes a couple of days of care
const HOUR = 3600;
const GROW_SECONDS = 40 * HOUR; // damp-soil time from seed to full bloom (about two days with regular watering)
const DRY_SECONDS = 10 * HOUR;  // a full watering keeps the soil damp this long
const FEED_SECONDS = 6 * HOUR;  // manure doubles the growth rate for this long
const COOKIE = "florii-garden";

type Pot = { g: number; h: number; f: number }; // growth 0–1, soil moisture 0–1, seconds of manure left
type Tool = "water" | "feed" | null;
const fresh = (): Pot[] => POTS.map(() => ({ g: 0, h: 0, f: 0 }));

/**
 * Advances one pot by `dt` seconds, exactly, however long it was: it grows only while the soil is damp
 * (faster when the soil is wetter), and twice as fast while manure lasts.
 */
function grow(p: Pot, dt: number): Pot {
  let { g, h, f } = p;
  while (dt > 0 && g < 1) {
    if (h <= 0) { f = Math.max(0, f - dt); break; }
    const s = Math.min(dt, h * DRY_SECONDS, f > 0 ? f : Infinity); // until the soil dries or the manure runs out
    const damp = 0.35 * s + 0.65 * (h * s - (s * s) / (2 * DRY_SECONDS)); // ∫ (0.35 + 0.65·moisture) dt
    g = Math.min(1, g + (damp / GROW_SECONDS) * (f > 0 ? 2 : 1));
    h = Math.max(0, h - s / DRY_SECONDS);
    f = Math.max(0, f - s);
    dt -= s;
  }
  return { g, h, f };
}

function load(): Pot[] {
  try {
    const raw = document.cookie.split("; ").find(c => c.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1);
    if (!raw) return fresh();
    const { at, pots } = JSON.parse(decodeURIComponent(raw)) as { at: number; pots: [number, number, number][] };
    // the time you were away counts too, for as long as the soil stayed damp
    const away = Math.min(30 * 86400, Math.max(0, (Date.now() - at) / 1000));
    return POTS.map((_, i) => grow({ g: pots[i]?.[0] ?? 0, h: pots[i]?.[1] ?? 0, f: pots[i]?.[2] ?? 0 }, away));
  } catch { return fresh(); }
}
function save(pots: Pot[]) {
  try {
    const value = encodeURIComponent(JSON.stringify({ at: Date.now(), pots: pots.map(p => [+p.g.toFixed(4), +p.h.toFixed(3), Math.round(p.f)]) }));
    document.cookie = `${COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  } catch { /* cookies blocked: the garden just won't be remembered */ }
}

/** Where on a pot the cursor is: the tip of the can's spout. */
const spot = (e: React.PointerEvent<HTMLElement>) => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, h: r.height }; };

const stageOf = (g: number) => g >= 1 ? "in bloom" : g > .82 ? "budding" : g > .45 ? "growing" : g > .06 ? "sprouting" : "seed";
const ramp = (g: number, a: number, b: number) => Math.min(1, Math.max(0, (g - a) / (b - a)));

const cursor = (svg: string, x: number, y: number) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") ${x} ${y}, pointer`;
const CAN_CURSOR = cursor('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g transform="rotate(-24 20 20)"><path d="M16 14h14a3 3 0 0 1 3 3v11a5 5 0 0 1-5 5H18a5 5 0 0 1-5-5V17a3 3 0 0 1 3-3Z" fill="#7aa7c7" stroke="#3d6a8a" stroke-width="1.4"/><path d="M13 20 4 13l-1.6 2.2 8.6 8Z" fill="#6b98b8" stroke="#3d6a8a" stroke-width="1.2" stroke-linejoin="round"/><path d="M19 14v-3a4 4 0 0 1 8 0v3" fill="none" stroke="#3d6a8a" stroke-width="2.2" stroke-linecap="round"/></g></svg>', 4, 30);
const FEED_CURSOR = cursor('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g transform="rotate(-28 20 20)"><path d="M12 10h16l2 22a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3Z" fill="#c9a27a" stroke="#6e4f33" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 10l3-4h10l3 4" fill="#b58c63" stroke="#6e4f33" stroke-width="1.4" stroke-linejoin="round"/><circle cx="20" cy="22" r="4" fill="#7a5a3a"/></g></svg>', 6, 32);

type Bit = { id: number; pot: number; x: number; y: number; fall: number; kind: "drop" | "grain" };

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
  function use(i: number, at?: { x: number; y: number; h: number }) {
    if (!tool) return;
    const now = Date.now();
    if (now - last.current[i] < 300) return;
    last.current[i] = now;
    potsRef.current = potsRef.current.map((p, j) => j !== i ? p : tool === "water" ? { ...p, h: Math.min(1, p.h + .5) } : { ...p, f: FEED_SECONDS });
    setPots(potsRef.current);
    const kind = tool === "water" ? "drop" : "grain";
    // the stream leaves the spout (the cursor's tip) and lands on the soil
    const from = at ?? { x: 70, y: 10, h: 150 };
    const soil = from.h - 74;
    const made = Array.from({ length: kind === "drop" ? 7 : 5 }, (_, k) => ({ id: ++bitId.current, pot: i, kind,
      x: from.x + (Math.random() - .5) * 8, y: from.y + k * 2, fall: Math.max(12, soil - from.y + (Math.random() - .5) * 10) }) as Bit);
    setBits(b => [...b, ...made]);
    window.setTimeout(() => setBits(b => b.filter(x => !made.includes(x))), 900);
  }

  function replant() { potsRef.current = fresh(); setPots(potsRef.current); save(potsRef.current); }

  const bloomed = pots.filter(p => p.g >= 1).length;
  const thirsty = pots.filter(p => p.g < 1 && p.h <= 0).length;
  const hint = tool === "water" ? "Click a pot, or hold and sweep across them. A good soak keeps it growing for hours."
    : tool === "feed" ? "Manure doubles the growth for six hours."
    : bloomed === POTS.length ? "All in bloom. Tap a flower to see it in the library."
    : thirsty ? `${thirsty} ${thirsty === 1 ? "pot is" : "pots are"} thirsty. Pick up the can.`
    : "Growing. A flower takes about two days of care, and your garden is saved, so come back tomorrow.";

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
            <path d="M9 12h46l-5.4 32.4A5 5 0 0 1 44.7 48.6H19.3a5 5 0 0 1-4.9-4.2Z" fill={glaze} />
            <rect x="5" y="4" width="54" height="10" rx="4" fill={rim} />
            {/* the soil sits in the rim's opening: dry, then darker when watered, with the seed until it sprouts */}
            <ellipse cx="32" cy="6.5" rx="22" ry="3.6" fill="#8a5d45" />
            <ellipse cx="32" cy="6.5" rx="22" ry="3.6" fill="#3e2619" style={{ opacity: h, transition: "opacity .8s ease" }} />
            {g <= .06 && <><ellipse cx="32" cy="5.4" rx="3.6" ry="2.2" fill="#c9a06a" /><path d="M30.6 4.8c.8-.6 2-.6 2.8 0" stroke="#e3c08d" strokeWidth=".7" fill="none" strokeLinecap="round" /></>}
            {f > 0 && <g fill="#c9a27a"><circle cx="22" cy="6.6" r="1.1" /><circle cx="41" cy="6" r="1.2" /><circle cx="27" cy="7.6" r=".9" /><circle cx="37" cy="7.4" r=".9" /></g>}
            <path d="M14 22c10 2 26 2 36 0" stroke="#fff" strokeOpacity=".3" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <span className="tray-name">{name}</span>
          <span className="tray-progress" aria-hidden="true"><i style={{ width: `${Math.round(g * 100)}%` }} /></span>
          <span className={"tray-thirst" + (g < 1 && h <= 0 && g > 0 ? " is-on" : "")} aria-hidden="true">thirsty</span>
          {bits.filter(b => b.pot === i).map((b, k) => <i key={b.id} className={b.kind === "drop" ? "tray-drop" : "tray-grain"} style={{ left: b.x, top: b.y, "--fall": `${b.fall}px`, animationDelay: `${(k % 7) * 40}ms` } as React.CSSProperties} aria-hidden="true" />)}
        </>;
        const label = `${name}, ${stage}${g < 1 ? `, ${Math.round(g * 100)}% grown${h <= 0 ? ", thirsty" : ""}` : ""}`;
        return tool
          ? <button key={name} type="button" className="tray-cell" aria-label={`${tool === "water" ? "Water" : "Feed"} the ${label}`}
              onPointerDown={e => { e.preventDefault(); pouring.current = true; use(i, spot(e)); }}
              onPointerMove={e => { if (pouring.current) use(i, spot(e)); }}
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
