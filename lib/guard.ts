/**
 * A small security layer for public API routes: requests must come from this site, stay small,
 * and each visitor gets a limited number of calls per window. Server only.
 */
import { NextResponse } from "next/server";

type Rule = { limit: number; windowMs: number; sameOrigin?: boolean; maxBytes?: number };
const hits = new Map<string, { count: number; reset: number }>();

const ipOf = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";

/** Returns a response to send back when the request should be refused, or null when it may continue. */
export function guard(request: Request, name: string, rule: Rule): NextResponse | null {
  if (rule.sameOrigin) {
    const origin = request.headers.get("origin"), host = request.headers.get("host");
    try { if (!origin || !host || new URL(origin).host !== host) return NextResponse.json({ error: "Not allowed." }, { status: 403 }); }
    catch { return NextResponse.json({ error: "Not allowed." }, { status: 403 }); }
  }
  if (rule.maxBytes) {
    const size = Number(request.headers.get("content-length") || 0);
    if (size > rule.maxBytes) return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }
  const key = `${name}:${ipOf(request)}`, now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    hits.set(key, { count: 1, reset: now + rule.windowMs });
    return null;
  }
  entry.count += 1;
  if (entry.count > rule.limit) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429, headers: { "Retry-After": String(Math.ceil((entry.reset - now) / 1000)) } });
  }
  return null;
}

export const MINUTE = 60_000;
