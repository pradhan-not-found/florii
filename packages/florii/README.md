<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/pradhan-not-found/florii@main/.github/assets/banner.svg" alt="florii — make the web bloom. Hand-painted flower components for React." width="100%" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/florii"><img alt="npm version" src="https://img.shields.io/npm/v/florii?style=flat-square&color=131316&labelColor=f4f4f2&label=npm" /></a>
  <a href="https://www.npmjs.com/package/florii"><img alt="npm downloads" src="https://img.shields.io/npm/dm/florii?style=flat-square&color=131316&labelColor=f4f4f2&label=downloads" /></a>
  <a href="https://github.com/pradhan-not-found/florii/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-131316?style=flat-square&labelColor=f4f4f2" /></a>
  <a href="https://github.com/pradhan-not-found/florii/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/pradhan-not-found/florii?style=flat-square&color=131316&labelColor=f4f4f2" /></a>
</p>

<p align="center">
  <b>36 hand-painted botanicals and 7 decorations, as typed and animated SVG components for React.</b><br />
  Recolor them, set them swaying, and plant them anywhere a page feels a little empty.
</p>

<p align="center">
  <a href="https://floriii.vercel.app">Website</a> ·
  <a href="https://floriii.vercel.app/flowers">Browse the flowers</a> ·
  <a href="https://floriii.vercel.app/docs">Docs</a> ·
  <a href="https://github.com/pradhan-not-found/florii">GitHub</a>
</p>

<br />

## 🌱 Install

```sh
npm install florii
```

<sub>Also works with <code>pnpm add florii</code>, <code>yarn add florii</code> and <code>bun add florii</code>. Needs React 18.2 or 19.</sub>

## 🌷 Plant your first flower

Import the stylesheet once, in your root layout or entry file:

```tsx
import "florii/styles.css";
```

Then use any flower as a component:

```tsx
import { Tulip, Sunflower } from "florii";

export function Hero() {
  return (
    <header>
      <Tulip size={96} animate="sway" />
      <h1>Spring collection</h1>
      <Sunflower size={72} animate="bloom" color="#f5a623" />
    </header>
  );
}
```

Every flower is also available through one component, which is handy when the name comes from data:

```tsx
import { Botanical } from "florii";

<Botanical name="Hibiscus" size={120} animate="float" />;
```

## 🌼 The garden

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/pradhan-not-found/florii@main/.github/assets/flowers.svg" alt="All 36 florii botanicals: daisy, tulip, rose, sunflower, poppy, cherry blossom, lotus, lavender, daffodil, cosmos, marigold, anemone, hibiscus, dahlia, peony, forget-me-not, plumeria, lily, bluebell, hydrangea, iris, camellia, zinnia, orchid, carnation, magnolia, pansy, protea, little leaf, fern, monstera, olive sprig, winding vine, butterfly, mushroom and lucky clover." width="100%" />
</p>

## 🔗 Not using React?

Every flower is also a plain SVG link. Drop it into any page, email, Notion doc or slide:

```html
<img src="https://floriii.vercel.app/f/tulip.svg?color=%23e94a78&size=96" alt="Tulip" width="96" height="96" />
```

Add `color`, `secondary`, `size` or `variant=filled` to the link.

## 🪴 Decorations

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/pradhan-not-found/florii@main/.github/assets/decorations.svg" alt="florii decorations: flower corner, divider, vine border, flower wreath and flower garland." width="100%" />
</p>

```tsx
import { FlowerCorner, BotanicalDivider, VineBorder, FlowerWreath, FlowerGarland, Petals, LeafConfetti } from "florii";

<BotanicalDivider size={420} />
<FlowerCorner size={96} position="bottom-right" />
<Petals size="100%" count={18} effect="falling" />
```

## 🎛 Props

| Prop          | Type                                          | Default    | What it does                                          |
| ------------- | --------------------------------------------- | ---------- | ----------------------------------------------------- |
| `size`        | `number \| string`                            | `120`      | Width and height. Numbers are pixels.                 |
| `color`       | `string`                                      | per flower | The main color. Any CSS color works.                  |
| `secondaryColor` | `string`                                   | per flower | Centers, stems and leaves.                            |
| `variant`     | `"doodle" \| "filled"`                        | `"doodle"` | Painted with a soft grain, or clean flat pastels.     |
| `animate`     | `"none" \| "sway" \| "bloom" \| "float" \| "rotate" \| "pulse" \| "fall"` | `"none"` | A gentle CSS animation. |
| `speed`       | `number`                                      | `4`        | Seconds per animation cycle.                          |
| `interactive` | `boolean`                                     | `false`    | Animate only on hover or keyboard focus.              |
| `title`       | `string`                                      | the name   | Accessible label. Pass `""` for purely decorative art. |

## 🌻 Why florii

- **Light.** No dependencies beyond React. Motion is plain CSS.
- **Sharp.** Every flower is SVG, so it stays crisp at any size and on any screen.
- **Yours.** One prop repaints a flower to match your brand.
- **Kind.** All motion stops for visitors who prefer reduced motion, and every flower has an accessible label.
- **Typed.** Full TypeScript declarations ship with the package.

## 🐝 Contributing

New flowers, gentler animations and small fixes are all welcome. Each botanical is original artwork drawn from simple SVG shapes on a 240 × 240 grid in [`packages/florii/src`](https://github.com/pradhan-not-found/florii/tree/main/packages/florii/src).

```sh
git clone https://github.com/pradhan-not-found/florii.git
cd florii && npm install
npm run dev              # the website, at http://localhost:3000
npm run package:build    # the library, into packages/florii/dist
```

Read the [contribution guide](https://github.com/pradhan-not-found/florii/blob/main/CONTRIBUTING.md), then open a pull request with a preview of your change. Ideas and bugs go in [issues](https://github.com/pradhan-not-found/florii/issues).

## 🌸 License

Code and artwork are released under the [MIT License](https://github.com/pradhan-not-found/florii/blob/main/LICENSE). Use them in personal and commercial work.

<p align="center">
  <br />
  <sub>planted with care. the flowers did most of the work.</sub>
</p>
