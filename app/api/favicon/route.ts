import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { MINUTE, guard } from "@/lib/guard";

/**
 * Returns a website's real icon: the one its page declares (icon, apple-touch-icon, SVG icon),
 * or /favicon.ico. Only public http(s) addresses are fetched, with short timeouts and size limits.
 */
export const runtime = "nodejs";

const MAX_PAGE = 300_000, MAX_ICON = 200_000, TIMEOUT = 4000;
/** Icons already found, kept for a day so each site is fetched once, not on every page view. */
const cache = new Map<string, { body: Uint8Array | null; type: string; at: number }>();
const DAY = 86_400_000;
const serve = (body: Uint8Array, type: string) => new Response(body as BodyInit, {
  headers: {
    "Content-Type": type, "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
    // an SVG from another site is shown only as an image; this stops any script in it from running
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox", "X-Content-Type-Options": "nosniff",
  },
});
const blank = () => new Response(null, { status: 204, headers: { "Cache-Control": "public, max-age=3600" } });

function privateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v6 = ip.toLowerCase();
    return v6 === "::1" || v6 === "::" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe80") || v6.startsWith("::ffff:") && privateAddress(v6.slice(7));
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
}

async function isPublic(url: URL) {
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return false;
  if (url.port && !["80", "443"].includes(url.port)) return false;
  const host = url.hostname;
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(host)) return false;
  try {
    const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
    return addresses.length > 0 && addresses.every(entry => !privateAddress(entry.address));
  } catch { return false; }
}

/** Fetches a public URL without following redirects to private hosts. */
async function get(url: URL, limit: number, hops = 3): Promise<{ body: Uint8Array; type: string; url: URL } | null> {
  if (!(await isPublic(url))) return null;
  const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(TIMEOUT), headers: { "User-Agent": "Mozilla/5.0 (compatible; florii-favicon/1.0)", Accept: "text/html,image/*;q=0.9,*/*;q=0.5" } }).catch(() => null);
  if (!response) return null;
  if (response.status >= 300 && response.status < 400) {
    const next = response.headers.get("location");
    return next && hops > 0 ? get(new URL(next, url), limit, hops - 1) : null;
  }
  if (!response.ok || !response.body) return null;
  const reader = response.body.getReader(), chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let at = 0; for (const chunk of chunks) { body.set(chunk, at); at += chunk.length; }
  return { body, type: response.headers.get("content-type") || "", url };
}

/** Icons declared in the page, best first (big PNG/SVG icons beat the tiny .ico). */
function declaredIcons(html: string, base: URL) {
  const found: { href: URL; score: number }[] = [];
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = /\brel\s*=\s*["']?([^"'>]+)/i.exec(tag)?.[1].toLowerCase() ?? "";
    const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
    if (!href || !/\bicon\b/.test(rel)) continue;
    const sizes = Number(/\bsizes\s*=\s*["']?(\d+)/i.exec(tag)?.[1] ?? 0);
    const score = (rel.includes("apple-touch-icon") ? 180 : 0) + (/\.svg(\?|$)/i.test(href) ? 200 : 0) + Math.min(sizes, 256);
    try { found.push({ href: new URL(href, base), score }); } catch { /* bad href */ }
  }
  return found.sort((a, b) => b.score - a.score).map(icon => icon.href);
}

export async function GET(request: Request) {
  const blocked = guard(request, "favicon", { limit: 120, windowMs: 10 * MINUTE }); if (blocked) return blocked;
  const raw = new URL(request.url).searchParams.get("url") || "";
  let site: URL;
  try { site = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); } catch { return blank(); }

  const known = cache.get(site.hostname);
  if (known && Date.now() - known.at < DAY) return known.body ? serve(known.body, known.type) : blank();
  if (cache.size > 500) cache.clear();

  const page = await get(new URL("/", site.origin), MAX_PAGE);
  const html = page && /html/i.test(page.type) ? new TextDecoder().decode(page.body) : "";
  const candidates = [...declaredIcons(html, page?.url ?? site), new URL("/favicon.ico", page?.url.origin ?? site.origin)];

  for (const candidate of candidates.slice(0, 4)) {
    const icon = await get(candidate, MAX_ICON);
    if (!icon || icon.body.length < 32) continue;
    const isSvg = /svg/i.test(icon.type) || /\.svg(\?|$)/i.test(candidate.pathname);
    const type = isSvg ? "image/svg+xml" : /^image\//i.test(icon.type) ? icon.type.split(";")[0] : "image/x-icon";
    if (!isSvg && !/^image\//i.test(type)) continue;
    cache.set(site.hostname, { body: icon.body, type, at: Date.now() });
    return serve(icon.body, type);
  }
  cache.set(site.hostname, { body: null, type: "", at: Date.now() });
  return blank();
}
