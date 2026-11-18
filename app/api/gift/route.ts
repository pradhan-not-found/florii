import { NextResponse } from "next/server";
import { decode, encode } from "@/app/gift/codec";
import { MINUTE, guard } from "@/lib/guard";
import { saveGift } from "@/lib/gifts";

/** Makes a short link for a gift. The page falls back to a packed link if this isn't available. */
export async function POST(request: Request) {
  const blocked = guard(request, "gift", { limit: 20, windowMs: 10 * MINUTE, sameOrigin: true, maxBytes: 8192 }); if (blocked) return blocked;
  const body = await request.json().catch(() => null) as { token?: unknown } | null;
  const gift = typeof body?.token === "string" ? decode(body.token) : null;
  if (!gift) return NextResponse.json({ error: "That gift couldn't be read." }, { status: 400 });
  const id = await saveGift(encode(gift), gift); // re-encoded, so only clean, validated data is stored
  if (!id) return NextResponse.json({ error: "Short links aren't available right now." }, { status: 503 });
  return NextResponse.json({ id });
}
