"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Botanical } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";
import { projectLinks } from "@/config/project";
import { Garden } from "./garden";
import { Icon } from "./icons";
import { useCopy } from "./copy";
import { FlowerPreview } from "./flower-preview";
import s from "../home.module.css";

/** A flower set into a line of large text, like a sticker on the page. */
function Sticker({ name, turn = 6 }: { name: BotanicalName; turn?: number }) {
  return <span className={s.sticker} style={{ rotate: turn + "deg" }} aria-hidden="true"><Botanical name={name} size="100%" title="" /></span>;
}

const github = projectLinks.github;

/** A soft, complete cloud built from overlapping circles. */
function Cloud({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 240 120"><g fill="#ffffff"><circle cx="72" cy="76" r="34" /><circle cx="122" cy="60" r="46" /><circle cx="170" cy="74" r="36" /><rect x="34" y="72" width="172" height="36" rx="18" /></g></svg>;
}

/** An inline flower with its name; seamless with prose, click to preview/download SVG. */
function Chip({
  name,
  children,
  onClick,
  color,
  secondaryColor,
}: {
  name: BotanicalName;
  children: string;
  onClick?: () => void;
  color?: string;
  secondaryColor?: string;
}) {
  return (
    <span
      className={s.chip}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      title={`Click to preview, customize, or download ${name} SVG`}
    >
      <span className={s.chipIcon} aria-hidden="true">
        <Botanical name={name} size={18} color={color} secondaryColor={secondaryColor} animate="sway" speed={4} title="" />
      </span>
      <span className={s.chipText}>{children}</span>
    </span>
  );
}

export function Hero() {
  const { copy, toast } = useCopy();
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<BotanicalName | null>(null);
  return <>
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.backdrop} aria-hidden="true">
        <span className={`${s.blur} ${s.blurA}`} />
        <span className={`${s.blur} ${s.blurB}`} />
        <span className={`${s.blur} ${s.blurC}`} />
        <Cloud className={`${s.cloud} ${s.cloudA}`} />
        <Cloud className={`${s.cloud} ${s.cloudB}`} />
        <Cloud className={`${s.cloud} ${s.cloudC}`} />
      </div>
      <span className={s.tag}><span className={s.stack} aria-hidden="true">{people.slice(0, 4).map(person => <Avatar key={person.name} person={person} className={s.stackAvatar} />)}</span>built by developers everywhere</span>
      <h1 id="hero-title">make the web bloom.</h1>
      <p className={s.lede}>
        hand-painted flowers for react. drop a&nbsp;<Chip name="CherryBlossom" onClick={() => setSelected("Daisy")}>daisy</Chip> into a&nbsp;hero,
        a&nbsp;<Chip name="Tulip" onClick={() => setSelected("Tulip")}>tulip</Chip> into an&nbsp;empty state, or&nbsp;a&nbsp;<Chip name="Sunflower" onClick={() => setSelected("Sunflower")}>sunflower</Chip> into
        a&nbsp;loading screen. they sway, bloom and wear your colors.
      </p>
      <div className={s.actions}>
        <button className={`${s.installCommand} ${copied ? s.isCopied : ""}`} onClick={() => { copy("npm i florii@latest", "Install command copied"); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }} aria-label={copied ? "Copied" : "Copy npm install command"}><code>npm i florii@latest</code><span className={s.copyIcon} key={copied ? "done" : "idle"}><Icon name={copied ? "check" : "copy"} size={17} /></span></button>
        <a className={`${s.btn} ${s.wash}`} href="/flowers">browse the flowers <Icon name="arrow" size={16} /></a>
      </div>
      <p className={s.hint}>free forever. one npm install, nothing else to add.</p>
      <Garden height={320} plants={42} className={`${s.field} ${s.fieldWide}`} />
    <Garden height={210} plants={16} density={0.6} className={`${s.field} ${s.fieldPhone}`} />
    </section>
    {selected && <FlowerPreview key={selected} name={selected} onClose={() => setSelected(null)} />}
    {toast}
  </>;
}

export function Statement() {
  return <section className={`${s.wrap} ${s.say}`} aria-label="What florii is">
    <p className={s.statement}>
      florii is a little box of <Sticker name="Poppy" /> flowers for your interface. pick one,
      paint it your <Sticker name="ForgetMeNot" turn={-6} /> colors, set it swaying, and plant it
      anywhere a page feels a bit <Sticker name="Sprig" turn={10} /> empty.
    </p>
  </section>;
}

const uses: { name: BotanicalName; title: string; text: string }[] = [
  { name: "Daisy", title: "hero sections", text: "frame a headline with a few swaying stems." },
  { name: "Sprig", title: "empty states", text: "make a blank screen feel friendly instead of broken." },
  { name: "Mushroom", title: "404 pages", text: "soften a dead end with a small surprise." },
  { name: "Sunflower", title: "loading", text: "a slow spin beats a grey spinner." },
  { name: "Lavender", title: "dividers and borders", text: "break up long pages with a floral rule." },
  { name: "Peony", title: "celebrations", text: "shower petals when an order goes through." },
];

export function Uses() {
  return <section className={`${s.wrap} ${s.block}`} aria-labelledby="uses-title">
    <div className={s.card}>
      <h2 id="uses-title">give every screen a flower.</h2>
      <p className={s.sub}>one component, one job. start with one and plant more as you go.</p>
      <ul className={s.rows}>
        {uses.map(use => <li key={use.title}>
          <span className={s.rowIcon}><Botanical name={use.name} size={40} title="" /></span>
          <span><b>{use.title}</b><span>{use.text}</span></span>
        </li>)}
      </ul>
    </div>
  </section>;
}

const steps: { title: string; text: string; tint: string; name: BotanicalName }[] = [
  { title: "install it", text: "one package from npm. pnpm, yarn and bun work too.", tint: "#fff5bf", name: "Daffodil" },
  { title: "import the styles", text: "add one stylesheet to your root layout, once.", tint: "#ffe7ef", name: "CherryBlossom" },
  { title: "pick a flower", text: "browse all 36, change the color and style to taste.", tint: "#e2f3ff", name: "ForgetMeNot" },
  { title: "plant it", text: "drop the component anywhere. it sways on its own.", tint: "#eef8c6", name: "Clover" },
];

export function Steps() {
  return <section className={`${s.wrap} ${s.block}`} aria-labelledby="steps-title">
    <h2 id="steps-title" className={s.narrow}>from npm install to a blooming page in about a minute.</h2>
    <ol className={s.steps}>
      {steps.map((step, index) => <li key={step.title} style={{ background: step.tint }}>
        <span className={s.stepNo}>{index + 1}</span>
        <span className={s.stepArt} aria-hidden="true"><Botanical name={step.name} size={64} title="" /></span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </li>)}
    </ol>
    <a className={s.go} href="/docs">read the docs <Icon name="arrow" size={16} /></a>
  </section>;
}

const questions: [string, string][] = [
  ["is florii really free?", "yes. code and artwork are mit licensed, for personal and commercial work. no account, no limits."],
  ["does it work with next.js?", "yes, and with any react 18 or 19 app: next.js, vite, remix, and astro islands."],
  ["can i change the colors?", "every flower takes a color and a secondary color, so it can match any brand."],
  ["will the animations slow my site down?", "no. motion is plain css, each flower is painted once and then moved, and everything stops for visitors who prefer reduced motion."],
  ["can i use the flowers outside react?", "yes. every flower downloads as a standalone svg from the flowers page."],
  ["can i add a flower of my own?", "please do. draw an original one and send it in on github. the contribution guide shows how."],
];

const whiteField: BotanicalName[] = ["Daisy", "Tulip", "CherryBlossom", "Cosmos", "Poppy", "ForgetMeNot"];

export function Faq() {
  return <section className={`${s.wrap} ${s.faq} ${s.block}`} aria-labelledby="faq-title">
    <div className={s.faqSide}>
      <h2 id="faq-title">questions.</h2>
      <p>stuck on something else? {github ? <a href={github + "/issues"} target="_blank" rel="noreferrer">open an issue on github</a> : "open an issue on github once the repo is live"}.</p>
      <div className={s.faqArt} aria-hidden="true"><Garden height={300} plants={9} density={0.55} heads={whiteField} taper /></div>
    </div>
    <div className={s.faqList}>
      {questions.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
    </div>
  </section>;
}

export function End() {
  return <section className={s.end} aria-labelledby="end-title">
    <div className={s.endText}>
      <h2 id="end-title" className={s.mega}>plant your first flower.</h2>
      <p>it takes about a minute. free for every project.</p>
      <div className={s.actions}>
        <a className={`${s.btn} ${s.dark}`} href="/docs">get started <Icon name="arrow" size={16} /></a>
        <a className={`${s.btn} ${s.light}`} href="/flowers">browse the flowers</a>
      </div>
    </div>
    <Garden height={150} plants={14} kind="lawn" className={s.endGarden} />
  </section>;
}

const people: { name: string; role: string; flower: BotanicalName; hair: string; skin: string; shirt: string }[] = [
  { name: "ana", role: "frontend · lisbon", flower: "Daisy", hair: "#3b2a22", skin: "#e8b48f", shirt: "#8fd0ff" },
  { name: "kenji", role: "design engineer · tokyo", flower: "Tulip", hair: "#1d1d22", skin: "#d9a07a", shirt: "#ffd36b" },
  { name: "maya", role: "react · nairobi", flower: "Peony", hair: "#6b3a1f", skin: "#8a5a3c", shirt: "#ffb3c8" },
  { name: "leo", role: "open source · berlin", flower: "Lily", hair: "#c9a36b", skin: "#f1c7a5", shirt: "#b9f0a8" },
  { name: "priya", role: "full stack · bengaluru", flower: "Lavender", hair: "#2a1b14", skin: "#b57a55", shirt: "#c9b8ff" },
  { name: "sam", role: "maintainer · toronto", flower: "ForgetMeNot", hair: "#4a3328", skin: "#f3d2b3", shirt: "#ffc9a8" },
];

function Avatar({ person, className = s.avatar }: { person: typeof people[number]; className?: string }) {
  return <svg className={className} viewBox="0 0 120 120" role="img" aria-label={person.name + ", " + person.role}>
    <circle cx="60" cy="60" r="58" fill="#f5fbff" />
    <path d="M18 120c4-24 20-36 42-36s38 12 42 36" fill={person.shirt} />
    <rect x="50" y="78" width="20" height="18" rx="6" fill={person.skin} />
    <ellipse cx="60" cy="54" rx="23" ry="26" fill={person.skin} />
    <path d="M36 52c-2-22 14-32 26-32s26 10 24 32c-4-10-12-14-24-14s-20 4-26 14Z" fill={person.hair} />
    <circle cx="51" cy="56" r="2.6" fill="#1b1f2a" />
    <circle cx="69" cy="56" r="2.6" fill="#1b1f2a" />
    <path d="M52 66q8 6 16 0" stroke="#1b1f2a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <g transform="translate(60 26) scale(.34) translate(-120 -120)"><Botanical name={person.flower} size={240} title="" /></g>
  </svg>;
}

export function Developers() {
  return <section className={`${s.wrap} ${s.block}`} aria-labelledby="devs-title">
    <h2 id="devs-title" className={s.narrow}>built with florii by developers everywhere.</h2>
    <ul className={s.people}>
      {people.map(person => <li key={person.name}>
        <Avatar person={person} />
        <b>{person.name}</b>
        <span>{person.role}</span>
      </li>)}
    </ul>
  </section>;
}
