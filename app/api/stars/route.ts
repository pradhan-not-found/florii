import { NextResponse } from "next/server";
import { githubRepo } from "@/config/project";

// GitHub is asked at most once a minute for everyone; browsers poll this instead of GitHub directly.
export const revalidate = 60;

export async function GET() {
  const repo = githubRepo();
  if (!repo) return NextResponse.json({ stars: null }, { status: 404 });
  const token = process.env.GITHUB_TOKEN;
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "florii-site", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      next: { revalidate: 60 },
    });
    if (!response.ok) return NextResponse.json({ stars: null }, { status: 502 });
    const data = await response.json() as { stargazers_count?: number };
    return NextResponse.json({ stars: data.stargazers_count ?? null }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ stars: null }, { status: 502 });
  }
}
