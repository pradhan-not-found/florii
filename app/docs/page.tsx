"use client";

import { useState } from "react";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";
import { Icon } from "../components/icons";
import { useCopy } from "../components/copy";
import { UseCases } from "../components/landing-sections";

const managers = { npm: "npm install florii", pnpm: "pnpm add florii", yarn: "yarn add florii", bun: "bun add florii" } as const;
type Manager = keyof typeof managers;

export default function DocsPage() {
  const { copy, toast } = useCopy();
  const [manager, setManager] = useState<Manager>("npm");
  return <>
    <SiteHeader />
    <main>
      <section className="container docs-page" aria-labelledby="docs-title">
        <div className="section-head"><div><h1 id="docs-title">Get started</h1><p>Three steps from install to bloom.</p></div></div>
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
              <div><h3>Plant a flower</h3><p>Every flower is a named export. <a className="inline-link" href="/flowers/">Pick one</a> or start here.</p>
                <div className="code-line"><code>{'<Tulip animate="sway" />'}</code><button onClick={() => copy('import { Tulip } from "florii";\n\n<Tulip animate="sway" />', "Example copied")} aria-label="Copy example"><Icon name="copy" size={14} /></button></div>
              </div>
            </li>
          </ol>
          <div className="props-card">
            <h3>Props</h3>
            <table>
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
    {toast}
  </>;
}
