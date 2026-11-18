/**
 * Plain-text guides for AI assistants and answer engines (the llms.txt convention).
 * Built from the real catalog, so they stay correct as flowers are added.
 */
import { animationPresets, botanicalCatalog } from "@/packages/florii/src";

export const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://floriii.vercel.app").replace(/\/$/, "");
const repo = "https://github.com/pradhan-not-found/florii";
const npm = "https://www.npmjs.com/package/florii";

const flowers = botanicalCatalog.filter(item => item.category === "flower");
const others = botanicalCatalog.filter(item => item.category !== "flower");
const decorations: [string, string][] = [
  ["FlowerCorner", "A cluster of flowers for a corner of a card or section. `position`: top-left, top-right, bottom-left, bottom-right."],
  ["BotanicalDivider", "A thin floral line to separate sections. `direction`: horizontal or vertical."],
  ["VineBorder", "A climbing vine for the edge of a layout. `direction`: horizontal or vertical."],
  ["FlowerWreath", "A round wreath to frame an avatar, badge or number."],
  ["FlowerGarland", "Draped swags of flowers across the top of a page."],
  ["Petals", "Petals drifting down the page. `count`, `effect`: falling or floating."],
  ["LeafConfetti", "Leaves floating across a section."],
];

export const summary = "florii is a free, open-source (MIT) library of hand-painted flower illustrations for React. Each flower is a small SVG component you can recolor, resize and animate with CSS, or download as a standalone SVG.";

export function llmsTxt() {
  return `# florii

> ${summary}

florii is made for websites that want warmth without heavy images: landing pages, portfolios, wedding and event sites, gift pages, empty states, and anywhere a little nature helps. It works with any React 18 or 19 app, including Next.js, Vite, Remix and Astro islands. There are ${flowers.length} flowers, ${others.length} leaves and nature pieces, and ${decorations.length} decorations.

## Docs

- [Documentation](${site}/docs): install, import the styles, and use a flower. Full props reference.
- [Flower library](${site}/flowers): every flower and decoration, with live recoloring, copyable code and SVG downloads.
- [Full reference for AI assistants](${site}/llms-full.txt): every component, prop and flower in one plain-text file.

## Use it

- [Install from npm](${npm}): \`npm install florii\`
- [Source on GitHub](${repo}): code and artwork, MIT licensed.
- [Send a bouquet](${site}/gift): a free tool to make a hand-painted bouquet and letter and share it as a link.

## Optional

- [About the design](${site}/about): how the flowers are painted and built.
- [Sponsor](${site}/sponsor): support florii and get your product listed.
- [Privacy](${site}/privacy): what the website collects.
`;
}

export function llmsFullTxt() {
  return `# florii: full reference

> ${summary}

Website: ${site}
npm: ${npm}
Source: ${repo}
License: MIT, for personal and commercial use. No account, no limits, no attribution required.

## Install

\`\`\`sh
npm install florii      # or: pnpm add florii / yarn add florii / bun add florii
\`\`\`

Import the stylesheet once, for example in your root layout:

\`\`\`tsx
import "florii/styles.css";
\`\`\`

## Use a flower

\`\`\`tsx
import { Sunflower, Rose, FlowerCorner } from "florii";

export function Hero() {
  return <>
    <Sunflower size={96} animate="sway" />
    <Rose size={64} color="#e94a78" title="" />
    <FlowerCorner position="bottom-right" size={220} />
  </>;
}
\`\`\`

Every flower is also available through one component: \`<Botanical name="Peony" />\`.

## Props (every flower and decoration)

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| size | number or string | 120 | Width and height. A number is pixels; a string can be any CSS length. |
| color | string | the flower's own color | Main color, any CSS color. |
| secondaryColor | string | the flower's own accent | Accent color: centers, leaves, stems. |
| animate | ${animationPresets.map(a => `"${a}"`).join(" \\| ")} \\| "none" | "none" | A CSS animation preset. |
| speed | number | 4 | Seconds for one animation cycle. |
| interactive | boolean | false | Play the animation only on hover or keyboard focus. |
| variant | "doodle" \\| "filled" | "doodle" | "doodle" is painted with a light grain; "filled" is clean and flat. |
| title | string | the flower's name | Accessible name. Pass "" for purely decorative art. |
| className, style | | | Passed to the SVG. |

Animations are plain CSS, run on the compositor, and stop automatically for people who prefer reduced motion.

## Flowers

${flowers.map(f => `- **${f.name}** (\`<${f.id} />\`): ${f.description}`).join("\n")}

## Leaves and nature

${others.map(f => `- **${f.name}** (\`<${f.id} />\`): ${f.description}`).join("\n")}

## Decorations

${decorations.map(([name, text]) => `- **${name}** (\`<${name} />\`): ${text}`).join("\n")}

## Frequently asked

- **Is florii free?** Yes. Code and artwork are MIT licensed for personal and commercial work.
- **Does it work with Next.js?** Yes, and with any React 18 or 19 app (Vite, Remix, Astro islands). Components render on the server and the client.
- **Can I change the colors?** Yes. Every flower takes \`color\` and \`secondaryColor\`.
- **Will the animations slow my site down?** No. Each flower is painted once and moved with CSS; motion stops for reduced-motion users.
- **Can I use the flowers without React?** Yes. Download any flower as a standalone SVG from ${site}/flowers.
- **Can I contribute a flower?** Yes. Draw an original one and open a pull request on GitHub.

## Send a bouquet

${site}/gift is a free tool built with florii. Pick up to 15 flowers, choose a wrapping paper, write a letter of up to 1000 characters with a postage stamp, and share it as a short link (the gift is packed into the link; nothing is stored) or download it as a card.
`;
}
