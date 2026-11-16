"use client";

import { useEffect, useState } from "react";
import { githubRepo, projectLinks } from "@/config/project";

export const formatCount = (value: number) => new Intl.NumberFormat("en-US").format(value);

function readCache(key: string): number | null {
  try { const value = sessionStorage.getItem(key); return value ? Number(value) : null; } catch { return null; }
}
function writeCache(key: string, value: number) {
  try { sessionStorage.setItem(key, String(value)); } catch { /* storage unavailable */ }
}

/** Live GitHub stars and visitor total. Each stays null until a real number arrives. */
export function useCounts() {
  const [stars, setStars] = useState<number | null>(null);
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    const repo = githubRepo();
    if (repo) {
      const cached = readCache("florii-stars");
      if (cached !== null) setStars(cached);
      else fetch("https://api.github.com/repos/" + repo).then(r => r.ok ? r.json() : null).then(data => {
        if (typeof data?.stargazers_count === "number") { setStars(data.stargazers_count); writeCache("florii-stars", data.stargazers_count); }
      }).catch(() => {});
    }
    if (projectLinks.visitorCounter) {
      const cached = readCache("florii-visitors");
      if (cached !== null) setVisitors(cached);
      else fetch(projectLinks.visitorCounter).then(r => r.ok ? r.json() : null).then(data => {
        const value = data?.count ?? data?.value ?? data?.data?.up_count;
        if (typeof value === "number") { setVisitors(value); writeCache("florii-visitors", value); }
      }).catch(() => {});
    }
  }, []);

  return { stars, visitors };
}
