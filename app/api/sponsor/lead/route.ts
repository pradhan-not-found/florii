import { NextResponse } from "next/server";
import { supabaseInsert, supabasePatch } from "@/lib/supabase";
import { SPONSOR_PRICES } from "@/lib/prices";

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Saves a sponsor as soon as they fill in their details, so the dashboard shows people who started
 * checking out, not only those who paid. Only rows still in "created" can be changed from here.
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin"), host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "Blocked." }, { status: 403 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const id = clean(body?.leadId, 36), product = clean(body?.product, 80), link = clean(body?.link, 200), description = clean(body?.description, 200), email = clean(body?.email, 160);
  if (!uuid.test(id) || !product || !link || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Missing details." }, { status: 400 });

  const fields = { product, link, description, email };
  const changed = await supabasePatch("florii_sponsors", `id=eq.${id}&status=eq.created`, fields);
  if (changed === 0) {
    // a placeholder order id keeps the row valid until a real payment order replaces it
    await supabaseInsert("florii_sponsors", { id, ...fields, amount: SPONSOR_PRICES.card.amount, currency: SPONSOR_PRICES.card.currency, razorpay_order_id: `lead_${id}`, status: "created" });
  }
  return NextResponse.json({ ok: true });
}
