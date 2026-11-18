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
const THIRST = 3; // waterings until a pot blooms

// the cursor while the can is held: a small watering can, spout down-left
const CAN_CURSOR = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g transform="rotate(-24 20 20)"><path d="M16 14h14a3 3 0 0 1 3 3v11a5 5 0 0 1-5 5H18a5 5 0 0 1-5-5V17a3 3 0 0 1 3-3Z" fill="#7aa7c7" stroke="#3d6a8a" stroke-width="1.4"/><path d="M13 20 4 13l-1.6 2.2 8.6 8Z" fill="#6b98b8" stroke="#3d6a8a" stroke-width="1.2" stroke-linejoin="round"/><path d="M19 14v-3a4 4 0 0 1 8 0v3" fill="none" stroke="#3d6a8a" stroke-width="2.2" stroke-linecap="round"/></g></svg>')}") 4 30, pointer`;

type Drop = { id: number; pot: number; x: number };

/**
 * A tray of potted seedlings. Pick up the watering can, then click or sweep across the pots to water them;
 * each one grows and blooms after a few waterings. Without the can, a pot opens its flower in the library.
 */
export function FlowerPot() {
  const [water, setWater] = useState<number[]>(() => POTS.map(() => 0));
  const [holding, setHolding] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const pouring = useRef(false);
  const last = useRef<number[]>(POTS.map(() => 0));
  const dropId = useRef(0);

  // reduced motion: everything is already in bloom, nothing to animate
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setWater(POTS.map(() => THIRST));
  }, []);
  useEffect(() => {
    const stop = () => { pouring.current = false; };
    const putDown = (e: KeyboardEvent) => { if (e.key === "Escape") setHolding(false); };
    window.addEventListener("pointerup", stop);
    window.addEventListener("keydown", putDown);
    return () => { window.removeEventListener("pointerup", stop); window.removeEventListener("keydown", putDown); };
  }, []);

  /** Waters one pot (at most every 350ms while sweeping) and lets a few drops fall into it. */
  function pour(i: number) {
    const now = Date.now();
    if (now - last.current[i] < 350) return;
    last.current[i] = now;
    setWater(w => w.map((v, j) => j === i ? Math.min(THIRST, v + 1) : v));
    const fresh = [0, 1, 2].map(k => ({ id: ++dropId.current, pot: i, x: 32 + k * 16 + Math.round(Math.random() * 6) }));
    setDrops(d => [...d, ...fresh]);
    window.setTimeout(() => setDrops(d => d.filter(x => !fresh.includes(x))), 900);
  }

  const bloomed = water.filter(v => v >= THIRST).length;

  return <figure className={"pot tray" + (holding ? " is-holding" : "")}>
    <div className="tray-bar">
      <button type="button" className={"tray-tool" + (holding ? " is-on" : "")} onClick={() => setHolding(h => !h)} aria-pressed={holding}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 8h8a2 2 0 0 1 2 2v6a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3v-6a2 2 0 0 1 2-2Z" fill="currentColor" /><path d="M7 12 2.5 8.5l-1 1.3L6 14Z" fill="currentColor" /><path d="M11 8V6.5a2.5 2.5 0 0 1 5 0V8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        {holding ? "Put the can down" : "Pick up the can"}
      </button>
      <span className="tray-count" aria-live="polite">{bloomed}/{POTS.length} in bloom</span>
    </div>

    <div className="tray-box" style={holding ? { cursor: CAN_CURSOR } : undefined} onPointerLeave={() => { pouring.current = false; }}>
      {POTS.map(([name, glaze, rim], i) => {
        const level = water[i], open = level >= THIRST;
        const art = <>
          <span className="tray-plant" style={{ "--grow": 0.42 + 0.58 * (level / THIRST) } as React.CSSProperties}>
            <svg className="tray-stem" viewBox="0 0 40 80" preserveAspectRatio="none" aria-hidden="true">
              <path d="M20 80C19 60 21 40 20 8" stroke="#4f9a3f" strokeWidth="3" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path d="M20 54C12 49 7 50 4 54C9 59 15 58 20 54Z" fill="#6cb456" />
              <path d="M20 38C28 33 33 34 36 38C31 43 25 42 20 38Z" fill="#5fa94a" />
            </svg>
            <span className={"tray-bloom" + (open ? " is-open" : "")}><Botanical name={name} size={56} title="" /></span>
          </span>
          <svg className="tray-pot" viewBox="0 0 64 50" aria-hidden="true">
            <ellipse cx="32" cy="8" rx="25" ry="5" fill={level ? "#4a2f20" : "#7a5240"} style={{ transition: "fill .6s ease" }} />
            <path d="M9 12h46l-5.4 32.4A5 5 0 0 1 44.7 48.6H19.3a5 5 0 0 1-4.9-4.2Z" fill={glaze} />
            <rect x="5" y="4" width="54" height="10" rx="4" fill={rim} />
            <path d="M14 22c10 2 26 2 36 0" stroke="#fff" strokeOpacity=".3" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <span className="tray-meter" aria-hidden="true">{Array.from({ length: THIRST }, (_, k) => <i key={k} className={k < level ? "is-full" : ""} />)}</span>
          {drops.filter(d => d.pot === i).map(d => <i key={d.id} className="tray-drop" style={{ left: `${d.x}%` }} aria-hidden="true" />)}
          <span className="tray-name">{name}</span>
        </>;
        const label = open ? `${name}, in bloom` : `${name}, watered ${level} of ${THIRST} times`;
        return holding
          ? <button key={name} type="button" className="tray-cell" aria-label={`Water the ${label}`}
              onPointerDown={e => { e.preventDefault(); pouring.current = true; pour(i); }}
              onPointerEnter={() => { if (pouring.current) pour(i); }}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pour(i); } }}>{art}</button>
          : <a key={name} className="tray-cell" href={`/flowers#${name}`} aria-label={`${label}: open in the flower library`}>{art}</a>;
      })}
    </div>

    <figcaption className="tray-caption">
      <span>{holding ? "Click a pot, or hold and sweep across them." : bloomed === POTS.length ? "All in bloom. Tap a flower to see it in the library." : "Pick up the can and water the seedlings."}</span>
      {bloomed > 0 && !holding && <button type="button" className="tray-reset" onClick={() => setWater(POTS.map(() => 0))}>Replant</button>}
    </figcaption>
  </figure>;
}
