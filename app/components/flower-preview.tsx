"use client";

import { useEffect, useRef, useState } from "react";
import { Botanical } from "@/packages/florii/src";
import type { BotanicalName, BotanicalVariant } from "@/packages/florii/src";
import { Icon } from "./icons";
import { useCopy } from "./copy";
import s from "./flower-preview.module.css";

export function FlowerPreview({ name, variant = "doodle", onClose }: { name: BotanicalName; variant?: BotanicalVariant; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(130);
  const [background, setBackground] = useState("#ffffff");
  const [motion, setMotion] = useState(true);
  const [dynamic, setDynamic] = useState(false);
  const { copy, toast } = useCopy();
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, []);
  const code = `import { ${dynamic ? "Botanical" : name} } from "florii";\nimport "florii/styles.css";\n\n<${dynamic ? "Botanical" : name}${dynamic ? `\n  name="${name}"` : ""}\n  size={${size}}${variant === "filled" ? '\n  variant="filled"' : ""}${motion ? '\n  animate="sway"' : ""}\n/>`;
  function download() {
    const svg = art.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.removeAttribute("class");
    clone.removeAttribute("style");
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
    const link = document.createElement("a");
    link.href = url; link.download = `florii-${name.toLowerCase()}.svg`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <dialog ref={dialog} className={s.dialog} aria-labelledby="flower-preview-title" onClose={onClose} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
    <div className={s.body}>
      <header className={s.heading}><h2 id="flower-preview-title">{name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}</h2><button className={s.close} onClick={() => dialog.current?.close()} aria-label="Close preview">×</button></header>
      <div ref={art} className={s.preview} style={{ background }}><Botanical name={name} size={size} variant={variant} animate={motion ? "sway" : "none"} title={name} /></div>
      <label className={s.size}>size<input type="range" min="48" max="200" value={size} onChange={event => setSize(Number(event.target.value))} /><output>{size}px</output></label>
      <div className={s.controls}><div className={s.backgrounds} role="group" aria-label="Preview background"><span>background</span>{["#ffffff", "#19191d", "#fff3c7", "#dcecff"].map(color => <button key={color} style={{ background: color }} aria-label={`Background ${color}`} aria-pressed={background === color} onClick={() => setBackground(color)} />)}</div><label className={s.motion}>motion<input type="checkbox" role="switch" checked={motion} onChange={event => setMotion(event.target.checked)} /></label></div>
      <div className={s.usage}><h3>Usage</h3><button className={s.downloadBtn} onClick={download}><Icon name="download" size={14} /> Download SVG</button></div>
      <div className={s.code}><div className={s.codeBar}><div role="group" aria-label="Import style"><button aria-pressed={!dynamic} onClick={() => setDynamic(false)}>Direct Import</button><button aria-pressed={dynamic} onClick={() => setDynamic(true)}>Dynamic</button></div><button onClick={() => copy(code, "Code copied")} aria-label="Copy preview code">Copy code</button></div><pre><code>{code}</code></pre></div>
      <p className={s.note}>background is preview only · svg downloads are static</p>
      {toast}
    </div>
  </dialog>;
}
