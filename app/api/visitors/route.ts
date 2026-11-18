import { NextRequest, NextResponse } from "next/server";
import { analyticsKey, analyticsRedis, recordVisit, retentionSeconds } from "@/lib/analytics";
import { supabaseCount, supabaseInsert, supabaseReady, supabaseRpc } from "@/lib/supabase";
import { MINUTE, guard } from "@/lib/guard";
import { TZ_COUNTRY } from "@/lib/tz-country";

/**
 * The visitor counter. Uses Upstash Redis when it is connected, otherwise Supabase. In Supabase every
 * visit adds one to a daily total (per day, page, country, device and referring site), so storage stays
 * small however busy the site gets. Nothing personal is kept: no name, no IP address, no visitor id.
 */
export const dynamic = "force-dynamic";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|whatsapp|telegram/i;

/** Total visits: from the daily totals, or from the older one-row-per-view table until that exists. */
async function supabaseVisitors() {
  const total = await supabaseRpc<number>("florii_visit_total");
  if (typeof total === "number") return total;
  return (await supabaseCount("florii_visits", "first_visit=eq.true")) ?? (await supabaseCount("florii_visits"));
}

// every open tab asks every few seconds, so one answer is shared for a moment
let recent: { count: number; at: number } | null = null;

export async function GET() {
  if (recent && Date.now() - recent.at < 3000) return json({ count: recent.count });
  const redis = analyticsRedis();
  if (redis) {
    try { return json({ count: await redis.pfcount(`${analyticsKey}:visitors`) }); } catch { /* fall through */ }
  }
  if (supabaseReady()) {
    const count = await supabaseVisitors();
    if (count !== null) { recent = { count, at: Date.now() }; return json({ count }); }
  }
  return json({ count: null });
}

export async function POST(request: NextRequest) {
  const blocked = guard(request, "visit", { limit: 120, windowMs: 10 * MINUTE }); if (blocked) return blocked;
  if (request.headers.get("origin") !== request.nextUrl.origin) return json({ error: "Invalid origin" }, 403);
  if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") return new NextResponse(null, { status: 204 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Expected JSON" }, 415);
  const agent = request.headers.get("user-agent") || "";
  if (BOT.test(agent)) return new NextResponse(null, { status: 204 });
  const body = await request.text();
  if (body.length > 1024) return json({ error: "Request too large" }, 413);
  let data;
  try { data = JSON.parse(body); } catch { return json({ error: "Invalid JSON" }, 400); }
  if (!data || typeof data.visitorId !== "string" || typeof data.eventId !== "string" || !uuid.test(data.visitorId) || !uuid.test(data.eventId)) return json({ error: "Invalid identifier" }, 400);

  const redis = analyticsRedis();
  if (redis) {
    try {
      const day = new Date().toISOString().slice(0, 10);
      await redis.eval(recordVisit, [
        `${analyticsKey}:event:${data.eventId}`,
        `${analyticsKey}:views`, `${analyticsKey}:visitors`,
        `${analyticsKey}:${day}:views`, `${analyticsKey}:${day}:visitors`,
      ], [data.visitorId, retentionSeconds]);
      return json({ count: await redis.pfcount(`${analyticsKey}:visitors`) });
    } catch { /* fall through to Supabase */ }
  }
  if (!supabaseReady()) return json({ count: null });

  const path = typeof data.path === "string" ? data.path.split("?")[0].slice(0, 120) : "/";
  let referrer: string | null = null;
  try { const host = new URL(String(data.referrer || "")).hostname; referrer = host && host !== request.nextUrl.hostname ? host : null; } catch { /* no referrer */ }
  const device = /ipad|tablet/i.test(agent) ? "tablet" : /mobi|android|iphone/i.test(agent) ? "mobile" : "desktop";
  // country: the hosting network's lookup when present, else the browser's time zone, else its language region
  const fromTz = typeof data.tz === "string" ? TZ_COUNTRY[data.tz.slice(0, 64)] : undefined;
  const fromLang = typeof data.lang === "string" ? /-([A-Za-z]{2})$/.exec(data.lang.slice(0, 20))?.[1]?.toUpperCase() : undefined;
  const country = request.headers.get("x-vercel-ip-country") || fromTz || fromLang || null;
  // daily totals: one counter row per day, page, country, device and source
  const total = await supabaseRpc<number>("florii_track_visit", { p_path: path, p_country: country ?? "", p_device: device, p_referrer: referrer ?? "", p_new: data.first === true });
  if (typeof total === "number") { recent = { count: total, at: Date.now() }; return json({ count: total }); }
  // older setup, until the daily-totals function exists: one row per page view
  const row = { path, referrer, device, country, visitor: data.visitorId };
  if (!(await supabaseInsert("florii_visits", { ...row, first_visit: data.first === true }))) await supabaseInsert("florii_visits", row);
  return json({ count: await supabaseVisitors() });
}
