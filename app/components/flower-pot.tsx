"use client";

import { useEffect, useRef, useState } from "react";
import { Botanical } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";

/** name, position across the pot (%), stalk height (px), bloom size (px), lean (deg) */
const PLANTS: [BotanicalName, number, number, number, number][] = [
  ["Tulip", 18, 150, 96, -12],
  ["Rose", 34, 210, 104, -5],
  ["Sunflower", 50, 262, 124, 0],
  ["Lavender", 66, 200, 92, 6],
  ["Daisy", 82, 148, 96, 13],
];

/**
 * A small potted garden. The flowers start a little thirsty; water them and they lift and bloom.
 * Hover a flower for its name, click it to open it in the flower library.
 */
export function FlowerPot() {
  const [watered, setWatered] = useState(false);
  const [pouring, setPouring] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setWatered(true);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  function water() {
    if (pouring) return;
    setPouring(true);
    timers.current.push(window.setTimeout(() => setWatered(true), 900));
    timers.current.push(window.setTimeout(() => setPouring(false), 2000));
  }

  return <figure className={"pot" + (watered ? " is-watered" : "") + (pouring ? " is-pouring" : "")}>
    <div className="pot-stage">
      {/* the watering can tips over the pot while it pours */}
      <svg className="pot-can" viewBox="0 0 120 90" aria-hidden="true">
        <g transform="translate(120 0) scale(-1 1)">
        <path d="M30 34h46a6 6 0 0 1 6 6v30a12 12 0 0 1-12 12H36a12 12 0 0 1-12-12V40a6 6 0 0 1 6-6Z" fill="#7aa7c7" />
        <path d="M82 46 108 26l6 5-26 26Z" fill="#6b98b8" />
        <rect x="104" y="20" width="14" height="10" rx="3" transform="rotate(-38 111 25)" fill="#5d8aab" />
        <path d="M38 34V24a16 16 0 0 1 32 0v10" fill="none" stroke="#5d8aab" strokeWidth="6" strokeLinecap="round" />
        <path d="M32 44h44" stroke="#9cc0d9" strokeWidth="3" strokeLinecap="round" opacity=".6" />
        </g>
      </svg>
      <span className="pot-rain" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ left: `${22 + i * 7}%`, animationDelay: `${(i % 3) * 0.12 + i * 0.05}s` }} />)}</span>

      {PLANTS.map(([name, x, height, size, lean], i) => <a key={name} className="pot-plant" href={`/flowers#${name}`} style={{ left: `${x}%`, "--h": `${height}px`, "--lean": `${lean}deg`, "--delay": `${i * 0.14}s` } as React.CSSProperties} aria-label={`${name}: open in the flower library`}>
        <svg className="pot-stem" viewBox={`0 0 40 ${height}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={`M20 ${height}C${20 + lean * 0.4} ${height * 0.62} ${20 - lean * 0.3} ${height * 0.3} 20 2`} stroke="#4f9a3f" strokeWidth="3.4" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="pot-leaf" style={{ bottom: `${height * 0.32}px` }} aria-hidden="true" />
        <span className="pot-leaf is-right" style={{ bottom: `${height * 0.55}px` }} aria-hidden="true" />
        <span className="pot-bloom"><Botanical name={name} size={size} title="" /></span>
        <span className="pot-name">{name}</span>
      </a>)}

      {/* terracotta pot with soil */}
      <svg className="pot-body" viewBox="0 0 300 150" aria-hidden="true">
        <defs>
          <linearGradient id="pot-clay" x1="0" x2="1"><stop offset="0" stopColor="#b8623d" /><stop offset=".45" stopColor="#d9825b" /><stop offset="1" stopColor="#a9552f" /></linearGradient>
          <linearGradient id="pot-rim" x1="0" x2="1"><stop offset="0" stopColor="#c96f47" /><stop offset=".5" stopColor="#e39a73" /><stop offset="1" stopColor="#bf6440" /></linearGradient>
        </defs>
        <ellipse className="pot-soil" cx="150" cy="22" rx="128" ry="16" />
        <path d="M30 34h240l-26 104a14 14 0 0 1-13.6 10.6H69.6A14 14 0 0 1 56 138Z" fill="url(#pot-clay)" />
        <rect x="16" y="16" width="268" height="26" rx="9" fill="url(#pot-rim)" />
        <path d="M44 62c40 6 172 6 212 0" stroke="#f0b392" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".35" />
      </svg>
    </div>
    <figcaption className="pot-caption">
      <button type="button" className="pot-water" onClick={water} disabled={pouring}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z" /></svg>
        {pouring ? "Watering…" : watered ? "Water again" : "Water the garden"}
      </button>
      <span>{watered ? "Tap a flower to see it in the library." : "They look a little thirsty."}</span>
    </figcaption>
  </figure>;
}
