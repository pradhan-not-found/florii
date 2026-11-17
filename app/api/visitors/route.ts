import { NextRequest, NextResponse } from "next/server";
import { analyticsKey, analyticsRedis, recordVisit, retentionSeconds } from "@/lib/analytics";

export const dynamic = "force-dynamic";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  const redis = analyticsRedis();
  if (!redis) return json({ count: null }, 503);
  try {
    return json({ count: await redis.pfcount(`${analyticsKey}:visitors`) });
  } catch {
    return json({ count: null }, 503);
  }
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return json({ error: "Invalid origin" }, 403);
  if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") return new NextResponse(null, { status: 204 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Expected JSON" }, 415);
  const body = await request.text();
  if (body.length > 512) return json({ error: "Request too large" }, 413);
  let data;
  try { data = JSON.parse(body); } catch { return json({ error: "Invalid JSON" }, 400); }
  if (!data || typeof data.visitorId !== "string" || typeof data.eventId !== "string" || !uuid.test(data.visitorId) || !uuid.test(data.eventId)) return json({ error: "Invalid identifier" }, 400);
  const redis = analyticsRedis();
  if (!redis) return json({ count: null }, 503);
  try {
    const day = new Date().toISOString().slice(0, 10);
    await redis.eval(recordVisit, [
      `${analyticsKey}:event:${data.eventId}`,
      `${analyticsKey}:views`, `${analyticsKey}:visitors`,
      `${analyticsKey}:${day}:views`, `${analyticsKey}:${day}:visitors`,
    ], [data.visitorId, retentionSeconds]);
    return json({ count: await redis.pfcount(`${analyticsKey}:visitors`) });
  } catch {
    return json({ count: null }, 503);
  }
}
