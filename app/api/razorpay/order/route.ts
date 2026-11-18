import { NextResponse } from "next/server";
import { supabaseInsert, supabasePatch } from "@/lib/supabase";
import { SPONSOR_MAX, SPONSOR_PRICES } from "@/lib/prices";

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** Creates a Razorpay order for a sponsor spot. The secret key never leaves the server. */
export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID, keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ error: "Payments are not set up yet." }, { status: 503 });

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const method = body?.method === "upi" ? "upi" : "card";
  const price = SPONSOR_PRICES[method];
  const product = clean(body?.product, 80), link = clean(body?.link, 200), description = clean(body?.description, 200), email = clean(body?.email, 160);
  if (!product) return NextResponse.json({ error: "Add your product name." }, { status: 400 });
  if (!/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(link)) return NextResponse.json({ error: "Add a valid link, like example.com." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Add a valid email so we can reach you." }, { status: 400 });
  const name = clean(body?.name, 80), phone = clean(body?.phone, 24), country = clean(body?.country, 60), address = clean(body?.address, 200), leadId = clean(body?.leadId, 36);
  if (!name) return NextResponse.json({ error: "Add your full name." }, { status: 400 });
  if (!address) return NextResponse.json({ error: "Add your billing address." }, { status: 400 });
  // the sponsor may pay more than the minimum; the server decides what is allowed
  const requested = Number(body?.amount);
  const amount = Number.isInteger(requested) && requested >= price.amount && requested <= SPONSOR_MAX[method] ? requested : price.amount;
  const note = [`Name: ${name}`, phone && `Phone: ${phone}`, `Address: ${address}${country ? `, ${country}` : ""}`, `Method: ${method === "upi" ? "UPI" : "card"}`].filter(Boolean).join(" · ");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64") },
    body: JSON.stringify({ amount, currency: price.currency, receipt: "florii_" + Date.now(), notes: { purpose: "florii sponsor spot", method, product, link, description, email, name, phone, country, address } }),
  });
  const order = await response.json().catch(() => null) as { id?: string; amount?: number; currency?: string; error?: { description?: string } } | null;
  if (!response.ok || !order?.id) return NextResponse.json({ error: order?.error?.description || "Could not start the payment." }, { status: 502 });

  // attach the payment to the sponsor saved when they filled the form; otherwise record a new one
  const base = { product, link, description, email, note, amount: order.amount, currency: order.currency, razorpay_order_id: order.id, status: "created" };
  const full = { ...base, name, phone: phone || null, country, address };
  const save = async (row: Record<string, unknown>) => {
    const linked = /^[0-9a-f-]{36}$/i.test(leadId) ? await supabasePatch("florii_sponsors", `id=eq.${leadId}&status=eq.created`, row) : 0;
    return linked ? true : supabaseInsert("florii_sponsors", row);
  };
  // name/phone/country/address have their own columns once supabase/schema.sql is re-run; until then they live in the note
  if (!(await save(full))) await save(base);
  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
}
