"use client";

import { useState } from "react";
import { Botanical, botanicalCatalog, FlowerCorner, BotanicalDivider, VineBorder, Petals, LeafConfetti, FlowerWreath, FlowerGarland } from "@/packages/florii/src";
import type { BotanicalName, BotanicalVariant } from "@/packages/florii/src";
import { FlowerPreview } from "../components/flower-preview";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";
import { Icon } from "../components/icons";
import { useCopy } from "../components/copy";
import d from "../docs/docs.module.css";

type DecorationName = "FlowerCorner" | "BotanicalDivider" | "VineBorder" | "Petals" | "LeafConfetti" | "FlowerWreath" | "FlowerGarland";
const decorations: { id: DecorationName; name: string; description: string }[] = [
  { id: "FlowerCorner", name: "Flower corner", description: "A blooming corner accent." },
  { id: "BotanicalDivider", name: "Divider", description: "A floral section break." },
  { id: "VineBorder", name: "Vine border", description: "A winding edge for cards." },
  { id: "Petals", name: "Petals", description: "Softly falling petals." },
  { id: "LeafConfetti", name: "Leaf confetti", description: "Leaves drifting in the air." },
  { id: "FlowerWreath", name: "Flower wreath", description: "A ring of blooms to frame an avatar." },
  { id: "FlowerGarland", name: "Flower garland", description: "A string of flowers to hang over a header." },
];
const categories = [["all", "All"], ["flower", "Flowers"], ["leaf", "Leaves"], ["nature", "Little things"]] as const;

function DecorationPreview({ id, variant }: { id: DecorationName; variant: BotanicalVariant }) {
  const props = { variant, animate: "sway" as const, speed: 5, interactive: true, title: "" };
  if (id === "FlowerCorner") return <FlowerCorner {...props} size={128} />;
  if (id === "BotanicalDivider") return <BotanicalDivider {...props} size={180} />;
  if (id === "VineBorder") return <VineBorder {...props} size={180} />;
  if (id === "Petals") return <Petals {...props} size={140} count={9} />;
  if (id === "FlowerWreath") return <FlowerWreath {...props} size={130} />;
  if (id === "FlowerGarland") return <FlowerGarland {...props} size={190} />;
  return <LeafConfetti {...props} size={140} count={9} />;
}

const code = (id: string, variant: BotanicalVariant) => `import { ${id} } from "florii";\n\n<${id}${variant === "filled" ? ' variant="filled"' : ""} animate="sway" />`;

/** Saves the card's rendered SVG, paint filter included, as a standalone file. */
function downloadSvg(button: HTMLElement, name: string) {
  const svg = button.closest("article")?.querySelector("svg.florii-botanical");
  if (!svg) return false;
  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "512");
  clone.setAttribute("height", "512");
  clone.removeAttribute("class");
  clone.removeAttribute("style");
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "florii-" + name.toLowerCase() + ".svg";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

export default function FlowersPage() {
  const { copy, toast } = useCopy();
  const [tab, setTab] = useState<"flowers" | "decorations">("flowers");
  const [variant, setVariant] = useState<BotanicalVariant>("doodle");
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BotanicalName | null>(null);
  const needle = query.trim().toLowerCase();
  const flowers = botanicalCatalog.filter(item => (category === "all" || item.category === category) && item.name.toLowerCase().includes(needle));
  const decorationList = decorations.filter(item => item.name.toLowerCase().includes(needle));

  return <>
    <SiteHeader />
    <main className="library-page">
      <div className="library-head">
        <div className={d.hero}><span className={d.eyebrow}>the florii garden</span><h1>every flower,<br />ready to plant.</h1><p>Pick a flower, make it yours, and plant it anywhere. Switch to Flat for clean pastel versions.</p></div>
        <label className="search"><Icon name="search" size={15} /><input type="search" placeholder="Search" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search flowers" /></label>
      </div>

      <div className="library-tabs" role="tablist" aria-label="Collection">
        <button role="tab" aria-selected={tab === "flowers"} onClick={() => setTab("flowers")}>Flowers <span>{botanicalCatalog.length}</span></button>
        <button role="tab" aria-selected={tab === "decorations"} onClick={() => setTab("decorations")}>Decorations <span>{decorations.length}</span></button>
      </div>

      <div className="toolbar">
        {tab === "flowers" ? <div className="segmented" role="group" aria-label="Category">{categories.map(([id, label]) => <button key={id} aria-pressed={category === id} onClick={() => setCategory(id)}>{label}</button>)}</div> : <span />}
        <div className="segmented" role="group" aria-label="Style">{(["doodle", "filled"] as const).map(value => <button key={value} aria-pressed={variant === value} onClick={() => setVariant(value)}>{value === "doodle" ? "Painted" : "Flat"}</button>)}</div>
      </div>

      {tab === "flowers" ? <div className="flower-grid">
        {flowers.map(item => <article key={item.id} className="flower">
          <button className="flower-hit" onClick={() => setSelected(item.id)} aria-label={"Preview " + item.name} />
          <div className="flower-art"><Botanical name={item.id} size={96} variant={variant} animate="sway" speed={4} interactive title="" /></div>
          <div className="flower-meta"><div><h3>{item.name}</h3><code>{"<" + item.id + " />"}</code></div><div className="flower-actions"><button onClick={() => copy(code(item.id, variant), item.name + " code copied")} aria-label={"Copy code for " + item.name} title="Copy code"><Icon name="copy" size={15} /></button><button onClick={event => { if (downloadSvg(event.currentTarget, item.id)) copy("", item.name + " SVG downloaded"); }} aria-label={"Download " + item.name + " as SVG"} title="Download SVG"><Icon name="download" size={15} /></button></div></div>
        </article>)}
        {!flowers.length && <p className="empty">No flowers match “{query}”.</p>}
      </div> : <div className="flower-grid decorations">
        {decorationList.map(item => <article key={item.id} className="flower">
          <button className="flower-hit" onClick={() => copy(code(item.id, variant), item.name + " copied")} aria-label={"Copy code for " + item.name} />
          <div className="flower-art"><DecorationPreview id={item.id} variant={variant} /></div>
          <div className="flower-meta"><div><h3>{item.name}</h3><p>{item.description}</p></div><div className="flower-actions"><button onClick={() => copy(code(item.id, variant), item.name + " code copied")} aria-label={"Copy code for " + item.name} title="Copy code"><Icon name="copy" size={15} /></button>{item.id !== "Petals" && item.id !== "LeafConfetti" && <button onClick={event => { if (downloadSvg(event.currentTarget, item.id)) copy("", item.name + " SVG downloaded"); }} aria-label={"Download " + item.name + " as SVG"} title="Download SVG"><Icon name="download" size={15} /></button>}</div></div>
        </article>)}
        {!decorationList.length && <p className="empty">No decorations match “{query}”.</p>}
      </div>}
    </main>
    <GardenFooter />
    {selected && <FlowerPreview key={selected} name={selected} variant={variant} onClose={() => setSelected(null)} />}
    {toast}
  </>;
}
