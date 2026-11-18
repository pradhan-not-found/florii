"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Botanical } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";

const REACH = 150;      // px around the pointer that reacts
const MAX_BEND = 0.7;   // radians a blade leans away at the pointer
const EASE = 0.1;       // how quickly things settle toward their target each frame

const hash = (n: number) => { let h = Math.imul(n + 0x9e3779b9, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

const backGreens = ["#2f7d32", "#3a8f2f", "#2a6e2c", "#3f9a36"];
const frontGreens = ["#4cad3b", "#5fbf45", "#3f9e35", "#76c84f", "#58b23f"];

type Blade = { fx: number; h: number; w: number; lean: number; fill: string; phase: number; speed: number; bend: number };

function makeBlades(count: number, minH: number, maxH: number, greens: string[], salt: number): Blade[] {
  return Array.from({ length: count }, (_, i) => {
    const r = (k: number) => hash(i * 13 + salt * 1000 + k);
    return { fx: (i + r(1)) / count, h: minH + r(2) * (maxH - minH), w: 2.6 + r(3) * 3.2, lean: (r(4) - 0.5) * 0.3, fill: greens[Math.floor(r(5) * greens.length)], phase: r(6) * 6.28, speed: 0.9 + r(7) * 0.9, bend: 0 };
  });
}

const meadowHeads: BotanicalName[] = ["Daisy", "Hibiscus", "Poppy", "Dahlia", "Sunflower", "ForgetMeNot", "Cosmos", "Lily", "Anemone", "Peony", "Marigold", "Plumeria", "Daffodil", "CherryBlossom"];
const lawnHeads: BotanicalName[] = ["Mushroom", "Clover", "Fern", "Sprig", "Mushroom", "Leaf", "Clover", "Monstera", "Vine"];

type Plant = { name: BotanicalName; left: number; stem: number; size: number; tilt: number; delay: number };

function makePlants(count: number, minStem: number, maxStem: number, list: BotanicalName[]): Plant[] {
  return Array.from({ length: count }, (_, i) => ({
    name: list[i % list.length],
    left: 3 + ((i + 0.5) / count) * 94,
    stem: minStem + hash(i + 77) * (maxStem - minStem),
    size: 58 + hash(i + 91) * 26,
    tilt: (hash(i + 33) - 0.5) * 16,
    delay: -hash(i + 55) * 5,
  }));
}

const flyers = [
  { size: 44, cx: 0.3, cy: 0.3, ax: 0.26, ay: 0.2, sx: 0.21, sy: 0.47, p: 0.4 },
  { size: 34, cx: 0.68, cy: 0.36, ax: 0.24, ay: 0.24, sx: 0.17, sy: 0.39, p: 2.1 },
  { size: 28, cx: 0.5, cy: 0.22, ax: 0.42, ay: 0.14, sx: 0.12, sy: 0.53, p: 4.2 },
];

function bendFor(distance: number) {
  const amount = Math.max(0, 1 - Math.abs(distance) / REACH);
  return Math.sign(distance || 1) * amount * amount * MAX_BEND;
}

function GardenScene({ height = 320, plants: plantCount = 11, density = 1, kind = "meadow", heads, flowerColor, taper = false, className = "" }: {
  /** Shrinks the grass toward both ends so the garden finishes as a natural tuft instead of a straight cut. */
  taper?: boolean;
  height?: number;
  plants?: number;
  /** Scales the blade count; use below 1 for narrow gardens. */
  density?: number;
  /** "meadow" grows tall flowers on stems; "lawn" keeps short grass with mushrooms, clovers and leaves at ground level. */
  kind?: "meadow" | "lawn";
  /** Override which flowers grow in a meadow. */
  heads?: BotanicalName[];
  /** Paint every flower head in one color, e.g. a field of white blooms. */
  flowerColor?: string;
  className?: string;
}) {
  const lawn = kind === "lawn";
  const back = useMemo(() => makeBlades(Math.round(170 * density), height * 0.32, height * 0.52, backGreens, 1), [density, height]);
  const front = useMemo(() => makeBlades(Math.round(210 * density), height * 0.16, height * 0.36, frontGreens, 2), [density, height]);
  const plants = useMemo(() => lawn ? makePlants(plantCount, 0, 0, heads ?? lawnHeads) : makePlants(plantCount, height * 0.4, height * 0.68, heads ?? meadowHeads), [lawn, plantCount, height, heads]);
  const butterflies = density >= 1 ? flyers : [];

  const root = useRef<HTMLDivElement>(null);
  const backCanvas = useRef<HTMLCanvasElement>(null);
  const frontCanvas = useRef<HTMLCanvasElement>(null);
  const plantRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const flyerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef<number | null>(null);

  useEffect(() => {
    const el = root.current, a = backCanvas.current, b = frontCanvas.current;
    if (!el || !a || !b) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const plantBend = plants.map(() => 0);
    let width = 0, raf = 0, visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = el.clientWidth;
      for (const canvas of [a, b]) { canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0); }
    };

    const draw = (canvas: HTMLCanvasElement, blades: Blade[], time: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const px = pointer.current;
      for (const blade of blades) {
        const x = taper ? 26 + blade.fx * (width - 52) : blade.fx * width;
        const edge = taper ? Math.min(1, Math.min(x, width - x) / 120) : 1;
        const h = blade.h * (0.18 + 0.82 * edge * (2 - edge));
        const target = px === null ? 0 : bendFor(x - px);
        blade.bend += (target - blade.bend) * EASE;
        const angle = blade.lean + Math.sin(time * blade.speed + blade.phase) * 0.07 + blade.bend;
        const tipX = x + Math.sin(angle) * h, tipY = height - Math.cos(angle) * h;
        const midX = x + Math.sin(angle * 0.45) * h * 0.55, midY = height - h * 0.55;
        ctx.beginPath();
        ctx.moveTo(x - blade.w, height);
        ctx.quadraticCurveTo(midX - blade.w * 0.5, midY, tipX, tipY);
        ctx.quadraticCurveTo(midX + blade.w * 0.5, midY, x + blade.w, height);
        ctx.closePath();
        ctx.fillStyle = blade.fill;
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      const time = now / 1000;
      draw(a, back, time);
      draw(b, front, time);
      const px = pointer.current;
      plants.forEach((plant, i) => {
        const target = px === null ? 0 : bendFor(((taper ? 8 + plant.left * 0.84 : plant.left) / 100) * width - px) * 26;
        plantBend[i] += (target - plantBend[i]) * EASE;
        // only touch the DOM when the tilt really changes; idle flowers then cost nothing per frame
        const value = plantBend[i].toFixed(2);
        const node = plantRefs.current[i];
        if (node && node.dataset.bend !== value) { node.dataset.bend = value; node.style.transform = `rotate(${value}deg)`; }
      });
      butterflies.forEach((fly, i) => {
        const node = flyerRefs.current[i];
        if (!node) return;
        const x = (fly.cx + fly.ax * Math.sin(time * fly.sx * 2 + fly.p)) * width;
        const y = (fly.cy + fly.ay * Math.sin(time * fly.sy * 2 + fly.p * 1.7)) * height;
        const heading = Math.cos(time * fly.sx * 2 + fly.p);
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scaleX(${heading})`;
      });
      if (!reduced && visible) raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);
    const sizes = new ResizeObserver(() => { resize(); if (reduced) frame(0); });
    sizes.observe(el);
    const seen = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduced) raf = requestAnimationFrame(frame);
    });
    seen.observe(el);
    return () => { cancelAnimationFrame(raf); sizes.disconnect(); seen.disconnect(); };
  }, [back, front, plants, butterflies, height, taper]);

  const track = (event: PointerEvent<HTMLDivElement>) => { pointer.current = event.clientX - event.currentTarget.getBoundingClientRect().left; };

  return <div ref={root} className={"garden " + className} style={{ height }} onPointerMove={track} onPointerDown={track} onPointerLeave={() => { pointer.current = null; }} aria-hidden="true">
    <canvas ref={backCanvas} className="grass" />
    <div className="plants">
      {plants.map((plant, i) => <span key={i} className="plant" style={{ left: (taper ? 8 + plant.left * 0.84 : plant.left) + "%" }}>
        <span className="plant-bend" ref={node => { plantRefs.current[i] = node; }}>
          <span className="plant-sway" style={{ animationDelay: `${plant.delay}s`, rotate: `${plant.tilt}deg` }}>
            {!lawn && <svg className="stem" width="40" height={plant.stem} viewBox={`0 0 40 ${plant.stem}`}><path d={`M20 ${plant.stem} C${18 + plant.tilt / 3} ${plant.stem * 0.6} ${22 - plant.tilt / 4} ${plant.stem * 0.3} 20 0`} stroke="#3f9a36" strokeWidth="4" strokeLinecap="round" fill="none" /><path d={`M20 ${plant.stem * 0.62} c-14 -4 -20 -14 -18 -24 c12 2 18 10 18 24Z`} fill="#4cad3b" /></svg>}
            <span className={lawn ? "head on-ground" : "head"} style={{ width: plant.size, height: plant.size }}><Botanical name={plant.name} size={plant.size} color={flowerColor} title="" /></span>
          </span>
        </span>
      </span>)}
    </div>
    <canvas ref={frontCanvas} className="grass" />
    {butterflies.map((fly, i) => <span key={i} className="butterfly" ref={node => { flyerRefs.current[i] = node; }}><span className="flap" style={{ animationDelay: `${-i * 0.07}s` }}><Botanical name="Butterfly" size={fly.size} title="" /></span></span>)}
  </div>;
}

type GardenProps = Parameters<typeof GardenScene>[0];

/**
 * Draws the garden only when it is about to be seen. The page's text paints first; gardens far
 * below the screen, or hidden at this screen size, cost nothing until they scroll into view.
 */
export function Garden(props: GardenProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = holder.current;
    if (!el || show) return;
    const seen = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setShow(true); seen.disconnect(); }
    }, { rootMargin: "400px 0px" });
    seen.observe(el);
    return () => seen.disconnect();
  }, [show]);
  if (show) return <div className="garden-fade"><GardenScene {...props} /></div>;
  return <div ref={holder} className={"garden " + (props.className ?? "")} style={{ height: props.height ?? 320 }} aria-hidden="true" />;
}
