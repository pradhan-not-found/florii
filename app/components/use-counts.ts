"use client";

import { useEffect, useState } from "react";
import { githubRepo } from "@/config/project";

export const formatCount = (value: number) => new Intl.NumberFormat("en-US").format(value);
const visitorStartingCount = 100;

function readCache(key: string): number | null {
  try { const value = sessionStorage.getItem(key); return value ? Number(value) : null; } catch { return null; }
}
function writeCache(key: string, value: number) {
  try { sessionStorage.setItem(key, String(value)); } catch { /* storage unavailable */ }
}

/** Live GitHub stars and visitor count with the configured starting offset. */
export function useCounts() {
  const [stars, setStars] = useState<number | null>(null);
  const [visitors, setVisitors] = useState<number | null>(visitorStartingCount);

  useEffect(() => {
    const repo = githubRepo();
    if (repo) {
      const cached = readCache("florii-stars");
      if (cached !== null) setStars(cached);
      else fetch("https://api.github.com/repos/" + repo).then(r => r.ok ? r.json() : null).then(data => {
        if (typeof data?.stargazers_count === "number") { setStars(data.stargazers_count); writeCache("florii-stars", data.stargazers_count); }
      }).catch(() => {});
    }
    const applyCount = (count: number) => setVisitors(current => Math.max(current ?? visitorStartingCount, visitorStartingCount + count));
    const update = (event: Event) => applyCount((event as CustomEvent<number>).detail);
    window.addEventListener("florii-visitors", update);
    fetch("/api/visitors", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(data => {
      if (typeof data?.count === "number") applyCount(data.count);
    }).catch(() => {});
    return () => window.removeEventListener("florii-visitors", update);
  }, []);

  return { stars, visitors };
}
