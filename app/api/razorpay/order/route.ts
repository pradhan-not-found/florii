import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";

/** The sponsorship price is fixed here, on the server, so it can't be changed from the browser. */
const SPONSOR_PRICE = { amount: 4999, currency: "USD" } as const; // $49.99, in cents

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** Creates a Razorpay order for a sponsor spot. The secret key never leaves the server. */
export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID, keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ error: "Payments are not set up yet." }, { status: 503 });

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const product = clean(body?.product, 80), link = clean(body?.link, 200), description = clean(body?.description, 200), email = clean(body?.email, 160);
  if (!product) return NextResponse.json({ error: "Add your product name." }, { status: 400 });
  if (!/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(link)) return NextResponse.json({ error: "Add a valid link, like example.com." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Add a valid email so we can reach you." }, { status: 400 });

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64") },
    body: JSON.stringify({ ...SPONSOR_PRICE, receipt: "florii_" + Date.now(), notes: { purpose: "florii sponsor spot", product, link, description, email } }),
  });
  const order = await response.json().catch(() => null) as { id?: string; amount?: number; currency?: string; error?: { description?: string } } | null;
  if (!response.ok || !order?.id) return NextResponse.json({ error: order?.error?.description || "Could not start the payment." }, { status: 502 });

  await supabaseInsert("florii_sponsors", { product, link, description, email, amount: order.amount, currency: order.currency, razorpay_order_id: order.id, status: "created" });
  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
}
