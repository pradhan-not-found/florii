"use client";

import { Botanical, botanicalCatalog } from "@/packages/florii/src";

const hash = (n: number) => { let h = Math.imul(n + 0x9e3779b9, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const blooms = botanicalCatalog.filter(item => item.category === "flower" && item.id !== "Lavender" && item.id !== "Bluebell");
const COLS = 14, ROWS = 7, CELL = 1000 / COLS;
const petalColors = ["#f0306a", "#f25c38", "#f5a623", "#f2c230", "#3b6fe0", "#8a55d7", "#ee4b8b", "#ff7a1a"];
const centerColors = ["#f2c230", "#8a4b1e", "#ffd76a", "#c2410c", "#fff1b8"];

/** Small flowers scattered on a grid; they only show through the letters of the wordmark. */
const petals = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS, row = Math.floor(i / COLS);
  const scale = (CELL / 240) * (1.05 + hash(i + 9) * 0.5);
  return {
    name: blooms[Math.floor(hash(i) * blooms.length)].id,
    color: petalColors[Math.floor(hash(i + 11) * petalColors.length)],
    center: centerColors[Math.floor(hash(i + 13) * centerColors.length)],
    x: col * CELL + (row % 2 ? CELL / 2 : 0) + (hash(i + 3) - 0.5) * 14 - (240 * scale - CELL) / 2,
    y: row * CELL + (hash(i + 5) - 0.5) * 14 - (240 * scale - CELL) / 2,
    scale,
    turn: Math.round(hash(i + 7) * 360),
  };
});

export function Wordmark() {
  return <svg className="wordmark" viewBox="0 0 1000 440" role="img" aria-label="florii">
    <defs><filter id="florii-paint" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" result="warp" /><feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" /></filter><clipPath id="florii-letters"><text x="500" y="428" textAnchor="middle" fontSize="575" fontWeight="600" style={{ letterSpacing: "-0.065em" }}>florii</text></clipPath></defs>
    <g clipPath="url(#florii-letters)">
      <rect width="1000" height="440" fill="#0b1f4d" />
      <g filter="url(#florii-paint)">{petals.map((petal, i) => <g key={i} transform={`translate(${petal.x.toFixed(1)} ${petal.y.toFixed(1)}) scale(${petal.scale.toFixed(3)}) rotate(${petal.turn} 120 120)`}><Botanical name={petal.name} size={240} variant="filled" color={petal.color} secondaryColor={petal.center} title="" /></g>)}</g>
    </g>
  </svg>;
}

