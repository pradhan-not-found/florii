"use client";

import { Botanical } from "@/packages/florii/src";
import { Garden } from "./garden";

/** "4 ✿ 4": a sunflower blooms where the zero would be, over a small meadow. */
export function NotFoundArt() {
  return <div className="not-found-art" aria-hidden="true">
    <div className="not-found-code"><span>4</span><span className="not-found-bloom"><Botanical name="Sunflower" size="100%" animate="rotate" speed={24} title="" /></span><span>4</span></div>
    <Garden height={150} plants={9} density={0.5} taper />
  </div>;
}
