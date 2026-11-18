"use client";

import { useEffect, useState } from "react";
import { githubRepo } from "@/config/project";

export const formatCount = (value: number) => new Intl.NumberFormat("en-US").format(value);

function readCache(key: string): number | null {
  try { const value = sessionStorage.getItem(key); return value ? Number(value) : null; } catch { return null; }
}
function writeCache(key: string, value: number) {
  try { sessionStorage.setItem(key, String(value)); } catch { /* storage unavailable */ }
}

const visitorBase = 100;

/** Live GitHub stars and visitor count. */
export function useCounts() {
  const [stars, setStars] = useState<number | null>(null);
  const [visitors, setVisitors] = useState<number | null>(visitorBase);

  useEffect(() => {
    // stars: show the last known number at once, then keep it live (every minute and when the tab is focused)
    const cached = readCache("florii-stars");
    if (cached !== null) setStars(cached);
    const refreshStars = () => {
      if (!githubRepo() || document.visibilityState !== "visible") return;
      fetch("/api/stars", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(data => {
        if (typeof data?.stars === "number") { setStars(data.stars); writeCache("florii-stars", data.stars); }
      }).catch(() => {});
    };
    refreshStars();
    const timer = window.setInterval(refreshStars, 60_000);
    window.addEventListener("focus", refreshStars);
    const applyCount = (count: number) => setVisitors(current => Math.max(current ?? visitorBase, visitorBase + count));
    const update = (event: Event) => applyCount((event as CustomEvent<number>).detail);
    window.addEventListener("florii-visitors", update);
    // live: read the count now, then every 30 seconds while the tab is visible
    const refreshVisitors = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/visitors", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(data => {
        if (typeof data?.count === "number") applyCount(data.count);
      }).catch(() => {});
    };
    refreshVisitors();
    const visitorTimer = window.setInterval(refreshVisitors, 30_000);
    window.addEventListener("focus", refreshVisitors);
    return () => { window.removeEventListener("florii-visitors", update); window.removeEventListener("focus", refreshStars); window.removeEventListener("focus", refreshVisitors); window.clearInterval(timer); window.clearInterval(visitorTimer); };
  }, []);

  return { stars, visitors };
}
