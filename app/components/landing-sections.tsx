"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { BotanicalName } from "@/packages/florii/src";
import { Botanical, botanicalCatalog, BotanicalDivider, FlowerCorner, Petals } from "@/packages/florii/src";
import { Icon } from "./icons";

type UseCase = { id: string; label: string; blurb: string; code: string; preview: ReactNode };

const cases: UseCase[] = [
  {
    id: "hero", label: "Hero section", blurb: "Frame a headline with a few swaying flowers.",
    code: `import { Tulip, Daisy } from "florii";\n\n<header className="hero">\n  <Tulip size={96} animate="sway" />\n  <h1>Spring collection</h1>\n  <Daisy size={72} animate="sway" />\n</header>`,
    preview: <div className="mock mock-hero"><Botanical name="Tulip" size={84} animate="sway" title="" /><div><b>Spring collection</b><i /><i className="short" /></div><Botanical name="Daisy" size={64} animate="sway" title="" /></div>,
  },
  {
    id: "empty", label: "Empty state", blurb: "Make a blank screen feel friendly instead of broken.",
    code: `import { Sprig } from "florii";\n\n<div className="empty">\n  <Sprig size={88} animate="sway" />\n  <p>Nothing planted yet</p>\n  <button>Create your first project</button>\n</div>`,
    preview: <div className="mock mock-center"><Botanical name="Sprig" size={80} animate="sway" title="" /><b>Nothing planted yet</b><span className="mock-btn">Create your first project</span></div>,
  },
  {
    id: "404", label: "404 page", blurb: "Soften a dead end with a small surprise.",
    code: `import { Mushroom } from "florii";\n\n<main className="not-found">\n  <h1>4<Mushroom size={72} animate="pulse" />4</h1>\n  <p>This page wandered off.</p>\n</main>`,
    preview: <div className="mock mock-center"><div className="mock-404">4<Botanical name="Mushroom" size={64} animate="pulse" title="" />4</div><b>This page wandered off.</b></div>,
  },
  {
    id: "loading", label: "Loading", blurb: "A spinning flower beats a grey spinner.",
    code: `import { Sunflower } from "florii";\n\n<Sunflower size={56} animate="rotate" speed={3} title="Loading" />`,
    preview: <div className="mock mock-center"><Botanical name="Sunflower" size={64} animate="rotate" speed={3} title="" /><span className="mock-muted">Loading…</span></div>,
  },
  {
    id: "divider", label: "Section divider", blurb: "Break up long pages with a floral rule.",
    code: `import { BotanicalDivider } from "florii";\n\n<BotanicalDivider size={420} />`,
    preview: <div className="mock mock-center"><i /><i className="short" /><BotanicalDivider size={300} title="" /><i /><i className="short" /></div>,
  },
  {
    id: "card", label: "Card corner", blurb: "Tuck a flourish into the corner of a card.",
    code: `import { FlowerCorner } from "florii";\n\n<article className="card" style={{ position: "relative" }}>\n  <FlowerCorner size={96} position="bottom-right"\n    style={{ position: "absolute", right: 0, bottom: 0 }} />\n  …\n</article>`,
    preview: (
      <div className="mock mock-card">
        <span className="mock-tag">Design</span>
        <b>Weekly notes</b>
        <i style={{ width: "88%" }} />
        <i style={{ width: "72%" }} />
        <i className="short" />
        <div className="mock-card-footer">
          <span className="mock-avatar" /><span className="mock-avatar" /><span className="mock-avatar" />
          <span className="mock-pill">3 updates</span>
        </div>
        <span className="mock-corner"><FlowerCorner size={96} position="bottom-right" title="" /></span>
      </div>
    ),
  },
  {
    id: "celebrate", label: "Celebration", blurb: "Shower petals when something good happens.",
    code: `import { Petals } from "florii";\n\n{orderPlaced && <Petals size="100%" count={18} effect="falling" />}`,
    preview: <div className="mock mock-center mock-petals"><span className="mock-rain"><Petals size="100%" count={16} title="" /></span><b>Order placed</b><span className="mock-muted">Thanks for your support</span></div>,
  },
];

/** "Where do you want to use it?" Pick a place, see it live, copy the code. */
export function UseCases({ copy }: { copy: (text: string, label: string) => void }) {
  const [active, setActive] = useState(cases[0].id);
  const current = cases.find(item => item.id === active) ?? cases[0];
  return <section className="container section" aria-labelledby="uses-title">
    <div className="section-head"><div><h2 id="uses-title">Where do you want to use it?</h2><p>Pick a spot. See it live, then copy the code.</p></div></div>
    <div className="chips" role="tablist" aria-label="Use cases">
      {cases.map(item => <button key={item.id} role="tab" aria-selected={active === item.id} onClick={() => setActive(item.id)}>{item.label}</button>)}
    </div>
    <div className="use-panel">
      <div className="use-preview">{current.preview}</div>
      <div className="use-code">
        <p>{current.blurb}</p>
        <pre><code>{current.code}</code></pre>
        <button className="btn btn-ghost" onClick={() => copy(current.code, current.label + " code copied")}><Icon name="copy" size={14} /> Copy code</button>
      </div>
    </div>
  </section>;
}

/** A big flat flower silhouette, cropped by the corner of a card. */
function Corner({ name, color, size, style }: { name: BotanicalName; color: string; size: number; style: CSSProperties }) {
  return <span className="tile-shape" style={style} aria-hidden="true"><Botanical name={name} size={size} variant="filled" color={color} secondaryColor={color} title="" /></span>;
}

const swatches = ["#e5484d", "#f08c2e", "#e8b900", "#3fa34d", "#3b6fe0", "#8a55d7", "#e0559a"];
const motions = ["sway", "bloom", "float", "rotate", "pulse"] as const;
const shelf = botanicalCatalog.filter(item => item.category === "flower");

/** What the library does, shown with the library itself: browse, recolor, animate, decorate. */
export function Bento() {
  const [color, setColor] = useState(swatches[4]);
  const [motion, setMotion] = useState<(typeof motions)[number]>("sway");

  return <section className="container section" aria-labelledby="features-title">
    <div className="section-head"><div><h2 id="features-title">a whole garden in one package.</h2><p>flowers and decorations you can recolor, resize and set in motion.</p></div></div>
    <div className="features">
      <article className="feature f-shelf">
        <Corner name="Daisy" color="#ffd9c9" size={230} style={{ right: -70, top: -90 }} />
        <div className="feature-text"><h3>{botanicalCatalog.length} flowers and counting</h3><p>flowers from around the world, plus leaves, vines and a few small surprises.</p></div>
        <div className="shelf" aria-hidden="true">
          <div className="shelf-track">
            {[...shelf, ...shelf].map((item, index) => <span key={index} className="seed"><Botanical name={item.id} size={72} title="" /><small>{item.name}</small></span>)}
          </div>
        </div>
      </article>

      <article className="feature f-color">
        <Corner name="Fern" color="#ff8a1f" size={230} style={{ right: -40, top: -110, rotate: "160deg" }} />
        <div className="feature-text"><h3>any color you like</h3><p>one prop repaints the whole flower.</p></div>
        <div className="feature-stage"><span className="disc"><Botanical name="Cosmos" size={132} color={color} title="" /></span></div>
        <div className="swatches" role="group" aria-label="Flower color">
          {swatches.map(value => <button key={value} aria-pressed={color === value} aria-label={"Use color " + value} style={{ background: value }} onClick={() => setColor(value)} />)}
        </div>
      </article>

      <article className="feature f-motion">
        <Corner name="Hibiscus" color="#f595bd" size={210} style={{ right: -70, top: -80 }} />
        <div className="feature-text"><h3>motion built in</h3><p>five gentle animations, no extra library.</p></div>
        <div className="feature-stage"><span className="disc"><Botanical key={motion} name="Dahlia" size={124} animate={motion} speed={motion === "rotate" ? 8 : 3} title="" /></span></div>
        <div className="segmented" role="group" aria-label="Animation">
          {motions.map(value => <button key={value} aria-pressed={motion === value} onClick={() => setMotion(value)}>{value}</button>)}
        </div>
      </article>

      <article className="feature f-deco">
        <Corner name="Lily" color="#e4572e" size={240} style={{ right: -70, top: -100, rotate: "20deg" }} />
        <div className="feature-text"><h3>decorations too</h3><p>corners, dividers, borders and falling petals for cards and sections.</p></div>
        <div className="deco-stage" aria-hidden="true">
          <span className="deco-rain"><Petals size="100%" count={12} title="" /></span>
          <BotanicalDivider size={320} title="" />
          <span className="deco-corner"><FlowerCorner size={110} position="bottom-right" title="" /></span>
        </div>
      </article>
    </div>
  </section>;
}
