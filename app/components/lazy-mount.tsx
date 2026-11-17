"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Renders its children only once they come near the screen. Until then it holds the space with
 * an empty box, so the page's first paint stays light and fast.
 */
export function LazyMount({ children, minHeight, className = "" }: { children: ReactNode; minHeight: number | string; className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = holder.current;
    if (!el || show) return;
    const seen = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setShow(true); seen.disconnect(); }
    }, { rootMargin: "500px 0px" });
    seen.observe(el);
    return () => seen.disconnect();
  }, [show]);
  return <div ref={holder} className={"lazy-mount " + className} style={show ? undefined : { minHeight }}>{show ? children : null}</div>;
}
