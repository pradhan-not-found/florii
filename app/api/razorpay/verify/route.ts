import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { supabaseUpdate } from "@/lib/supabase";

/** Confirms a payment really came from Razorpay by checking its signature with the secret key. */
export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return NextResponse.json({ verified: false }, { status: 503 });

  const body = await request.json().catch(() => null) as { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string } | null;
  const orderId = body?.razorpay_order_id, paymentId = body?.razorpay_payment_id, signature = body?.razorpay_signature;
  if (!orderId || !paymentId || !signature) return NextResponse.json({ verified: false }, { status: 400 });

  const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(signature);
  const verified = a.length === b.length && timingSafeEqual(a, b);
  if (verified) await supabaseUpdate("florii_sponsors", "razorpay_order_id", orderId, { status: "paid", razorpay_payment_id: paymentId, paid_at: new Date().toISOString() });
  return NextResponse.json({ verified, paymentId: verified ? paymentId : undefined }, { status: verified ? 200 : 400 });
}
