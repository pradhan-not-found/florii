# Florii

Original botanical React components for adding a little bloom to an interface. Florii includes 36 SVG botanicals, five decorative compositions, and six CSS animation presets. Colors, size, and animation speed are configurable. TypeScript declarations are included.

## Installation

```sh
npm install florii
```

Also works with `pnpm add florii`, `yarn add florii` and `bun add florii`. React 18.2 or 19 is a peer dependency. This package ships ESM.

## Usage

Import the stylesheet once in your application entry point. In a Next.js App Router app, put that CSS import in `app/layout.tsx`.

```tsx
import "florii/styles.css";
import { Daisy, Botanical } from "florii";

export function Garden() {
  return (
    <div>
      <Daisy size={72} color="#c98264" animate="sway" speed={4} />
      <Botanical name="Tulip" size={64} title="A peach tulip" />
    </div>
  );
}
```

## Botanicals

Each component can be imported by name:

`Daisy`, `Tulip`, `Rose`, `Sunflower`, `Poppy`, `CherryBlossom`, `Lotus`, `Lavender`, `Daffodil`, `Cosmos`, `Marigold`, `Anemone`, `Leaf`, `Fern`, `Monstera`, `Sprig`, `Vine`, `Butterfly`, `Mushroom`, and `Clover`.

Use `Botanical` with its `name` prop to choose one dynamically. `botanicalCatalog` exposes the catalog, and `animationPresets` exposes available animation choices. Types include `BotanicalProps`, `BotanicalName`, `AnimationPreset`, `BotanicalCategory`, and `BotanicalItem`.

| Prop | Purpose |
| --- | --- |
| `size` | A number in pixels or a CSS size string. |
| `color` | Primary flower or foliage color. |
| `secondaryColor` | A complementary color for secondary details. |
| `animate` | `none`, `bloom`, `sway`, `float`, `rotate`, `pulse`, or `fall`. |
| `speed` | Animation duration in seconds. |
| `interactive` | Play animation on hover or keyboard focus instead of continuously. |
| `title` | Accessible description; use an empty string for decorative artwork. |
| `className`, `style` | Integrate with your own layout and styling. |

Omitting `title` uses the component's default accessible name. Pass `title=""` for decorative artwork when nearby text already provides the meaning. Animation styles respect the visitor's reduced-motion preference.

## Decorations

The package also exports `FlowerCorner`, `BotanicalDivider`, `VineBorder`, `Petals`, and `LeafConfetti`.

```tsx
import { BotanicalDivider, FlowerCorner, Petals } from "florii";

export function BloomingCard() {
  return (
    <section style={{ position: "relative", padding: 32 }}>
      <FlowerCorner position="top-right" size={90} color="#c98264" title="" style={{ position: "absolute", top: 0, right: 0 }} />
      <h2>A little room to grow</h2>
      <BotanicalDivider direction="horizontal" color="#c98264" title="" />
      <Petals count={8} effect="floating" size={160} speed={8} title="" />
    </section>
  );
}
```

`FlowerCorner` accepts `top-left`, `top-right`, `bottom-left`, or `bottom-right` to orient the artwork; use ordinary CSS to place it within a layout. `BotanicalDivider` and `VineBorder` accept `horizontal` or `vertical` direction. `Petals` and `LeafConfetti` accept `count` and an `effect` of `falling` or `floating`; particles remain bounded by their decorative area. Set their `animate` prop to `none` to keep particles still.

## Development and licensing

Run `node packages/florii/build.mjs` from the repository root to generate JavaScript, declarations, source maps, and the stylesheet in `dist/`. `npm pack ./packages/florii` rebuilds through the `prepack` script. The package requires no runtime animation dependency beyond React.

Original code and original botanical SVG artwork are MIT licensed. You may use and modify them in personal or commercial projects under the included license. Contributions must be original or compatible with this license; do not copy third-party icon packs or trace copyrighted illustrations.
