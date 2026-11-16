"use client";

import { useRef, useState } from "react";
import { projectLinks } from "@/config/project";
import { Icon } from "./icons";
import styles from "./sponsor-bed.module.css";

const amounts = [10, 25, 50, 100];

/** Foliage clumps along the branch: where the clump sits, its size, and the logo spots inside it (offsets from the centre). */
const clumps: { x: number; y: number; scale: number; spots: [number, number][] }[] = [
  { x: 205, y: 205, scale: 0.72, spots: [[-50, -6], [52, 14]] },
  { x: 445, y: 158, scale: 0.8, spots: [[-52, -16], [52, 8]] },
  { x: 685, y: 112, scale: 0.74, spots: [[-50, 4], [50, -18]] },
  { x: 905, y: 72, scale: 0.66, spots: [[-48, 10], [48, -12]] },
];
const SPOT = 34;

/** Overlapping blobs that make one painted clump of foliage: [dx, dy, r, fill]. */
const blobs: [number, number, number, string][] = [
  [0, 0, 92, "#2f9160"], [-70, 18, 66, "#3fa34d"], [72, 22, 64, "#3fa34d"],
  [-36, -50, 64, "#4cad3b"], [40, -54, 62, "#58b23f"], [0, 46, 64, "#2f9160"],
];

/** Twigs from the main branch up into each clump. */
const twigs = clumps.map(c => `M${c.x - 6} ${branchY(c.x) + 4} C${c.x - 4} ${c.y + 60} ${c.x + 2} ${c.y + 30} ${c.x} ${c.y}`);
function branchY(x: number) { return 330 - x * 0.19; }

/** Builds a checkout link on the configured platform, preselecting the amount where supported. */
function checkoutLink(amount: number, monthly: boolean): string {
  if (!projectLinks.sponsor) return "";
  const url = new URL(projectLinks.sponsor);
  if (url.hostname.endsWith("opencollective.com")) {
    url.pathname = url.pathname.replace(/\/$/, "") + "/donate";
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("interval", monthly ? "month" : "oneTime");
  } else if (url.hostname === "github.com" && url.pathname.startsWith("/sponsors/")) {
    url.pathname = url.pathname.replace(/\/$/, "") + "/sponsorships";
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("frequency", monthly ? "recurring" : "one-time");
  } else {
    url.searchParams.set("amount", String(amount));
  }
  return url.href;
}

/** Sponsor tree on the landing page. Every round spot in the canopy holds a logo; clicking one opens checkout. */
export function SponsorBed() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(true);
  const total = custom ? Math.max(1, Math.floor(Number(custom)) || 0) : amount;
  const href = checkoutLink(total, monthly);
  const open = () => dialog.current?.showModal();

  return <section className={`section ${styles.section}`} id="sponsors" aria-labelledby="sponsors-title">
    <div className={`container ${styles.heading}`}>
      <div><h2 id="sponsors-title">Our sponsors</h2><p>The people and teams who keep florii growing. Pick a spot on the tree to add your logo.</p></div>
      <button type="button" className={`btn btn-dark ${styles.cta}`} onClick={open}>Become a sponsor <Icon name="arrow" size={15} /></button>
    </div>

    <svg className={styles.tree} viewBox="0 0 1000 400" preserveAspectRatio="xMinYMid meet" role="group" aria-label="Sponsor tree">
      <defs>
        <filter id="tree-paint" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="6" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="8" xChannelSelector="R" yChannelSelector="G" result="paint" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="12" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.25" result="speckle" />
          <feComposite in="paint" in2="speckle" operator="in" />
        </filter>
        <filter id="spot-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0b3d1e" floodOpacity=".14" /></filter>
      </defs>
      <g filter="url(#tree-paint)">
        <path fill="#8a5630" d="M-30 300 C200 268 520 214 990 112 L994 122 C540 234 220 300 -30 340Z" />
        {twigs.map((d, index) => <path key={index} d={d} fill="none" stroke="#8a5630" strokeWidth="8" strokeLinecap="round" />)}
        {clumps.map((clump, index) => <g key={index} transform={`translate(${clump.x} ${clump.y}) scale(${clump.scale})`}>
          {blobs.map(([dx, dy, r, fill], k) => <circle key={k} cx={dx} cy={dy} r={r} fill={fill} />)}
        </g>)}
      </g>
      {clumps.flatMap((clump, c) => clump.spots.map(([dx, dy], k) => {
        const cx = clump.x + dx * clump.scale, cy = clump.y + dy * clump.scale, n = c * 2 + k + 1;
        return <g key={n} className={styles.spot} role="button" tabIndex={0} aria-label={"Sponsor spot " + n + ", open checkout"} onClick={open} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } }}>
          <circle cx={cx} cy={cy} r={SPOT} filter="url(#spot-shadow)" />
          <text x={cx} y={cy - 2} className={styles.spotPlus}>+</text>
          <text x={cx} y={cy + 15} className={styles.spotLabel}>Your logo</text>
        </g>;
      }))}
    </svg>

    <dialog ref={dialog} className="checkout" aria-labelledby="checkout-title" onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="checkout-body">
        <button className="checkout-close" onClick={() => dialog.current?.close()} aria-label="Close">×</button>
        <h3 id="checkout-title">Sponsor florii</h3>
        <p>Your logo grows on the tree, and your support funds new flowers.</p>
        <div className="segmented" role="group" aria-label="Frequency">
          <button aria-pressed={monthly} onClick={() => setMonthly(true)}>Monthly</button>
          <button aria-pressed={!monthly} onClick={() => setMonthly(false)}>One-time</button>
        </div>
        <div className="amounts" role="group" aria-label="Amount">
          {amounts.map(value => <button key={value} aria-pressed={!custom && amount === value} onClick={() => { setAmount(value); setCustom(""); }}>${value}</button>)}
          <label className="custom-amount"><span>$</span><input inputMode="numeric" placeholder="Other" value={custom} onChange={event => setCustom(event.target.value.replace(/[^0-9]/g, ""))} aria-label="Custom amount in dollars" /></label>
        </div>
        {href
          ? <a className="btn btn-dark checkout-go" href={href} target="_blank" rel="noreferrer">Continue to checkout · ${total}{monthly ? " / month" : ""} <Icon name="external" size={14} /></a>
          : <button className="btn btn-dark checkout-go" disabled>Checkout unavailable</button>}
        <p className="checkout-note">{href ? "Continue to the sponsorship provider to complete your payment." : "Sponsorships aren't open yet. Check back soon."}</p>
      </div>
    </dialog>
  </section>;
}
