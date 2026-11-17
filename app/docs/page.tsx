"use client";

import { useState } from "react";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";
import { Icon } from "../components/icons";
import { useCopy } from "../components/copy";
import { UseCases } from "../components/landing-sections";
import { Botanical } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";
import { FlowerPreview } from "../components/flower-preview";
import s from "./docs.module.css";

const managers = { npm: "npm install florii", pnpm: "pnpm add florii", yarn: "yarn add florii", bun: "bun add florii" } as const;
type Manager = keyof typeof managers;

export default function DocsPage() {
  const { copy, toast } = useCopy();
  const [manager, setManager] = useState<Manager>("npm");
  const [selected, setSelected] = useState<BotanicalName | null>(null);
  return <>
    <SiteHeader />
    <main className={s.page}>
      <section className={s.hero} aria-labelledby="docs-title">
        <span className={s.eyebrow}>the florii handbook</span>
        <h1 id="docs-title">a little code.<br />a little bloom.</h1>
        <p>Everything you need to bring hand-painted flowers to your React app. Start small, make it yours, and let it grow.</p>
        <div className={s.cmdBar}>
          <span className={s.cmdCode}><span>$</span> npm i florii@latest</span>
          <button className={s.cmdCopy} onClick={() => copy("npm i florii@latest", "Install command copied")} aria-label="Copy install command"><Icon name="copy" size={15} /></button>
          <span className={s.cmdDivider} />
          <a className={s.cmdGithub} href="https://github.com/pradhan-not-found/florii" target="_blank" rel="noreferrer" aria-label="View on GitHub"><Icon name="github" size={17} /></a>
        </div>
        <div className={s.links}><a href="#quickstart">quick start <Icon name="arrow" size={15} /></a><a href="#props">props reference</a></div>
      </section>
      <section className="container docs-page" aria-labelledby="docs-title">
        <div className="section-head" id="quickstart"><div><span className={s.eyebrow}>01 / getting started</span><h2>from install to bloom.</h2><p>Three small steps. Your first flower is just a few lines away.</p></div></div>
        <div className="docs">
          <ol className="steps">
            <li>
              <span className="step-no">1</span>
              <div><h3>Install the package</h3>
                <div className="tabs" role="tablist" aria-label="Package manager">{(Object.keys(managers) as Manager[]).map(key => <button key={key} role="tab" aria-selected={manager === key} onClick={() => setManager(key)}>{key}</button>)}</div>
                <div className="code-line"><code>{managers[manager]}</code><button onClick={() => copy(managers[manager], "Install command copied")} aria-label="Copy install command"><Icon name="copy" size={14} /></button></div>
              </div>
            </li>
            <li>
              <span className="step-no">2</span>
              <div><h3>Import the styles once</h3><p>Add this to your root layout or entry file.</p>
                <div className="code-line"><code>import &quot;florii/styles.css&quot;;</code><button onClick={() => copy('import "florii/styles.css";', "Import copied")} aria-label="Copy styles import"><Icon name="copy" size={14} /></button></div>
              </div>
            </li>
            <li>
              <span className="step-no">3</span>
              <div><h3>Plant a flower</h3><p>Every flower is a named export. <a className="inline-link" href="/flowers">Pick one</a> or start here.</p>
                <div className="code-line"><code>{'<Tulip animate="sway" />'}</code><button onClick={() => copy('import { Tulip } from "florii";\n\n<Tulip animate="sway" />', "Example copied")} aria-label="Copy example"><Icon name="copy" size={14} /></button></div>
              </div>
            </li>
          </ol>
          <div className="props-card" id="props">
            <h3>make it yours.</h3>
            <table>
              <thead><tr><th scope="col">prop</th><th scope="col">type</th><th scope="col">what it does</th></tr></thead>
              <tbody>
                <tr><td><code>variant</code></td><td><code>&quot;doodle&quot; | &quot;filled&quot;</code></td><td>Painted, vivid look (default) or clean flat pastels.</td></tr>
                <tr><td><code>color</code></td><td><code>string</code></td><td>Main color.</td></tr>
                <tr><td><code>size</code></td><td><code>number | string</code></td><td>Width and height. Default 120.</td></tr>
                <tr><td><code>animate</code></td><td><code>&quot;sway&quot; | &quot;bloom&quot; | …</code></td><td>bloom, sway, float, rotate, pulse, fall.</td></tr>
                <tr><td><code>speed</code></td><td><code>number</code></td><td>Seconds per animation cycle.</td></tr>
                <tr><td><code>interactive</code></td><td><code>boolean</code></td><td>Animate only on hover or focus.</td></tr>
              </tbody>
            </table>
            <p className="note"><Icon name="check" size={13} /> Respects reduced-motion preferences.</p>
          </div>
        </div>
      </section>
      <UseCases copy={copy} />
    </main>
    <GardenFooter />
    {selected && <FlowerPreview key={selected} name={selected} onClose={() => setSelected(null)} />}
    {toast}
  </>;
}
