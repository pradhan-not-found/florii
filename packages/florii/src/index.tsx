import { useId } from "react";
import type { CSSProperties, ReactNode } from "react";

export type BotanicalVariant = "doodle" | "filled";
export type AnimationPreset = "none" | "bloom" | "sway" | "float" | "rotate" | "pulse" | "fall";
export type BotanicalCategory = "flower" | "leaf" | "nature";
export type BotanicalName = "Daisy" | "Tulip" | "Rose" | "Sunflower" | "Poppy" | "CherryBlossom" | "Lotus" | "Lavender" | "Daffodil" | "Cosmos" | "Marigold" | "Anemone" | "Hibiscus" | "Dahlia" | "Peony" | "ForgetMeNot" | "Plumeria" | "Lily" | "Bluebell" | "Hydrangea" | "Iris" | "Camellia" | "Zinnia" | "Orchid" | "Carnation" | "Magnolia" | "Pansy" | "Protea" | "Leaf" | "Fern" | "Monstera" | "Sprig" | "Vine" | "Butterfly" | "Mushroom" | "Clover";

export interface BotanicalProps {
  size?: number | string;
  color?: string;
  secondaryColor?: string;
  /** Duration in seconds for a complete animation cycle. */
  speed?: number;
  animate?: AnimationPreset;
  /** Pause the animation until this illustration is hovered or focused. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Accessible image name. Pass an empty string for decorative artwork. */
  title?: string;
  /** "doodle" paints vivid, hand-cut shapes with a light grain (default). "filled" draws clean, flat pastel shapes. */
  variant?: BotanicalVariant;
}

export interface BotanicalItem {
  id: BotanicalName;
  name: string;
  category: BotanicalCategory;
  color: string;
  secondaryColor: string;
  description: string;
}

export const animationPresets: AnimationPreset[] = ["bloom", "sway", "float", "rotate", "pulse", "fall"];

export const botanicalCatalog: readonly BotanicalItem[] = [
  { id: "Daisy", name: "Daisy", category: "flower", color: "#F2D9AE", secondaryColor: "#D99A48", description: "A sunny center and a soft circle of petals." },
  { id: "Tulip", name: "Tulip", category: "flower", color: "#E9A59B", secondaryColor: "#91A989", description: "Three little petals, reaching for the light." },
  { id: "Rose", name: "Rose", category: "flower", color: "#D9959A", secondaryColor: "#9DAD88", description: "Layered rose petals with a garden-green flourish." },
  { id: "Sunflower", name: "Sunflower", category: "flower", color: "#E8B867", secondaryColor: "#896348", description: "Golden petals with an earthy, dotted center." },
  { id: "Poppy", name: "Poppy", category: "flower", color: "#DB8C78", secondaryColor: "#5D5755", description: "Papery coral petals and a striking dark center." },
  { id: "CherryBlossom", name: "Cherry blossom", category: "flower", color: "#EABBC2", secondaryColor: "#C77983", description: "Five notched petals, like a small spring hello." },
  { id: "Lotus", name: "Lotus", category: "flower", color: "#E5A9AF", secondaryColor: "#A1AF8C", description: "Quiet, overlapping petals above a soft green leaf." },
  { id: "Lavender", name: "Lavender", category: "flower", color: "#B5A2CE", secondaryColor: "#8E9F7B", description: "A fragrant-looking sprig in soft lavender." },
  { id: "Daffodil", name: "Daffodil", category: "flower", color: "#F0DCA3", secondaryColor: "#DFA35E", description: "A golden trumpet, surrounded by six bright petals." },
  { id: "Cosmos", name: "Cosmos", category: "flower", color: "#DCA1AE", secondaryColor: "#D7AB61", description: "Scalloped pink petals with a warm golden heart." },
  { id: "Marigold", name: "Marigold", category: "flower", color: "#E5A061", secondaryColor: "#BC783E", description: "A little pom-pom of abundant apricot petals." },
  { id: "Anemone", name: "Anemone", category: "flower", color: "#C5BAD8", secondaryColor: "#65566D", description: "Pale lilac petals and an inky, textured center." },
  { id: "Hibiscus", name: "Hibiscus", category: "flower", color: "#E58A9C", secondaryColor: "#EBC063", description: "Five broad tropical petals and a long golden stamen." },
  { id: "Dahlia", name: "Dahlia", category: "flower", color: "#DC8FB0", secondaryColor: "#C06A90", description: "Rings of pointed petals, layered like a pom-pom." },
  { id: "Peony", name: "Peony", category: "flower", color: "#EDB2C2", secondaryColor: "#DC8AA2", description: "Soft, ruffled layers around a golden heart." },
  { id: "ForgetMeNot", name: "Forget-me-not", category: "flower", color: "#8FB2EA", secondaryColor: "#F0CF68", description: "Five sky-blue petals with a tiny sunny eye." },
  { id: "Plumeria", name: "Plumeria", category: "flower", color: "#F0A9B8", secondaryColor: "#F2CE6B", description: "A frangipani pinwheel with a warm yellow center." },
  { id: "Lily", name: "Lily", category: "flower", color: "#F0AC7A", secondaryColor: "#A8643A", description: "Six pointed petals and freckled stamens." },
  { id: "Bluebell", name: "Bluebell", category: "flower", color: "#98A4E4", secondaryColor: "#8AA880", description: "Nodding bells along an arching woodland stem." },
  { id: "Hydrangea", name: "Hydrangea", category: "flower", color: "#A3B8EC", secondaryColor: "#BDA8E0", description: "A dome of tiny four-petaled florets." },
  { id: "Iris", name: "Iris", category: "flower", color: "#8C7FE0", secondaryColor: "#F2C94C", description: "Three falls and three standards with a golden beard." },
  { id: "Camellia", name: "Camellia", category: "flower", color: "#E8708A", secondaryColor: "#F5D36B", description: "Round, overlapping petals around a bright boss." },
  { id: "Zinnia", name: "Zinnia", category: "flower", color: "#F08A4B", secondaryColor: "#B8432B", description: "Tidy rings of petals around a dark button center." },
  { id: "Orchid", name: "Orchid", category: "flower", color: "#E3A2D9", secondaryColor: "#B4458E", description: "Wide sepals and a ruffled, deeper-toned lip." },
  { id: "Carnation", name: "Carnation", category: "flower", color: "#F28FA8", secondaryColor: "#E06686", description: "Frilled, serrated petals packed into a cup." },
  { id: "Magnolia", name: "Magnolia", category: "flower", color: "#F6D6E4", secondaryColor: "#C98AA8", description: "Large cupped petals blushing at the base." },
  { id: "Pansy", name: "Pansy", category: "flower", color: "#7A5CC9", secondaryColor: "#F2C94C", description: "A velvet face with a sunny center and dark whiskers." },
  { id: "Protea", name: "Protea", category: "flower", color: "#E8879A", secondaryColor: "#F3D7B0", description: "Pointed bracts cupping a soft, fuzzy crown." },
  { id: "Leaf", name: "Little leaf", category: "leaf", color: "#9AAD8B", secondaryColor: "#657B60", description: "A simple leaf with a gently curved stem." },
  { id: "Fern", name: "Fern", category: "leaf", color: "#90A88C", secondaryColor: "#667F68", description: "A delicate frond with pairs of tapering leaves." },
  { id: "Monstera", name: "Monstera", category: "leaf", color: "#8DA58A", secondaryColor: "#58775B", description: "A broad tropical leaf with sculptural cutouts." },
  { id: "Sprig", name: "Olive sprig", category: "leaf", color: "#9EAD8A", secondaryColor: "#738162", description: "A quiet branch of soft, alternating leaves." },
  { id: "Vine", name: "Winding vine", category: "leaf", color: "#93AA8C", secondaryColor: "#627D61", description: "A climbing stem with a playful leafy rhythm." },
  { id: "Butterfly", name: "Butterfly", category: "nature", color: "#DEAB94", secondaryColor: "#B27869", description: "Scalloped wings and a tiny pair of antennae." },
  { id: "Mushroom", name: "Mushroom", category: "nature", color: "#CA9B81", secondaryColor: "#E8D9BD", description: "A spotted woodland cap on a creamy little stem." },
  { id: "Clover", name: "Lucky clover", category: "nature", color: "#9AAF8B", secondaryColor: "#6F855F", description: "Four heart-shaped leaves for a little extra luck." },
];

const catalogByName = Object.fromEntries(botanicalCatalog.map(item => [item.id, item])) as Record<BotanicalName, BotanicalItem>;
const ring = (count: number) => Array.from({ length: count }, (_, index) => index);
const duration = (speed: number | undefined) => Number.isFinite(speed) ? Math.min(60, Math.max(0.25, speed!)) : 4;
const dimension = (size: number | string | undefined, fallback = 120) => typeof size === "number" ? Math.max(1, size) : size || fallback;

/** Turns a soft pastel into a vivid, saturated paint color of the same hue. */
function vivid(hex: string): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return hex;
  const value = parseInt(match[1], 16);
  const r = (value >> 16 & 255) / 255, g = (value >> 8 & 255) / 255, b = (value & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta) h = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  h = (h * 60 + 360) % 360;
  const l0 = (max + min) / 2;
  const s0 = delta ? delta / (1 - Math.abs(2 * l0 - 1)) : 0;
  const s1 = Math.min(0.92, s0 * 1.9 + 0.12), l1 = Math.max(0.42, Math.min(0.6, l0 - 0.12));
  const c = (1 - Math.abs(2 * l1 - 1)) * s1, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l1 - c / 2;
  const [r1, g1, b1] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return "#" + to(r1) + to(g1) + to(b1);
}


/** Shared doodle plumbing: a class and a painted filter (hand-cut edges with a light gouache grain). */
function useDoodle(variant: BotanicalVariant) {
  const id = "florii-doodle-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  if (variant !== "doodle") return { className: "", filter: null, filterUrl: undefined };
  return {
    className: " florii--doodle",
    filter: <defs><filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="paint" />
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="grain" />
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.25" result="speckle" />
      <feComposite in="paint" in2="speckle" operator="in" />
    </filter></defs>,
    filterUrl: `url(#${id})`,
  };
}

function DaisyArt({ color, secondary }: ArtProps) {
  return <>{ring(12).map(i => <ellipse key={i} cx="120" cy="70" rx="17" ry="37" fill={color} transform={`rotate(${i * 30} 120 120)`} />)}<circle cx="120" cy="120" r="33" fill={secondary} /><circle cx="110" cy="110" r="6" fill="#fff" opacity=".2" />{ring(10).map(i => <circle key={i} cx="120" cy="98" r="2" fill="#8c633f" opacity=".28" transform={`rotate(${i * 36} 120 120)`} />)}</>;
}

type ArtProps = { color: string; secondary: string };

function TulipArt({ color, secondary }: ArtProps) {
  return <><path d="M120 123c-1 31 4 59 0 91" stroke={secondary} strokeWidth="7" strokeLinecap="round" fill="none" /><path d="M118 195C74 192 63 167 59 141c27 1 56 19 59 54Z" fill={secondary} /><path d="M122 180c2-32 22-50 48-62-1 33-13 58-48 62Z" fill={secondary} opacity=".8" /><path d="M70 58c18-1 35 12 50 37 14-26 31-38 50-38 5 40-3 83-50 83S65 97 70 58Z" fill={color} /><path d="M89 61c6-15 17-26 31-34 14 10 25 20 31 35-12 25-20 50-31 64-11-14-20-39-31-65Z" fill={color} /><path d="M120 137c-28-1-44-17-48-47 19 0 35 11 48 47Z" fill="#fff" opacity=".17" /><path d="M120 137c28-1 44-17 48-47-19 0-35 11-48 47Z" fill="#8d4747" opacity=".1" /></>;
}

function RoseArt({ color, secondary }: ArtProps) {
  return <><path d="M118 155v65" stroke={secondary} strokeWidth="6" strokeLinecap="round" /><path d="M118 190c-25 0-44-13-47-36 27-4 43 12 47 36Zm2 17c29-2 46-18 49-42-28 1-46 15-49 42Z" fill={secondary} /><path d="M72 64c-3-22 26-36 48-23 23-14 53 3 50 24 24 2 36 31 18 49 8 29-22 48-43 43-14 19-44 15-53-3-28 6-48-19-39-41-20-22-6-46 19-49Z" fill={color} /><path d="M81 72c15-23 40-23 55-7 23-9 42 12 34 29 13 22-7 46-27 41-15 18-39 11-44-7-23 0-36-27-18-43Z" fill="#fff" opacity=".17" /><path d="M94 81c21-12 41-8 47 11 20 7 20 27 0 36-23 9-45-7-42-25" stroke="#9b525b" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".48" /><path d="M103 95c15-10 31-3 30 9-1 11-11 16-23 9" stroke="#9b525b" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".48" /></>;
}

function SunflowerArt({ color, secondary }: ArtProps) {
  return <>{ring(16).map(i => <path key={i} d="M120 25c-29 27-27 53 0 68 25-17 28-41 0-68Z" fill={color} transform={`rotate(${i * 22.5} 120 120)`} />)}{ring(16).map(i => <path key={i} d="M120 39c-16 19-17 39 0 55 17-16 16-36 0-55Z" fill="#fff" opacity=".14" transform={`rotate(${i * 22.5 + 11.25} 120 120)`} />)}<circle cx="120" cy="120" r="44" fill={secondary} /><circle cx="120" cy="120" r="33" fill="#513b31" opacity=".16" />{ring(12).map(i => <circle key={i} cx="120" cy="91" r="2.7" fill={color} opacity=".6" transform={`rotate(${i * 30} 120 120)`} />)}{ring(7).map(i => <circle key={i} cx="120" cy="106" r="2.5" fill={color} opacity=".5" transform={`rotate(${i * 51.43} 120 120)`} />)}<circle cx="120" cy="120" r="3" fill={color} opacity=".5" /></>;
}

function PoppyArt({ color, secondary }: ArtProps) {
  return <>{ring(4).map(i => <path key={i} d="M120 123C92 119 59 99 59 71c0-28 31-44 50-27 18-19 49-9 51 17 3 26-18 49-40 62Z" fill={color} transform={`rotate(${i * 90 + 18} 120 120)`} />)}{ring(4).map(i => <path key={i} d="M120 119c-15-16-31-34-34-54" stroke="#fff" opacity=".22" strokeWidth="3" strokeLinecap="round" fill="none" transform={`rotate(${i * 90 + 18} 120 120)`} />)}<circle cx="120" cy="120" r="27" fill={secondary} />{ring(14).map(i => <circle key={i} cx="120" cy="87" r="3.6" fill={secondary} transform={`rotate(${i * 25.72} 120 120)`} />)}<circle cx="120" cy="120" r="11" fill="#b5a088" /><path d="M111 117h18m-15-6 12 15m0-15-12 15" stroke={secondary} strokeWidth="1.8" opacity=".6" /></>;
}

function CherryBlossomArt({ color, secondary }: ArtProps) {
  return <>{ring(5).map(i => <path key={i} d="M120 120C93 104 76 65 94 42c8-9 18-10 26 2 8-12 18-11 26-2 18 23 1 62-26 78Z" fill={color} transform={`rotate(${i * 72} 120 120)`} />)}{ring(5).map(i => <g key={i} transform={`rotate(${i * 72} 120 120)`}><path d="M120 120v-33m0 27-13-18m13 18 13-18" fill="none" stroke={secondary} strokeWidth="2" /><circle cx="120" cy="85" r="3" fill={secondary} /><circle cx="106" cy="95" r="2.5" fill={secondary} /><circle cx="134" cy="95" r="2.5" fill={secondary} /></g>)}<circle cx="120" cy="120" r="12" fill={secondary} /><circle cx="117" cy="117" r="4" fill="#f7d8b9" /></>;
}

function LotusArt({ color, secondary }: ArtProps) {
  return <><path d="M31 175c43-31 84-27 89-3 6-25 50-26 89 2-58 33-122 33-178 1Z" fill={secondary} /><path d="M120 170C65 168 32 131 25 96c50-2 88 25 95 74Zm0 0c55-2 88-39 95-74-50-2-88 25-95 74Z" fill={color} /><path d="M120 170C65 148 55 105 65 64c39 17 61 54 55 106Zm0 0c55-22 65-65 55-106-39 17-61 54-55 106Z" fill={color} /><path d="M120 170C85 146 81 81 120 35c39 46 35 111 0 135Z" fill={color} /><path d="M120 166c-22-24-25-75 0-110 25 35 22 86 0 110Z" fill="#fff" opacity=".2" /><path d="M120 164c-23-17-40-43-47-73m47 73c23-17 40-43 47-73" stroke="#a96e7c" strokeWidth="2" fill="none" opacity=".25" /></>;
}

function LavenderArt({ color, secondary }: ArtProps) {
  return <><path d="M105 220c9-59 22-112 20-184" fill="none" stroke={secondary} strokeWidth="5" strokeLinecap="round" /><path d="M111 191c-30-3-46-25-43-46 28 9 39 24 43 46Zm5-28c23-6 39-27 35-49-21 12-32 27-35 49Z" fill={secondary} />{ring(7).map(i => <g key={i} transform={`translate(${i * 1.25} ${i * -16})`}><ellipse cx="112" cy="131" rx="10" ry="16" transform="rotate(-35 112 131)" fill={color} /><ellipse cx="133" cy="125" rx="10" ry="16" transform="rotate(35 133 125)" fill={color} /><ellipse cx="112" cy="127" rx="4" ry="7" transform="rotate(-35 112 127)" fill="#fff" opacity=".16" /></g>)}<ellipse cx="130" cy="24" rx="8" ry="13" fill={color} /></>;
}

function DaffodilArt({ color, secondary }: ArtProps) {
  return <>{ring(6).map(i => <path key={i} d="M120 121c-31-12-41-49-23-76 7-11 17-17 23-21 8 5 20 16 26 28 13 25 2 55-26 69Z" fill={color} transform={`rotate(${i * 60 + 15} 120 120)`} />)}{ring(6).map(i => <path key={i} d="M120 55v49" stroke="#fff" strokeWidth="2" opacity=".35" transform={`rotate(${i * 60 + 15} 120 120)`} />)}<path d="m120 83 14 8 16 1 3 16 8 13-9 14-2 16-17 3-13 8-14-9-16-2-3-16-8-14 9-14 2-16 17-1Z" fill={secondary} /><circle cx="120" cy="121" r="23" fill="#a96e31" opacity=".24" /><circle cx="120" cy="121" r="14" fill={color} /><circle cx="120" cy="121" r="6" fill={secondary} /></>;
}

function CosmosArt({ color, secondary }: ArtProps) {
  return <>{ring(8).map(i => <path key={i} d="M120 124c-19-18-32-49-24-70 3-7 9-10 14-7 4-8 15-8 20 0 7-3 13 1 15 8 7 24-8 52-25 69Z" fill={color} transform={`rotate(${i * 45} 120 120)`} />)}{ring(8).map(i => <path key={i} d="M120 68v37" stroke="#fff" strokeWidth="2" opacity=".23" transform={`rotate(${i * 45} 120 120)`} />)}<circle cx="120" cy="120" r="24" fill={secondary} />{ring(9).map(i => <circle key={i} cx="120" cy="105" r="3.4" fill="#fff4c5" transform={`rotate(${i * 40} 120 120)`} />)}<circle cx="120" cy="120" r="8" fill="#fff4c5" /></>;
}

function MarigoldArt({ color, secondary }: ArtProps) {
  return <><circle cx="120" cy="120" r="79" fill={secondary} />{[0,1,2].map(layer => <g key={layer} transform={`rotate(${layer * 13} 120 120)`}>{ring(15).map(i => <ellipse key={i} cx="120" cy={55 + layer * 20} rx={17 - layer * 3} ry={27 - layer * 5} fill={color} stroke={secondary} strokeWidth="1.1" transform={`rotate(${i * 24} 120 120)`} />)}</g>)}<circle cx="120" cy="120" r="15" fill={secondary} /><circle cx="116" cy="116" r="6" fill={color} /></>;
}

function AnemoneArt({ color, secondary }: ArtProps) {
  return <>{ring(7).map(i => <ellipse key={i} cx="120" cy="76" rx="29" ry="44" fill={color} transform={`rotate(${i * 51.43} 120 120)`} />)}{ring(7).map(i => <path key={i} d="M120 57v49" stroke="#fff" strokeWidth="2" opacity=".23" transform={`rotate(${i * 51.43} 120 120)`} />)}{ring(20).map(i => <g key={i} transform={`rotate(${i * 18} 120 120)`}><path d="M120 120V87" stroke={secondary} strokeWidth="2" /><circle cx="120" cy="85" r="3.5" fill={secondary} /></g>)}<circle cx="120" cy="120" r="24" fill={secondary} />{ring(8).map(i => <circle key={i} cx="120" cy="107" r="2" fill={color} opacity=".6" transform={`rotate(${i * 45} 120 120)`} />)}</>;
}

function LeafArt({ color, secondary }: ArtProps) {
  return <><path d="M64 186C35 112 104 40 191 35c5 76-45 155-127 151Z" fill={color} /><path d="M50 213C84 148 131 94 178 51" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" /><path d="m84 156-7-38m29 10 48-3m-30-27-2-34m23 12 30-1" fill="none" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" opacity=".65" /><path d="M73 171C62 111 115 65 176 47c-47 43-78 85-103 124Z" fill="#fff" opacity=".1" /></>;
}

function FernArt({ color, secondary }: ArtProps) {
  return <><path d="M91 219C109 163 112 88 142 23" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" />{ring(8).map(i => <g key={i} transform={`translate(${102 + i * 4.3} ${190 - i * 20}) scale(${1 - i * .085})`}><path d="M0 0c-32 0-50-15-56-35 28 1 47 14 56 35Z" fill={color} /><path d="M0-3c32-4 47-20 51-41-28 5-44 20-51 41Z" fill={color} /></g>)}<path d="M135 52c-11-15-8-30 7-44 10 17 9 31-7 44Z" fill={color} /></>;
}

function MonsteraArt({ color, secondary }: ArtProps) {
  return <><path d="M117 213c4-24 6-44 3-61" fill="none" stroke={secondary} strokeWidth="5" strokeLinecap="round" /><path d="M122 178c-24-5-47-16-61-33l29 3-38-18c-8-14-11-29-8-43l47 36-43-53c6-15 18-27 31-31l23 51-10-55c13-2 24 4 30 18 9-18 24-24 38-20l-15 62 30-55c14 9 24 22 26 36l-44 46 47-28c1 17-2 30-9 41l-37 15 28-1c-19 19-42 30-64 34Z" fill={color} /><path d="M121 174c1-30 0-70 1-105" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="m119 133-18-15m22-2 18-22m-21 62-25-14m29 0 27-14" stroke={secondary} strokeWidth="2" opacity=".55" strokeLinecap="round" /></>;
}

function SprigArt({ color, secondary }: ArtProps) {
  return <><path d="M71 214c39-52 70-107 103-181" stroke={secondary} strokeWidth="4" strokeLinecap="round" fill="none" /><path d="M91 184c-32 2-46-15-43-42 28-3 44 14 43 42Zm15-28c12-31 32-41 55-32-8 28-27 41-55 32Zm13-25c-31-1-44-18-38-44 27 1 41 17 38 44Zm15-28c14-28 35-35 55-23-10 25-28 35-55 23Zm12-26c-27-5-36-23-28-46 25 6 35 21 28 46Zm15-30c-4-26 6-40 28-42 6 23-3 37-28 42Z" fill={color} /><path d="m86 174-25-23m58-8 28-13m-32-10-23-23m50-2 30-10" stroke={secondary} strokeWidth="1.6" opacity=".4" fill="none" strokeLinecap="round" /></>;
}

function VineArt({ color, secondary }: ArtProps) {
  return <><path d="M85 218c-32-38 59-67 40-107-23-49-11-73 34-91" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" /><path d="M85 200c-35-3-48-22-41-45 28 2 43 18 41 45Zm20-26c-4-30 10-49 35-52 7 28-7 46-35 52Zm23-43c26-5 40-23 33-46-27 6-39 22-33 46Zm-9-26c-33 3-50-13-47-37 30-2 45 10 47 37Zm2-37c-17-24-11-43 10-55 15 23 11 40-10 55Zm18-30c24 7 43-1 52-22-25-9-43-2-52 22Z" fill={color} /></>;
}

function ButterflyArt({ color, secondary }: ArtProps) {
  return <><path d="M116 117C93 67 57 30 33 46 8 63 26 105 54 122c-27 7-32 39-12 54 22 15 50-7 74-42Z" fill={color} /><path d="M124 117c23-50 59-87 83-71 25 17 7 59-21 76 27 7 32 39 12 54-22 15-50-7-74-42Z" fill={color} /><path d="M112 115C87 83 61 63 46 65c-5 21 18 43 52 51Zm16 0c25-32 51-52 66-50 5 21-18 43-52 51Z" fill="#fff" opacity=".24" /><path d="M109 133c-23-5-44 2-53 19 14 17 36 9 53-19Zm22 0c23-5 44 2 53 19-14 17-36 9-53-19Z" fill={secondary} opacity=".35" /><ellipse cx="120" cy="122" rx="6" ry="40" fill={secondary} /><circle cx="120" cy="81" r="8" fill={secondary} /><path d="M117 77c-3-15-10-23-17-24m23 24c3-15 10-23 17-24" fill="none" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" /><circle cx="100" cy="53" r="3" fill={secondary} /><circle cx="140" cy="53" r="3" fill={secondary} /></>;
}

function MushroomArt({ color, secondary }: ArtProps) {
  return <><path d="M100 119c2 22-4 47-11 63-7 17 0 26 31 26s38-9 31-26c-7-16-13-41-11-63Z" fill={secondary} /><path d="M112 135c1 22-3 42-9 60" fill="none" stroke="#bda88e" strokeWidth="3" strokeLinecap="round" opacity=".5" /><path d="M29 124C38 65 73 32 120 32s82 33 91 92c-27 23-155 23-182 0Z" fill={color} /><ellipse cx="120" cy="129" rx="91" ry="15" fill={secondary} /><ellipse cx="120" cy="128" rx="74" ry="8" fill="#a88a70" opacity=".25" /><circle cx="77" cy="83" r="13" fill={secondary} /><ellipse cx="125" cy="58" rx="13" ry="10" fill={secondary} /><circle cx="163" cy="92" r="15" fill={secondary} /><circle cx="117" cy="108" r="8" fill={secondary} /><path d="M72 210c-3-13-10-20-20-23m110 23c3-15 10-23 21-26" stroke="#91a082" strokeWidth="3" strokeLinecap="round" fill="none" /></>;
}

function CloverArt({ color, secondary }: ArtProps) {
  return <><path d="M119 126c6 40 2 69-20 89" fill="none" stroke={secondary} strokeWidth="5" strokeLinecap="round" />{ring(4).map(i => <path key={i} d="M120 119C79 99 68 61 88 47c15-11 29-1 32 13 3-14 17-24 32-13 20 14 9 52-32 72Z" fill={color} transform={`rotate(${i * 90} 120 120)`} />)}{ring(4).map(i => <path key={i} d="M120 119V77" stroke={secondary} strokeWidth="2" opacity=".45" transform={`rotate(${i * 90} 120 120)`} />)}<circle cx="120" cy="120" r="8" fill={secondary} /></>;
}

function HibiscusArt({ color, secondary }: ArtProps) {
  return <>{ring(5).map(i => <path key={i} d="M120 122C88 104 76 66 94 40c12-12 40-12 52 0 18 26 6 64-26 82Z" fill={color} transform={`rotate(${i * 72} 120 120)`} />)}{ring(5).map(i => <path key={i} d="M120 118V62" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".28" transform={`rotate(${i * 72} 120 120)`} />)}<circle cx="120" cy="120" r="15" fill="#8d2f4a" opacity=".3" /><path d="M120 120 156 70" stroke={secondary} strokeWidth="6" strokeLinecap="round" />{[[158, 66], [150, 62], [162, 76], [166, 68]].map(([x, y]) => <circle key={x + "-" + y} cx={x} cy={y} r="5" fill={secondary} />)}</>;
}

function DahliaArt({ color, secondary }: ArtProps) {
  return <>{ring(14).map(i => <path key={i} d="M120 24c-14 24-14 48 0 68 14-20 14-44 0-68Z" fill={color} transform={`rotate(${i * 25.714} 120 120)`} />)}{ring(12).map(i => <path key={i} d="M120 48c-11 18-11 36 0 52 11-16 11-34 0-52Z" fill={secondary} transform={`rotate(${i * 30 + 15} 120 120)`} />)}{ring(9).map(i => <path key={i} d="M120 72c-8 12-8 26 0 36 8-10 8-24 0-36Z" fill={color} transform={`rotate(${i * 40} 120 120)`} />)}<circle cx="120" cy="120" r="13" fill={secondary} /></>;
}

function PeonyArt({ color, secondary }: ArtProps) {
  return <>{ring(8).map(i => <circle key={i} cx="120" cy="62" r="36" fill={color} transform={`rotate(${i * 45} 120 120)`} />)}{ring(6).map(i => <circle key={i} cx="120" cy="82" r="28" fill={secondary} transform={`rotate(${i * 60 + 30} 120 120)`} />)}{ring(5).map(i => <circle key={i} cx="120" cy="98" r="18" fill={color} transform={`rotate(${i * 72} 120 120)`} />)}<circle cx="120" cy="120" r="12" fill="#E9C36A" />{ring(6).map(i => <circle key={i} cx="120" cy="112" r="2.2" fill="#a8742c" transform={`rotate(${i * 60} 120 120)`} />)}</>;
}

function ForgetMeNotArt({ color, secondary }: ArtProps) {
  return <>{ring(5).map(i => <circle key={i} cx="120" cy="72" r="36" fill={color} transform={`rotate(${i * 72} 120 120)`} />)}{ring(5).map(i => <path key={i} d="M120 112V84" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".5" transform={`rotate(${i * 72} 120 120)`} />)}<circle cx="120" cy="120" r="19" fill={secondary} /><circle cx="120" cy="120" r="7" fill="#c9862e" /></>;
}

function PlumeriaArt({ color, secondary }: ArtProps) {
  return <>{ring(5).map(i => <path key={i} d="M120 120C90 108 70 70 92 34c34-6 58 28 28 86Z" fill={color} transform={`rotate(${i * 72} 120 120)`} />)}{ring(5).map(i => <path key={i} d="M120 120c-15-6-25-25-14-43 17-3 29 14 14 43Z" fill={secondary} transform={`rotate(${i * 72} 120 120)`} />)}<circle cx="120" cy="120" r="5" fill="#d98a2b" /></>;
}

function LilyArt({ color, secondary }: ArtProps) {
  return <>{ring(6).map(i => <path key={i} d="M120 122C98 94 102 50 120 20c18 30 22 74 0 102Z" fill={color} transform={`rotate(${i * 60} 120 120)`} />)}{ring(6).map(i => <path key={i} d="M120 112V46" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".3" transform={`rotate(${i * 60} 120 120)`} />)}{ring(6).map(i => <g key={i} transform={`rotate(${i * 60 + 30} 120 120)`}><path d="M120 120V82" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" /><ellipse cx="120" cy="78" rx="4" ry="7" fill={secondary} /></g>)}<circle cx="120" cy="120" r="8" fill="#9bb870" /></>;
}

function BluebellArt({ color, secondary }: ArtProps) {
  const bells: [number, number, number][] = [[170, 58, 1], [148, 74, 0.95], [130, 98, 0.9], [118, 126, 0.82]];
  return <><path d="M98 224C100 150 114 84 172 50" stroke={secondary} strokeWidth="6" strokeLinecap="round" fill="none" /><path d="M98 224c-32-18-44-58-34-98 24 22 36 60 34 98Z" fill={secondary} /><path d="M100 224c24-12 36-38 34-66-22 12-34 36-34 66Z" fill={secondary} opacity=".8" />{bells.map(([x, y, k]) => <g key={x} transform={`translate(${x} ${y}) scale(${k})`}><path d="M0-6v10" stroke={secondary} strokeWidth="3" strokeLinecap="round" /><path d="M0 2c-15 4-22 20-20 40l10-7 10 9 10-9 10 7c2-20-5-36-20-40Z" fill={color} /><path d="M-6 10c-5 6-7 14-7 22" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".3" /></g>)}</>;
}

function HydrangeaArt({ color, secondary }: ArtProps) {
  const florets: [number, number][] = [[120, 52], [88, 66], [152, 66], [66, 96], [104, 92], [140, 92], [176, 96], [84, 124], [120, 126], [156, 124], [102, 152], [138, 152]];
  return <><path d="M120 150v72" stroke="#5E9B57" strokeWidth="6" strokeLinecap="round" /><path d="M120 204c-30 2-50-12-56-36 30-4 50 10 56 36Zm2-8c28 0 46-14 50-38-28 2-46 14-50 38Z" fill="#5E9B57" />{florets.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>{ring(4).map(j => <circle key={j} cx="0" cy="-10" r="11" fill={i % 2 ? secondary : color} transform={`rotate(${j * 90 + (i % 3) * 20})`} />)}<circle r="3.5" fill="#fff" opacity=".85" /></g>)}</>;
}

function IrisArt({ color, secondary }: ArtProps) {
  return <>{ring(3).map(i => <path key={"s" + i} d="M120 118C102 88 104 52 120 30c16 22 18 58 0 88Z" fill={color} transform={`rotate(${i * 120} 120 120)`} />)}{ring(3).map(i => <path key={"f" + i} d="M120 122C96 136 84 168 98 196c24-6 34-40 22-74Z" fill={color} opacity=".85" transform={`rotate(${i * 120 + 60} 120 120)`} />)}{ring(3).map(i => <path key={"b" + i} d="M120 124v40" stroke={secondary} strokeWidth="6" strokeLinecap="round" transform={`rotate(${i * 120 + 60} 120 120)`} />)}<circle cx="120" cy="120" r="10" fill={secondary} /></>;
}

function CamelliaArt({ color, secondary }: ArtProps) {
  return <>{ring(8).map(i => <circle key={i} cx="120" cy="70" r="34" fill={color} transform={`rotate(${i * 45} 120 120)`} />)}{ring(6).map(i => <circle key={"i" + i} cx="120" cy="92" r="24" fill={color} opacity=".85" transform={`rotate(${i * 60 + 22} 120 120)`} />)}<circle cx="120" cy="120" r="20" fill={secondary} />{ring(10).map(i => <circle key={"d" + i} cx="120" cy="106" r="2.4" fill="#c9862e" transform={`rotate(${i * 36} 120 120)`} />)}</>;
}

function ZinniaArt({ color, secondary }: ArtProps) {
  return <>{ring(16).map(i => <ellipse key={i} cx="120" cy="58" rx="13" ry="30" fill={color} transform={`rotate(${i * 22.5} 120 120)`} />)}{ring(12).map(i => <ellipse key={"m" + i} cx="120" cy="80" rx="10" ry="22" fill={secondary} opacity=".55" transform={`rotate(${i * 30 + 15} 120 120)`} />)}<circle cx="120" cy="120" r="22" fill="#4a2a20" />{ring(8).map(i => <circle key={"y" + i} cx="120" cy="104" r="3" fill="#f2c94c" transform={`rotate(${i * 45} 120 120)`} />)}</>;
}

function OrchidArt({ color, secondary }: ArtProps) {
  return <><path d="M120 116C96 92 92 52 120 32c28 20 24 60 0 84Z" fill={color} /><path d="M120 120C84 110 52 88 48 66c32-4 62 14 72 54Zm0 0c36-10 68-32 72-54-32-4-62 14-72 54Z" fill={color} /><path d="M120 124C96 140 90 168 104 186c10 10 22 10 32 0 14-18 8-46-16-62Z" fill={secondary} /><path d="M108 150c6 8 18 8 24 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".5" /><circle cx="120" cy="120" r="9" fill="#f2c94c" /></>;
}

function CarnationArt({ color, secondary }: ArtProps) {
  const frill = (r: number) => ring(18).map(i => { const a = i * 20 * Math.PI / 180; return `${(120 + Math.sin(a) * r * (i % 2 ? 1 : 0.86)).toFixed(1)} ${(120 - Math.cos(a) * r * (i % 2 ? 1 : 0.86)).toFixed(1)}`; }).join(" L");
  return <><path d={`M${frill(90)}Z`} fill={color} /><path d={`M${frill(64)}Z`} fill={secondary} /><path d={`M${frill(40)}Z`} fill={color} /><circle cx="120" cy="120" r="14" fill={secondary} /></>;
}

function MagnoliaArt({ color, secondary }: ArtProps) {
  return <><path d="M120 196C82 186 60 150 68 108c24 10 42 40 52 88Z" fill={color} /><path d="M120 196c38-10 60-46 52-88-24 10-42 40-52 88Z" fill={color} /><path d="M120 190C94 160 92 98 120 52c28 46 26 108 0 138Z" fill={color} /><path d="M120 190c-10-20-12-50 0-80 12 30 10 60 0 80Z" fill={secondary} opacity=".55" /><path d="M86 150c10 14 20 26 34 40M154 150c-10 14-20 26-34 40" stroke={secondary} strokeWidth="3" strokeLinecap="round" fill="none" opacity=".45" /></>;
}

function PansyArt({ color, secondary }: ArtProps) {
  return <><circle cx="88" cy="82" r="40" fill={color} /><circle cx="152" cy="82" r="40" fill={color} /><circle cx="74" cy="132" r="38" fill={color} opacity=".9" /><circle cx="166" cy="132" r="38" fill={color} opacity=".9" /><circle cx="120" cy="156" r="44" fill={color} /><path d="M120 120c-20 6-32 22-30 40 18 2 26-14 30-40Zm0 0c20 6 32 22 30 40-18 2-26-14-30-40Z" fill="#2e1d4f" opacity=".7" /><circle cx="120" cy="124" r="11" fill={secondary} /></>;
}

function ProteaArt({ color, secondary }: ArtProps) {
  return <><path d="M120 168v58" stroke="#5E9B57" strokeWidth="6" strokeLinecap="round" /><path d="M120 206c-22 0-34-12-38-28 20-2 34 8 38 28Z" fill="#5E9B57" />{ring(9).map(i => <path key={i} d="M120 168C106 140 106 100 120 70c14 30 14 70 0 98Z" fill={color} transform={`rotate(${(i - 4) * 16} 120 168)`} />)}<ellipse cx="120" cy="116" rx="30" ry="40" fill={secondary} />{ring(12).map(i => <path key={"h" + i} d="M120 84v12" stroke="#d8b48a" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 30} 120 116)`} />)}{ring(5).map(i => <path key={"f" + i} d="M120 168C110 150 110 128 120 110c10 18 10 40 0 58Z" fill={color} opacity=".9" transform={`rotate(${(i - 2) * 22} 120 168)`} />)}</>;
}

const artwork: Record<BotanicalName, (props: ArtProps) => ReactNode> = { Daisy: DaisyArt, Tulip: TulipArt, Rose: RoseArt, Sunflower: SunflowerArt, Poppy: PoppyArt, CherryBlossom: CherryBlossomArt, Lotus: LotusArt, Lavender: LavenderArt, Daffodil: DaffodilArt, Cosmos: CosmosArt, Marigold: MarigoldArt, Anemone: AnemoneArt, Hibiscus: HibiscusArt, Dahlia: DahliaArt, Peony: PeonyArt, ForgetMeNot: ForgetMeNotArt, Plumeria: PlumeriaArt, Lily: LilyArt, Bluebell: BluebellArt, Hydrangea: HydrangeaArt, Iris: IrisArt, Camellia: CamelliaArt, Zinnia: ZinniaArt, Orchid: OrchidArt, Carnation: CarnationArt, Magnolia: MagnoliaArt, Pansy: PansyArt, Protea: ProteaArt, Leaf: LeafArt, Fern: FernArt, Monstera: MonsteraArt, Sprig: SprigArt, Vine: VineArt, Butterfly: ButterflyArt, Mushroom: MushroomArt, Clover: CloverArt };

export function Botanical({ name, size = 120, color, secondaryColor, speed = 4, animate = "none", interactive = false, className = "", style, title, variant = "doodle" }: BotanicalProps & { name: BotanicalName }) {
  const item = catalogByName[name] || catalogByName.Daisy;
  const Art = artwork[item.id];
  const label = title === undefined ? item.name : title;
  const doodle = useDoodle(variant);
  const styles = { "--florii-duration": `${duration(speed)}s`, ...style } as CSSProperties;
  const paint = variant === "doodle";
  const art = { color: color || (paint ? vivid(item.color) : item.color), secondary: secondaryColor || (paint ? vivid(item.secondaryColor) : item.secondaryColor) };
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width={dimension(size)} height={dimension(size)} fill="none" className={`florii-botanical florii--${animate}${interactive ? " florii--interactive" : ""}${doodle.className} ${className}`.trim()} style={styles} role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} tabIndex={interactive && label ? 0 : undefined}>
    {label && <title>{label}</title>}
    {doodle.filter}
    <g filter={doodle.filterUrl}><g className="florii-art"><Art {...art} /></g></g>
  </svg>;
}

export const Daisy = (props: BotanicalProps) => <Botanical name="Daisy" {...props} />;
export const Tulip = (props: BotanicalProps) => <Botanical name="Tulip" {...props} />;
export const Rose = (props: BotanicalProps) => <Botanical name="Rose" {...props} />;
export const Sunflower = (props: BotanicalProps) => <Botanical name="Sunflower" {...props} />;
export const Poppy = (props: BotanicalProps) => <Botanical name="Poppy" {...props} />;
export const CherryBlossom = (props: BotanicalProps) => <Botanical name="CherryBlossom" {...props} />;
export const Lotus = (props: BotanicalProps) => <Botanical name="Lotus" {...props} />;
export const Lavender = (props: BotanicalProps) => <Botanical name="Lavender" {...props} />;
export const Daffodil = (props: BotanicalProps) => <Botanical name="Daffodil" {...props} />;
export const Cosmos = (props: BotanicalProps) => <Botanical name="Cosmos" {...props} />;
export const Marigold = (props: BotanicalProps) => <Botanical name="Marigold" {...props} />;
export const Anemone = (props: BotanicalProps) => <Botanical name="Anemone" {...props} />;
export const Hibiscus = (props: BotanicalProps) => <Botanical name="Hibiscus" {...props} />;
export const Dahlia = (props: BotanicalProps) => <Botanical name="Dahlia" {...props} />;
export const Peony = (props: BotanicalProps) => <Botanical name="Peony" {...props} />;
export const ForgetMeNot = (props: BotanicalProps) => <Botanical name="ForgetMeNot" {...props} />;
export const Plumeria = (props: BotanicalProps) => <Botanical name="Plumeria" {...props} />;
export const Lily = (props: BotanicalProps) => <Botanical name="Lily" {...props} />;
export const Bluebell = (props: BotanicalProps) => <Botanical name="Bluebell" {...props} />;
export const Hydrangea = (props: BotanicalProps) => <Botanical name="Hydrangea" {...props} />;
export const Iris = (props: BotanicalProps) => <Botanical name="Iris" {...props} />;
export const Camellia = (props: BotanicalProps) => <Botanical name="Camellia" {...props} />;
export const Zinnia = (props: BotanicalProps) => <Botanical name="Zinnia" {...props} />;
export const Orchid = (props: BotanicalProps) => <Botanical name="Orchid" {...props} />;
export const Carnation = (props: BotanicalProps) => <Botanical name="Carnation" {...props} />;
export const Magnolia = (props: BotanicalProps) => <Botanical name="Magnolia" {...props} />;
export const Pansy = (props: BotanicalProps) => <Botanical name="Pansy" {...props} />;
export const Protea = (props: BotanicalProps) => <Botanical name="Protea" {...props} />;
export const Leaf = (props: BotanicalProps) => <Botanical name="Leaf" {...props} />;
export const Fern = (props: BotanicalProps) => <Botanical name="Fern" {...props} />;
export const Monstera = (props: BotanicalProps) => <Botanical name="Monstera" {...props} />;
export const Sprig = (props: BotanicalProps) => <Botanical name="Sprig" {...props} />;
export const Vine = (props: BotanicalProps) => <Botanical name="Vine" {...props} />;
export const Butterfly = (props: BotanicalProps) => <Botanical name="Butterfly" {...props} />;
export const Mushroom = (props: BotanicalProps) => <Botanical name="Mushroom" {...props} />;
export const Clover = (props: BotanicalProps) => <Botanical name="Clover" {...props} />;

export interface DecorativeProps extends BotanicalProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  direction?: "horizontal" | "vertical";
}

function Decoration({ children, viewBox, defaultTitle, width, height, animate = "none", speed, interactive, className = "", style, title, variant = "doodle" }: BotanicalProps & { children: ReactNode; viewBox: string; defaultTitle: string; width: number | string; height: number | string }) {
  const label = title === undefined ? defaultTitle : title;
  const doodle = useDoodle(variant);
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width={width} height={height} fill="none" role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} tabIndex={interactive && label ? 0 : undefined} className={`florii-botanical florii-decoration florii--${animate}${interactive ? " florii--interactive" : ""}${doodle.className} ${className}`.trim()} style={{ "--florii-duration": `${duration(speed)}s`, ...style } as CSSProperties}>{label && <title>{label}</title>}{doodle.filter}<g filter={doodle.filterUrl}><g className="florii-art">{children}</g></g></svg>;
}

export function FlowerCorner({ size = 200, color: colorProp, secondaryColor: secondaryProp, position = "bottom-left", ...props }: DecorativeProps) {
  const paint = props.variant !== "filled";
  const color = colorProp ?? (paint ? vivid("#E4AF9D") : "#E4AF9D");
  const secondaryColor = secondaryProp ?? (paint ? vivid("#9AAD8B") : "#9AAD8B");
  const transform = position === "top-left" ? "translate(0 240) scale(1 -1)" : position === "top-right" ? "translate(240 240) scale(-1 -1)" : position === "bottom-right" ? "translate(240 0) scale(-1 1)" : undefined;
  return <Decoration {...props} viewBox="0 0 240 240" width={dimension(size)} height={dimension(size)} defaultTitle="Botanical flower corner"><g transform={transform}><path d="M25 216C28 117 52 58 77 23M25 216c68 1 120-11 184-40" fill="none" stroke={secondaryColor} strokeWidth="3" />{ring(4).map(i => <g key={i} transform={`translate(${i * 9} ${-i * 37})`}><path d="M30 190c-20-13-24-29-16-45 20 12 25 29 16 45Zm3-16c23 1 35-9 38-28-23-1-35 9-38 28Z" fill={secondaryColor} /></g>)}{ring(4).map(i => <g key={i} transform={`translate(${i * 38} ${-i * 7})`}><path d="M62 214c1-25 14-37 33-38-1 25-13 37-33 38Z" fill={secondaryColor} /></g>)}<g transform="translate(-10 135) scale(.4)"><DaisyArt color={color} secondary="#D8AB6E" /></g><g transform="translate(44 139) scale(.3)"><CherryBlossomArt color={color} secondary="#BC8277" /></g><g transform="translate(9 80) scale(.25)"><DaisyArt color="#F0DBAE" secondary="#D8AB6E" /></g></g></Decoration>;
}

export function BotanicalDivider({ size = 400, color: colorProp, secondaryColor: secondaryProp, direction = "horizontal", ...props }: DecorativeProps) {
  const paint = props.variant !== "filled";
  const color = colorProp ?? (paint ? vivid("#E4AF9D") : "#E4AF9D");
  const secondaryColor = secondaryProp ?? (paint ? vivid("#9AAD8B") : "#9AAD8B");
  const vertical = direction === "vertical";
  return <Decoration {...props} viewBox={vertical ? "0 0 120 400" : "0 0 400 120"} width={vertical ? 120 : dimension(size, 400)} height={vertical ? dimension(size, 400) : 120} defaultTitle="Botanical flower divider"><g transform={vertical ? "translate(120 0) rotate(90)" : undefined}><path d="M25 60h125m100 0h125" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />{[45,80,115,270,305,340].map((x, i) => <g key={x} transform={`translate(${x} 60)`}><path d={i % 2 ? "M0 0c1-19 10-29 26-28 0 18-10 28-26 28Z" : "M0 0c1 19 10 29 26 28 0-18-10-28-26-28Z"} fill={secondaryColor} /></g>)}<g transform="translate(150 10) scale(.42)"><DaisyArt color={color} secondary="#D8AB6E" /></g></g></Decoration>;
}

export function VineBorder({ size = 400, color: colorProp, secondaryColor: secondaryProp, direction = "horizontal", ...props }: DecorativeProps) {
  const paint = props.variant !== "filled";
  const color = colorProp ?? (paint ? vivid("#99AD8E") : "#99AD8E");
  const secondaryColor = secondaryProp ?? (paint ? vivid("#70866A") : "#70866A");
  const vertical = direction === "vertical";
  return <Decoration {...props} viewBox={vertical ? "0 0 90 400" : "0 0 400 90"} width={vertical ? 90 : dimension(size, 400)} height={vertical ? dimension(size, 400) : 90} defaultTitle="Winding vine border"><g transform={vertical ? "translate(90 0) rotate(90)" : undefined}><path d="M12 49c55-37 88 35 145 0s89 35 145 0c38-23 62-9 86 0" stroke={secondaryColor} strokeWidth="3" fill="none" strokeLinecap="round" />{ring(11).map(i => <g key={i} transform={`translate(${28 + i * 33} ${46 + Math.sin(i * .9) * 9}) rotate(${i % 2 ? 0 : 180})`}><path d="M0 0C2-24 16-35 35-30 30-8 17 1 0 0Z" fill={color} /><path d="m4-4 20-18" stroke={secondaryColor} strokeWidth="1.3" opacity=".5" /></g>)}</g></Decoration>;
}

export function FlowerWreath({ size = 220, color: colorProp, secondaryColor: secondaryProp, ...props }: DecorativeProps) {
  const paint = props.variant !== "filled";
  const color = colorProp ?? (paint ? vivid("#E9A59B") : "#E9A59B");
  const secondaryColor = secondaryProp ?? (paint ? vivid("#9AAD8B") : "#9AAD8B");
  return <Decoration {...props} viewBox="0 0 240 240" width={dimension(size)} height={dimension(size)} defaultTitle="Flower wreath"><circle cx="120" cy="120" r="78" fill="none" stroke={secondaryColor} strokeWidth="5" />{ring(12).map(i => <path key={"l" + i} d="M120 36c-12 6-16 18-10 28 10-2 16-14 10-28Z" fill={secondaryColor} transform={`rotate(${i * 30 + 12} 120 120)`} />)}{ring(6).map(i => <g key={"f" + i} transform={`rotate(${i * 60} 120 120) translate(120 42) scale(.2) translate(-120 -120)`}><DaisyArt color={color} secondary="#E8B867" /></g>)}</Decoration>;
}

export function FlowerGarland({ size = 400, color: colorProp, secondaryColor: secondaryProp, ...props }: DecorativeProps) {
  const paint = props.variant !== "filled";
  const color = colorProp ?? (paint ? vivid("#E3A5BA") : "#E3A5BA");
  const secondaryColor = secondaryProp ?? (paint ? vivid("#9AAD8B") : "#9AAD8B");
  const points = [40, 110, 180, 250, 320, 390];
  return <Decoration {...props} viewBox="0 0 430 120" width={dimension(size, 400)} height={Math.round(Number(dimension(size, 400)) * 120 / 430) || 112} defaultTitle="Flower garland"><path d="M10 20C80 80 140 80 215 50S350 20 420 20" fill="none" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" />{points.map((x, i) => { const y = 20 + Math.sin((x / 430) * Math.PI) * 44; return <g key={x} transform={`translate(${x} ${y}) scale(.18) translate(-120 -120)`}><CosmosArt color={i % 2 ? color : vivid("#F0DCA3")} secondary="#D7AB61" /></g>; })}</Decoration>;
}

export interface NatureEffectProps extends BotanicalProps {
  count?: number;
  effect?: "falling" | "floating";
}

function NatureEffect({ kind, count = 15, color, secondaryColor, size = 240, speed = 7, effect = "falling", animate, interactive = false, className = "", style, title, variant = "doodle" }: NatureEffectProps & { kind: "petals" | "leaves" }) {
  const paint = variant === "doodle";
  const base = kind === "petals" ? "#E9B5AC" : "#9AAD8B";
  const particleFill = color || (paint ? vivid(base) : base);
  const amount = Number.isFinite(count) ? Math.max(0, Math.min(60, Math.floor(count))) : 15;
  const label = title === undefined ? kind === "petals" ? "Falling flower petals" : "Floating leaves" : title;
  const preset = animate === "none" ? "still" : effect === "floating" ? "floating" : "falling";
  return <div className={`florii-effect florii-effect--${preset}${interactive ? " florii-effect--interactive" : ""} ${className}`.trim()} style={{ width: dimension(size, 240), height: dimension(size, 240), "--florii-duration": `${duration(speed)}s`, ...style } as CSSProperties} role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} tabIndex={interactive && label ? 0 : undefined}>
    {ring(amount).map(i => <span className="florii-particle" key={i} style={{ left: `${(i * 37 + 11) % 93}%`, top: `${(i * 23 + 7) % 87}%`, "--florii-delay": `${-(i * 1.37) % duration(speed)}s`, "--florii-drift": `${(i % 2 ? 1 : -1) * (12 + i % 4 * 7)}px`, "--florii-rotation": `${i * 47}deg`, width: 14 + i % 4 * 5, height: 19 + i % 4 * 6 } as CSSProperties}>
      <svg viewBox="0 0 40 50" width="100%" height="100%" aria-hidden="true"><path d={kind === "petals" ? "M20 48C1 34-2 13 10 5c5-4 11-2 12 4 5-5 12-4 15 2 8 15-1 29-17 37Z" : "M6 45C-6 19 13 2 37 3c3 24-10 44-31 42Z"} fill={particleFill} />{kind === "leaves" && <path d="M5 47 30 12" stroke={secondaryColor || (paint ? vivid("#70866A") : "#70866A")} strokeWidth="1.5" fill="none" />}</svg>
    </span>)}
  </div>;
}

export function Petals(props: NatureEffectProps) { return <NatureEffect kind="petals" {...props} />; }
export function LeafConfetti(props: NatureEffectProps) { return <NatureEffect kind="leaves" effect="floating" {...props} />; }
