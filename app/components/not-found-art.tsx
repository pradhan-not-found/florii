"use client";

import { Botanical } from "@/packages/florii/src";
import { Garden } from "./garden";

/** "4 🍄 4" over a small meadow. */
export function NotFoundArt() {
  return <div className="not-found-art" aria-hidden="true">
    <div className="not-found-code"><span>4</span><Botanical name="Mushroom" size="0.9em" animate="pulse" speed={3} title="" /><span>4</span></div>
    <Garden height={150} plants={9} density={0.5} taper />
  </div>;
}
